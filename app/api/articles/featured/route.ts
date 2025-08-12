import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const featuredArticles = await prisma.article.findMany({
      where: {
        isPublished: true,
        OR: [
          { isMarketing: true },
          { isAuto: false } // Articles non automatiques en priorité
        ]
      },
      select: {
        id: true,
        title: true,
        excerpt: true,
        slug: true,
        imageUrl: true,
        isMarketing: true,
        categoryIds: true,
        createdAt: true,
        user: {
          select: {
            username: true,
          },
        },
      },
      orderBy: [
        { isMarketing: 'desc' }, // Marketing en premier
        { createdAt: 'desc' }    // Puis par date
      ],
      take: 6, // Limite à 6 articles
    });

    return NextResponse.json(featuredArticles);
  } catch (error) {
    console.error('Erreur lors de la récupération des articles:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
} 