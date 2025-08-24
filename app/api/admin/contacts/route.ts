import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

// Fonction pour vérifier si l'utilisateur est admin
async function requireAdmin(request: NextRequest) {
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
      
      if (!userData || (!userData.isAdmin && !userData.isSuperAdmin)) {
        return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
      }
      
      return payload;
    }

    if (!payload.isAdmin && !payload.isSuperAdmin) {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
    }

    return payload;
  } catch (error) {
    console.error('Erreur d\'authentification:', error);
    return NextResponse.json({ error: 'Erreur d\'authentification' }, { status: 500 });
  }
}

// GET - Récupérer tous les contacts
export async function GET(request: NextRequest) {
  try {
    const admin = await requireAdmin(request);
    if (admin instanceof NextResponse) {
      return admin;
    }

    const contacts = await prisma.contact.findMany({
      include: {
        user: {
          select: {
            username: true,
          },
        },
        replies: {
          include: {
            user: {
              select: {
                username: true,
              },
            },
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ contacts });
  } catch (error) {
    console.error('Erreur lors de la récupération des contacts:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
} 