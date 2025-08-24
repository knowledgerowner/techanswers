import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

// Fonction pour vérifier si l'utilisateur est super admin
async function requireSuperAdminAuth(request: NextRequest) {
  try {
    const payload = verifyToken(request);
    
    if (!payload) {
      return NextResponse.json({ error: 'Token invalide' }, { status: 401 });
    }

    // Si le token ne contient pas isSuperAdmin (token ancien), 
    // on vérifie dans la base de données
    if (payload.isSuperAdmin === undefined) {
      const userData = await prisma.user.findUnique({
        where: { id: payload.userId },
        select: {
          isAdmin: true,
          isSuperAdmin: true,
        },
      });
      
      if (!userData || !userData.isSuperAdmin) {
        return NextResponse.json({ error: 'Droits super administrateur requis' }, { status: 403 });
      }
      
      return payload;
    }
    
    if (!payload.isSuperAdmin) {
      return NextResponse.json({ error: 'Droits super administrateur requis' }, { status: 403 });
    }

    return payload;
  } catch (error) {
    console.error('Erreur d\'authentification:', error);
    return NextResponse.json({ error: 'Erreur d\'authentification' }, { status: 500 });
  }
}

// GET - Récupérer tous les utilisateurs
export async function GET(request: NextRequest) {
  try {
    const admin = await requireSuperAdminAuth(request);
    if (admin instanceof NextResponse) {
      return admin;
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    const role = searchParams.get('role') || 'all';

    const skip = (page - 1) * limit;

    // Construire les conditions de recherche
    const where: any = {}; // eslint-disable-line @typescript-eslint/no-explicit-any

    if (search) {
      where.OR = [
        { username: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (role === 'admin') {
      where.isAdmin = true;
    } else if (role === 'user') {
      where.isAdmin = false;
    }

    // Récupérer les utilisateurs avec leurs statistiques
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          _count: {
            select: {
              articles: true,
              comments: true,
            },
          },
        },
      }) as any, // eslint-disable-line @typescript-eslint/no-explicit-any
      prisma.user.count({ where }),
    ]);

    // Transformer les données pour inclure les compteurs
    const usersWithCounts = users.map((user: any) => ({ // eslint-disable-line @typescript-eslint/no-explicit-any
      id: user.id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
      isSuperAdmin: user.isSuperAdmin,
      createdAt: user.createdAt,
      articleCount: user._count.articles,
      commentCount: user._count.comments,
    }));

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      users: usersWithCounts,
      pagination: {
        page,
        limit,
        total,
        pages: totalPages,
      },
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

// POST - Créer un nouvel utilisateur
export async function POST(request: NextRequest) {
  try {
    const admin = await requireSuperAdminAuth(request);
    if (admin instanceof NextResponse) {
      return admin;
    }

    const body = await request.json();
    const { username, email, password, isAdmin = false } = body;

    // Validation
    if (!username || !email || !password) {
      return NextResponse.json(
        { error: 'Nom d\'utilisateur, email et mot de passe requis' },
        { status: 400 }
      );
    }

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { username },
          { email }
        ]
      }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Un utilisateur avec ce nom d\'utilisateur ou cet email existe déjà' },
        { status: 409 }
      );
    }

    // Hasher le mot de passe
    const bcrypt = require('bcryptjs'); // eslint-disable-line @typescript-eslint/no-require-imports
    const hashedPassword = await bcrypt.hash(password, 12);

    // Créer l'utilisateur
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        isAdmin,
      },
      select: {
        id: true,
        username: true,
        email: true,
        isAdmin: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de la création de l\'utilisateur:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
} 