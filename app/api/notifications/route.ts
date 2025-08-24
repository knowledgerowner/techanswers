import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { scheduleNotificationCleanup, cancelNotificationCleanup } from '@/lib/notification-cleanup';

// GET - Récupérer les notifications de l'utilisateur
export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    if (user instanceof NextResponse) {
      return user;
    }

    const notifications = await prisma.notification.findMany({
      where: {
        userId: user.userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 50, // Limiter à 50 notifications
    });

    return NextResponse.json(notifications);
  } catch (error) {
    console.error('Erreur lors de la récupération des notifications:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

// POST - Créer une nouvelle notification
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    if (user instanceof NextResponse) {
      return user;
    }

    const { type, title, message, priority = 'NORMAL' } = await request.json();

    const notification = await prisma.notification.create({
      data: {
        userId: user.userId,
        type,
        title,
        message,
        priority,
        isRead: false,
      },
    });

    // Programmer la suppression automatique après 2 semaines
    scheduleNotificationCleanup(notification.id, notification.createdAt);

    return NextResponse.json(notification);
  } catch (error) {
    console.error('Erreur lors de la création de la notification:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer toutes les notifications de l'utilisateur
export async function DELETE(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    if (user instanceof NextResponse) {
      return user;
    }

    // Récupérer toutes les notifications de l'utilisateur pour annuler leurs timers
    const userNotifications = await prisma.notification.findMany({
      where: {
        userId: user.userId,
      },
      select: {
        id: true,
      },
    });

    // Annuler tous les timers de nettoyage
    userNotifications.forEach(notification => {
      cancelNotificationCleanup(notification.id);
    });

    // Supprimer toutes les notifications
    await prisma.notification.deleteMany({
      where: {
        userId: user.userId,
      },
    });

    return NextResponse.json({ message: 'Toutes les notifications ont été supprimées' });
  } catch (error) {
    console.error('Erreur lors de la suppression des notifications:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
} 