import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    if (user instanceof NextResponse) {
      return user;
    }

    const purchases = await prisma.purchaseHistory.findMany({
      where: {
        userId: user.userId
      },
      include: {
        article: {
          select: {
            title: true,
            slug: true,
            excerpt: true,
            imageUrl: true,
            isPremium: true,
            isBilled: true,
            premiumPrice: true,
            billedPrice: true
          }
        }
      },
      orderBy: {
        purchaseDate: 'desc'
      }
    });

    return NextResponse.json({ purchases });
  } catch (error) {
    console.error('Erreur lors de la récupération des achats:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des achats' },
      { status: 500 }
    );
  }
} 