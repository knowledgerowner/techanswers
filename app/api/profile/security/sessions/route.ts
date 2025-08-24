import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

// GET - Récupérer toutes les sessions actives de l'utilisateur
export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    if (user instanceof NextResponse) {
      return user;
    }

    const sessions = await prisma.twoFactorSession.findMany({
      where: {
        userId: user.userId,
        isActive: true,
        expiresAt: { gt: new Date() }
      },
      orderBy: {
        lastUsed: 'desc'
      }
    });

    return NextResponse.json(sessions);
  } catch (error) {
    console.error('Erreur lors de la récupération des sessions:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

// DELETE - Révoquer toutes les sessions de l'utilisateur
export async function DELETE(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    if (user instanceof NextResponse) {
      return user;
    }

    await prisma.twoFactorSession.updateMany({
      where: {
        userId: user.userId,
        isActive: true
      },
      data: {
        isActive: false
      }
    });

    return NextResponse.json({
      message: 'Toutes les sessions ont été révoquées'
    });
  } catch (error) {
    console.error('Erreur lors de la révocation des sessions:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
} 