import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { cancelNotificationCleanup } from '@/lib/notification-cleanup';

// PATCH - Marquer une notification comme lue
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth(request);
    if (user instanceof NextResponse) {
      return user;
    }

    const { id } = await params;

    const notification = await prisma.notification.update({
      where: {
        id: id,
        userId: user.userId, // S'assurer que l'utilisateur possède la notification
      },
      data: {
        isRead: true,
      },
    });

    return NextResponse.json(notification);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la notification:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer une notification
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth(request);
    if (user instanceof NextResponse) {
      return user;
    }

    const { id } = await params;

    await prisma.notification.delete({
      where: {
        id: id,
        userId: user.userId, // S'assurer que l'utilisateur possède la notification
      },
    });

    // Annuler le timer de nettoyage automatique
    cancelNotificationCleanup(id);

    return NextResponse.json({ message: 'Notification supprimée' });
  } catch (error) {
    console.error('Erreur lors de la suppression de la notification:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
} 