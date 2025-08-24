import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdminAsync } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // Vérifier les droits d'administration
    await requireAdminAsync(request);

    const payments = await prisma.payment.findMany({
      include: {
        user: {
          select: {
            username: true,
            email: true,
          },
        },
        article: {
          select: {
            title: true,
            slug: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(payments);
  } catch (error) {
    console.error('Erreur lors de la récupération des paiements:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des paiements' },
      { status: 500 }
    );
  }
} 