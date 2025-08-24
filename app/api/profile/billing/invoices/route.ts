import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    if (user instanceof NextResponse) {
      return user;
    }

    const invoices = await prisma.invoice.findMany({
      where: {
        userId: user.userId
      },
      include: {
        items: {
          include: {
            article: {
              select: {
                title: true,
                slug: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({ invoices });
  } catch (error) {
    console.error('Erreur lors de la récupération des factures:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des factures' },
      { status: 500 }
    );
  }
} 