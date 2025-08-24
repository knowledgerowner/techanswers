import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { page, sessionId } = await request.json();
    
    if (!page) {
      return NextResponse.json(
        { error: 'Page URL requise' },
        { status: 400 }
      );
    }

    // Exclure les pages admin
    if (page.startsWith('/admin')) {
      return NextResponse.json(
        { error: 'Pages admin exclues du comptage' },
        { status: 400 }
      );
    }

    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               request.headers.get('cf-connecting-ip') ||
               'unknown';
    const userAgent = request.headers.get('user-agent') || '';
    const referrer = request.headers.get('referer') || null;

    // Créer un enregistrement de vue comptée
    const countedView = await prisma.pageView.create({
      data: {
        page,
        title: page,
        sessionId: sessionId || 'anonymous',
        ip,
        userAgent,
        referrer,
        timeOnPage: 10, // Minimum 10 secondes
        scrollDepth: 0,
      },
    });

    console.log('✅ Vue comptée après 10s:', page, 'IP:', ip);

    return NextResponse.json({ 
      success: true, 
      countedViewId: countedView.id 
    });
  } catch (error) {
    console.error('Erreur lors du comptage de la vue:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
} 