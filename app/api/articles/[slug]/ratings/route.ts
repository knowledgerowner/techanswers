import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    // Vérifier l'authentification
    const payload = verifyToken(request);
    if (!payload) {
      return NextResponse.json(
        { error: 'Vous devez être connecté pour noter un article' },
        { status: 401 }
      );
    }

    const { rating } = await request.json();
    
    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'La note doit être comprise entre 1 et 5' },
        { status: 400 }
      );
    }

    const { slug } = await params;

    // Récupérer l'article et l'utilisateur
    const [article, user] = await Promise.all([
      prisma.article.findUnique({
        where: { slug: slug },
        select: { id: true }
      }),
      prisma.user.findUnique({
        where: { id: payload.userId },
        select: { username: true }
      })
    ]);

    if (!article) {
      return NextResponse.json(
        { error: 'Article non trouvé' },
        { status: 404 }
      );
    }

    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    // Vérifier si l'utilisateur a déjà noté cet article
    const existingRating = await prisma.rating.findFirst({
      where: {
        articleId: article.id,
        userId: payload.userId,
      },
    });

    let ratingRecord;
    if (existingRating) {
      // Mettre à jour la note existante
      ratingRecord = await prisma.rating.update({
        where: { id: existingRating.id },
        data: { 
          rating,
          updatedAt: new Date(),
        },
        include: {
          user: {
            select: {
              username: true,
            },
          },
        },
      });
      console.log('✅ Note mise à jour pour l\'utilisateur:', user.username, 'Article:', slug, 'Note:', rating);
    } else {
      // Créer une nouvelle note
      ratingRecord = await prisma.rating.create({
        data: {
          rating,
          articleId: article.id,
          userId: payload.userId,
          authorName: user.username,
        },
        include: {
          user: {
            select: {
              username: true,
            },
          },
        },
      });
      console.log('✅ Nouvelle note créée pour l\'utilisateur:', user.username, 'Article:', slug, 'Note:', rating);
    }

    return NextResponse.json(ratingRecord);
  } catch (error) {
    console.error('Erreur lors de la création de la note:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    
    // Récupérer l'article
    const article = await prisma.article.findUnique({
      where: { slug: slug },
      select: { id: true }
    });

    if (!article) {
      return NextResponse.json(
        { error: 'Article non trouvé' },
        { status: 404 }
      );
    }

    // Récupérer les notes
    const ratings = await prisma.rating.findMany({
      where: {
        articleId: article.id,
      },
      include: {
        user: {
          select: {
            username: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(ratings);
  } catch (error) {
    console.error('Erreur lors de la récupération des notes:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
} 