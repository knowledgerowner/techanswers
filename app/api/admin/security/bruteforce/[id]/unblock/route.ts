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

    if (!payload.isAdmin && !payload.isSuperAdmin) {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
    }

    return payload;
  } catch (error) {
    console.error('Erreur d\'authentification:', error);
    return NextResponse.json({ error: 'Erreur d\'authentification' }, { status: 500 });
  }
}

// POST - Débloquer une IP
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const admin = await requireAdmin(request);
    if (admin instanceof NextResponse) {
      return admin;
    }

    // Vérifier que la tentative existe
    const attempt = await prisma.bruteforceAttempt.findUnique({
      where: { id },
    });

    if (!attempt) {
      return NextResponse.json(
        { error: 'Tentative non trouvée' },
        { status: 404 }
      );
    }

    // Débloquer l'IP
    const updatedAttempt = await prisma.bruteforceAttempt.update({
      where: { id },
      data: {
        isBlocked: false,
        blockedUntil: null,
        attempts: 0, // Réinitialiser le compteur de tentatives
      },
    });

    return NextResponse.json({ 
      message: 'IP débloquée avec succès',
      attempt: updatedAttempt 
    });
  } catch (error) {
    console.error('Erreur lors du déblocage de l\'IP:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
} 