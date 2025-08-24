import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Récupérer les derniers articles publiés
    const recentArticles = await prisma.article.findMany({
      where: {
        isPublished: true,
      },
      select: {
        id: true,
        title: true,
        excerpt: true,
        slug: true,
        imageUrl: true,
        isMarketing: true,
        isPremium: true,
        premiumPrice: true,
        categoryIds: true,
        createdAt: true,
        user: {
          select: {
            username: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 15, // Limiter à 15 derniers articles
    });

    return NextResponse.json(recentArticles);
  } catch (error) {
    console.error('Erreur lors de la récupération des derniers articles:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
} 