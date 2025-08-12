import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
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
        categoryIds: true,
        createdAt: true,
        admin: {
          select: {
            username: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 15,
    });

    return NextResponse.json(recentArticles);
  } catch (error) {
    console.error('Erreur lors de la récupération des articles récents:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
} 