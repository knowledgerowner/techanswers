import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { notifyArticlePublished } from '@/lib/notifications';

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    if (user instanceof NextResponse) {
      return user;
    }

    // Données de test pour un article
    const testArticleData = {
      articleId: 'test-article-id',
      articleTitle: 'Article de test pour les notifications',
      articleSlug: 'article-test-notifications',
      categoryIds: ['test-category-id'],
      authorUsername: 'Admin'
    };

    // Envoyer la notification
    await notifyArticlePublished(testArticleData);

    return NextResponse.json({
      message: 'Notification de test envoyée avec succès',
      articleData: testArticleData
    });
  } catch (error) {
    console.error('Erreur lors du test de notification:', error);
    return NextResponse.json(
      { error: 'Erreur lors du test de notification' },
      { status: 500 }
    );
  }
} 