import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const user = verifyToken(request);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    // Récupérer les informations complètes de l'utilisateur
    const userData = await prisma.user.findUnique({
      where: { id: user.userId },
      select: {
        id: true,
        username: true,
        email: true,
        isAdmin: true,
        isSuperAdmin: true,
        hasPurchased: true,
        createdAt: true,
        twoFactorEnabled: true,
        lastLoginAt: true,
        isEmailVerified: true,
      },
    });

    if (!userData) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    return NextResponse.json(userData);
  } catch (error) {
    console.error('Erreur lors de la récupération des données utilisateur:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
} 