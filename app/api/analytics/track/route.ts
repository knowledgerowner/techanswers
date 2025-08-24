import { NextRequest, NextResponse } from 'next/server';
import { trackPageView } from '@/lib/analytics';

export async function POST(request: NextRequest) {
  try {
    const { page, title, sessionId } = await request.json();
    
    if (!page) {
      return NextResponse.json(
        { error: 'Page URL requise' },
        { status: 400 }
      );
    }

    // Exclure les pages admin
    if (page.startsWith('/admin')) {
      return NextResponse.json(
        { error: 'Pages admin exclues du tracking' },
        { status: 400 }
      );
    }

    // Tracker la vue de page (pour tous les utilisateurs)
    const newSessionId = await trackPageView(request, page, title, sessionId);

    return NextResponse.json({ 
      success: true, 
      sessionId: newSessionId 
    });
  } catch (error) {
    console.error('Erreur lors du tracking de la vue:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
} 