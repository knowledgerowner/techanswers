import { NextRequest, NextResponse } from 'next/server';
import { trackArticleView } from '@/lib/analytics';

export async function POST(request: NextRequest) {
  try {
    const { articleId, sessionId } = await request.json();
    
    if (!articleId) {
      return NextResponse.json(
        { error: 'ID de l\'article requis' },
        { status: 400 }
      );
    }

    // Tracker la vue d'article
    const newSessionId = await trackArticleView(request, articleId, sessionId);

    return NextResponse.json({ 
      success: true, 
      sessionId: newSessionId 
    });
  } catch (error) {
    console.error('Erreur lors du tracking de la vue d\'article:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
} 