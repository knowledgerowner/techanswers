import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { notifyArticlePublished } from '@/lib/notifications';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const admin = await requireAdmin(request);
    if (admin instanceof NextResponse) {
      return admin;
    }

    const body = await request.json();
    const { categoryIds = [] } = body;

    if (categoryIds.length === 0) {
      return NextResponse.json(
        { error: 'Veuillez spécifier au moins une catégorie' },
        { status: 400 }
      );
    }

    // Vérifier que les catégories existent
    const categories = await prisma.category.findMany({
      where: { id: { in: categoryIds } }
    });

    if (categories.length !== categoryIds.length) {
      return NextResponse.json(
        { error: 'Certaines catégories n\'existent pas' },
        { status: 400 }
      );
    }

    // Vérifier les abonnements existants
    const subscriptions = await prisma.categorySubscription.findMany({
      where: {
        categoryId: { in: categoryIds },
        notifyOnPublish: true,
        frequency: { not: 'NEVER' }
      },
      include: {
        user: {
          include: {
            notificationSettings: {
              include: {
                emailNotifications: true
              }
            }
          }
        },
        category: true
      }
    });

    console.log('🔍 [TEST] Abonnements trouvés:', subscriptions.length);
    subscriptions.forEach(sub => {
      console.log(`🔍 [TEST] - ${sub.user.username} abonné à ${sub.category.name}`);
    });

    // Données de test pour un article
    const testArticleData = {
      articleId: 'test-article-' + Date.now(),
      articleTitle: 'Article de test pour les notifications',
      articleSlug: 'article-test-notifications-' + Date.now(),
      categoryIds: categoryIds,
      authorUsername: admin.username
    };

    console.log('🔍 [TEST] Début test notification article');
    console.log('🔍 [TEST] Données article:', testArticleData);

    // Envoyer la notification
    await notifyArticlePublished(testArticleData);

    return NextResponse.json({
      message: 'Test de notification d\'article terminé',
      articleData: testArticleData,
      subscriptionsFound: subscriptions.length,
      categories: categories.map(c => ({ id: c.id, name: c.name })),
      users: subscriptions.map(s => ({ 
        username: s.user.username, 
        email: s.user.email,
        category: s.category.name,
        wantsEmail: s.user.notificationSettings?.emailNotifications?.articlePublished,
        wantsInApp: s.user.notificationSettings?.inAppNotifications !== false
      }))
    });
  } catch (error) {
    console.error('❌ [TEST] Erreur lors du test de notification:', error);
    return NextResponse.json(
      { error: 'Erreur lors du test de notification' },
      { status: 500 }
    );
  }
} 