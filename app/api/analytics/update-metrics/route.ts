import { NextRequest, NextResponse } from 'next/server';
import { updatePageViewMetrics } from '@/lib/analytics';

export async function POST(request: NextRequest) {
  try {
    const { sessionId, page, timeOnPage, scrollDepth } = await request.json();
    
    if (!sessionId || !page || timeOnPage === undefined) {
      return NextResponse.json(
        { error: 'sessionId, page et timeOnPage requis' },
        { status: 400 }
      );
    }

    // Mettre à jour les métriques de la page
    await updatePageViewMetrics(sessionId, page, timeOnPage, scrollDepth);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur lors de la mise à jour des métriques:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
} 