import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import bcrypt from 'bcryptjs';

// POST - Désactiver la 2FA
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    if (user instanceof NextResponse) {
      return user;
    }

    const { currentPassword } = await request.json();

    if (!currentPassword) {
      return NextResponse.json(
        { error: 'Mot de passe requis' },
        { status: 400 }
      );
    }

    // Récupérer l'utilisateur avec le mot de passe hashé
    const userWithPassword = await prisma.user.findUnique({
      where: { id: user.userId }
    });

    if (!userWithPassword) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(currentPassword, userWithPassword.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Mot de passe incorrect' },
        { status: 401 }
      );
    }

    // Vérifier si la 2FA est activée
    if (!userWithPassword.twoFactorEnabled) {
      return NextResponse.json(
        { error: 'La 2FA n\'est pas activée' },
        { status: 400 }
      );
    }

    // Désactiver la 2FA
    await prisma.user.update({
      where: { id: user.userId },
      data: {
        twoFactorEnabled: false,
        twoFactorSecret: null
      }
    });

    // Supprimer tous les codes 2FA de l'utilisateur
    await prisma.twoFactorCode.deleteMany({
      where: { userId: user.userId }
    });

    // Désactiver toutes les sessions 2FA
    await prisma.twoFactorSession.updateMany({
      where: { userId: user.userId },
      data: { isActive: false }
    });

    return NextResponse.json({
      message: '2FA désactivée avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la désactivation de la 2FA:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
} 