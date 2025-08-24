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
        { error: 'Vous devez être connecté pour commenter' },
        { status: 401 }
      );
    }

    const { content } = await request.json();
    
    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { error: 'Le contenu du commentaire est requis' },
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

    // Créer le commentaire
    const comment = await prisma.comment.create({
      data: {
        content: content.trim(),
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

    return NextResponse.json(comment);
  } catch (error) {
    console.error('Erreur lors de la création du commentaire:', error);
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

    // Récupérer les commentaires
    const comments = await prisma.comment.findMany({
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

    return NextResponse.json(comments);
  } catch (error) {
    console.error('Erreur lors de la récupération des commentaires:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
} 