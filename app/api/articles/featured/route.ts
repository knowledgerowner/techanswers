import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Récupérer les articles marketing (à la une)
    const featuredArticles = await prisma.article.findMany({
      where: {
        isPublished: true,
        isMarketing: true,
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
      take: 3, // Limiter à 3 articles à la une
    });

    return NextResponse.json(featuredArticles);
  } catch (error) {
    console.error('Erreur lors de la récupération des articles à la une:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
} 