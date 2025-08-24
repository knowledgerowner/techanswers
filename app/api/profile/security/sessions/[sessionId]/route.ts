import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

// DELETE - Révoquer une session spécifique
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const user = await requireAuth(request);
    if (user instanceof NextResponse) {
      return user;
    }

    const { sessionId } = await params;

    // Vérifier que la session appartient à l'utilisateur
    const session = await prisma.twoFactorSession.findFirst({
      where: {
        sessionId,
        userId: user.userId,
        isActive: true
      }
    });

    if (!session) {
      return NextResponse.json(
        { error: 'Session non trouvée ou déjà révoquée' },
        { status: 404 }
      );
    }

    // Révoquer la session
    await prisma.twoFactorSession.update({
      where: {
        id: session.id
      },
      data: {
        isActive: false
      }
    });

    return NextResponse.json({
      message: 'Session révoquée avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la révocation de la session:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
} 