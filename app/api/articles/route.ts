import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '9');
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const sort = searchParams.get('sort') || 'date';
    const isMarketing = searchParams.get('isMarketing');

    const skip = (page - 1) * limit;

    // Construire les conditions de recherche
    const where: any = { // eslint-disable-line @typescript-eslint/no-explicit-any
      isPublished: true,
    };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (category) {
      where.categoryIds = { has: category };
    }

    if (isMarketing === 'true') {
      where.isMarketing = true;
    }

    // Construire l'ordre de tri
    const orderBy: any = {}; // eslint-disable-line @typescript-eslint/no-explicit-any
    if (sort === 'title') {
      orderBy.title = 'asc';
    } else {
      orderBy.createdAt = 'desc';
    }

    // Récupérer les articles avec pagination
    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where,
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
        orderBy,
        skip,
        take: limit,
      }),
      prisma.article.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      articles,
      totalPages,
      currentPage: page,
      total,
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des articles:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
} 