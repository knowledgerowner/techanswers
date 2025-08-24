import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

// GET - Récupérer tous les abonnements de l'utilisateur
export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    if (user instanceof NextResponse) {
      return user;
    }

    const subscriptions = await prisma.categorySubscription.findMany({
      where: {
        userId: user.userId
      },
      include: {
        category: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(subscriptions);
  } catch (error) {
    console.error('Erreur lors de la récupération des abonnements:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

// POST - Créer un nouvel abonnement
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    if (user instanceof NextResponse) {
      return user;
    }

    const {
      categoryId,
      type = 'ALL_ARTICLES',
      notifyOnPublish = true,
      notifyOnUpdate = false,
      notifyOnComment = false,
      frequency = 'IMMEDIATE'
    } = await request.json();

    if (!categoryId) {
      return NextResponse.json(
        { error: 'ID de catégorie requis' },
        { status: 400 }
      );
    }

    // Vérifier si la catégorie existe
    const category = await prisma.category.findUnique({
      where: { id: categoryId }
    });

    if (!category) {
      return NextResponse.json(
        { error: 'Catégorie non trouvée' },
        { status: 404 }
      );
    }

    // Vérifier si l'utilisateur est déjà abonné
    const existingSubscription = await prisma.categorySubscription.findFirst({
      where: {
        userId: user.userId,
        categoryId
      }
    });

    if (existingSubscription) {
      return NextResponse.json(
        { error: 'Vous êtes déjà abonné à cette catégorie' },
        { status: 400 }
      );
    }

    // Créer l'abonnement
    const subscription = await prisma.categorySubscription.create({
      data: {
        userId: user.userId,
        categoryId,
        type,
        notifyOnPublish,
        notifyOnUpdate,
        notifyOnComment,
        frequency
      },
      include: {
        category: true
      }
    });

    return NextResponse.json(subscription, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de la création de l\'abonnement:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
} 