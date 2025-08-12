import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    // Compter les articles publiés pour chaque catégorie
    const categoriesWithCount = await Promise.all(
      categories.map(async (category) => {
        const articleCount = await prisma.article.count({
          where: {
            isPublished: true,
            categoryIds: {
              has: category.id,
            },
          },
        });

        return {
          ...category,
          _count: {
            articles: articleCount,
          },
        };
      })
    );

    return NextResponse.json(categoriesWithCount);
  } catch (error) {
    console.error('Erreur lors de la récupération des catégories:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
} 