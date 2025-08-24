import { NextRequest, NextResponse } from 'next/server';
import { updateArticleViewMetrics } from '@/lib/analytics';

export async function POST(request: NextRequest) {
  try {
    const { sessionId, articleId, timeOnPage, scrollDepth, readProgress } = await request.json();
    
    if (!sessionId || !articleId || timeOnPage === undefined) {
      return NextResponse.json(
        { error: 'sessionId, articleId et timeOnPage requis' },
        { status: 400 }
      );
    }

    // Mettre à jour les métriques de l'article
    await updateArticleViewMetrics(sessionId, articleId, timeOnPage, scrollDepth, readProgress);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur lors de la mise à jour des métriques d\'article:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
} 