import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

// POST - Marquer toutes les notifications comme lues
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    if (user instanceof NextResponse) {
      return user;
    }

    await prisma.notification.updateMany({
      where: {
        userId: user.userId,
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });

    return NextResponse.json({ message: 'Toutes les notifications ont été marquées comme lues' });
  } catch (error) {
    console.error('Erreur lors du marquage des notifications:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
} 