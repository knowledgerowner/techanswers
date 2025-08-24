import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdminAsync } from '@/lib/auth';

// GET - Récupérer tous les contacts
export async function GET(request: NextRequest) {
  try {
    const admin = await requireAdminAsync(request);
    if (admin instanceof NextResponse) {
      return admin;
    }

    const contacts = await prisma.contact.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        subject: true,
        message: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        userId: true,
        user: {
          select: {
            username: true,
          },
        },
        replies: {
          select: {
            id: true,
            content: true,
            createdAt: true,
            userId: true,
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ contacts });
  } catch (error) {
    console.error('Erreur lors de la récupération des contacts:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
} 