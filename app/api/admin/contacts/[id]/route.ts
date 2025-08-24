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

// PATCH - Mettre à jour le statut d'un contact
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const admin = await requireAdmin(request);
    if (admin instanceof NextResponse) {
      return admin;
    }

    const body = await request.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json(
        { error: 'Le statut est requis' },
        { status: 400 }
      );
    }

    const validStatuses = ['PENDING', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Statut invalide' },
        { status: 400 }
      );
    }

    const contact = await prisma.contact.update({
      where: { id },
      data: { status },
      include: {
        user: {
          select: {
            username: true,
          },
        },
        replies: {
          include: {
            user: {
              select: {
                username: true,
              },
            },
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });

    return NextResponse.json({ contact });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du contact:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
} 