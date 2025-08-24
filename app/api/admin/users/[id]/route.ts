import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdminAsync } from '@/lib/auth';

// Fonction pour vérifier si l'utilisateur est super admin
async function requireSuperAdminAuth(request: NextRequest) {
  try {
    const admin = await requireAdminAsync(request);
    
    if (!admin.isSuperAdmin) {
      return NextResponse.json({ error: 'Droits super administrateur requis' }, { status: 403 });
    }

    return admin;
  } catch (error) {
    console.error('Erreur d\'authentification:', error);
    return NextResponse.json({ error: 'Erreur d\'authentification' }, { status: 500 });
  }
}

// GET - Récupérer un utilisateur spécifique
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const admin = await requireSuperAdminAuth(request);
    if (admin instanceof NextResponse) {
      return admin;
    }

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        email: true,
        isAdmin: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            articles: true,
            comments: true,
            contacts: true,
            payments: true,
          },
        },
        articles: {
          select: {
            id: true,
            title: true,
            slug: true,
            isPublished: true,
            createdAt: true,
          },
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
        comments: {
          select: {
            id: true,
            content: true,
            createdAt: true,
            article: {
              select: {
                title: true,
                slug: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'utilisateur:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

// PUT - Mettre à jour un utilisateur
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const admin = await requireSuperAdminAuth(request);
    if (admin instanceof NextResponse) {
      return admin;
    }

    const body = await request.json();
    const { username, email, isAdmin } = body;

    // Validation
    if (!username || !email) {
      return NextResponse.json(
        { error: 'Nom d\'utilisateur et email requis' },
        { status: 400 }
      );
    }

    // Vérifier si l'utilisateur existe
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    // Vérifier si le nom d'utilisateur ou l'email existe déjà
    const duplicateUser = await prisma.user.findFirst({
      where: {
        OR: [
          { username },
          { email }
        ],
        NOT: {
          id
        }
      }
    });

    if (duplicateUser) {
      return NextResponse.json(
        { error: 'Un utilisateur avec ce nom d\'utilisateur ou cet email existe déjà' },
        { status: 409 }
      );
    }

    // Mettre à jour l'utilisateur
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        username,
        email,
        isAdmin: isAdmin !== undefined ? isAdmin : existingUser.isAdmin,
      },
      select: {
        id: true,
        username: true,
        email: true,
        isAdmin: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer un utilisateur
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const admin = await requireSuperAdminAuth(request);
    if (admin instanceof NextResponse) {
      return admin;
    }

    // Empêcher la s   uppression de soi-même
    if (admin.userId === id) {
      return NextResponse.json(
        { error: 'Vous ne pouvez pas supprimer votre propre compte' },
        { status: 400 }
      );
    }

    // Vérifier si l'utilisateur existe
    const existingUser = await prisma.user.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            articles: true,
            comments: true,
            contacts: true,
            payments: true,
          },
        },
      },
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    // Supprimer TOUTES les données de l'utilisateur en cascade
    console.log(`🗑️ [USER DELETE] Suppression de l'utilisateur ${id} avec toutes ses données...`);
    
    // 1. Supprimer les codes 2FA
    const deleted2FACodes = await prisma.twoFactorCode.deleteMany({
      where: { userId: id }
    });
    console.log(`   - Codes 2FA supprimés: ${deleted2FACodes.count}`);

    // 3. Supprimer les tentatives de bruteforce (par IP de l'utilisateur)
    const deletedBruteforce = await prisma.bruteforceAttempt.deleteMany({
      where: { ip: existingUser.email } // Utiliser l'email comme identifiant
    });
    console.log(`   - Tentatives bruteforce supprimées: ${deletedBruteforce.count}`);

    // 4. Supprimer les analytics (PageViews, ArticleViews, UserSessions)
    const deletedPageViews = await prisma.pageView.deleteMany({
      where: { userId: id }
    });
    console.log(`   - PageViews supprimées: ${deletedPageViews.count}`);

    const deletedArticleViews = await prisma.articleView.deleteMany({
      where: { userId: id }
    });
    console.log(`   - ArticleViews supprimées: ${deletedArticleViews.count}`);

    const deletedUserSessions = await prisma.userSession.deleteMany({
      where: { userId: id }
    });
    console.log(`   - UserSessions supprimées: ${deletedUserSessions.count}`);

    // 5. Supprimer les notifications
    const deletedNotifications = await prisma.notification.deleteMany({
      where: { userId: id }
    });
    console.log(`   - Notifications supprimées: ${deletedNotifications.count}`);

    // 6. Supprimer les commentaires
    const deletedComments = await prisma.comment.deleteMany({
      where: { userId: id }
    });
    console.log(`   - Commentaires supprimés: ${deletedComments.count}`);

    // 7. Supprimer les contacts
    const deletedContacts = await prisma.contact.deleteMany({
      where: { userId: id }
    });
    console.log(`   - Contacts supprimés: ${deletedContacts.count}`);

    // 8. Supprimer les abonnements aux catégories
    const deletedCategorySubscriptions = await prisma.categorySubscription.deleteMany({
      where: { userId: id }
    });
    console.log(`   - Abonnements aux catégories supprimés: ${deletedCategorySubscriptions.count}`);

    // 9. Supprimer l'historique des achats AVANT les paiements
    const deletedPurchaseHistory = await prisma.purchaseHistory.deleteMany({
      where: { userId: id }
    });
    console.log(`   - Historique des achats supprimé: ${deletedPurchaseHistory.count}`);

    // 10. Maintenant supprimer les paiements (après avoir supprimé PurchaseHistory)
    const deletedPayments = await prisma.payment.deleteMany({
      where: { userId: id }
    });
    console.log(`   - Paiements supprimés: ${deletedPayments.count}`);

    // 11. Supprimer les articles créés par l'utilisateur
    const deletedArticles = await prisma.article.deleteMany({
      where: { userId: id }
    });
    console.log(`   - Articles supprimés: ${deletedArticles.count}`);

    // 12. Supprimer les évaluations d'articles
    const deletedRatings = await prisma.rating.deleteMany({
      where: { userId: id }
    });
    console.log(`   - Évaluations supprimées: ${deletedRatings.count}`);

    // 13. Supprimer les sessions 2FA
    const deleted2FASessions = await prisma.twoFactorSession.deleteMany({
      where: { userId: id }
    });
    console.log(`   - Sessions 2FA supprimées: ${deleted2FASessions.count}`);

    // 14. Supprimer les factures et leurs éléments
    const deletedInvoices = await prisma.invoice.deleteMany({
      where: { userId: id }
    });
    console.log(`   - Factures supprimées: ${deletedInvoices.count}`);

    // 15. Enfin, supprimer l'utilisateur lui-même
    await prisma.user.delete({
      where: { id },
    });

    console.log(`✅ [USER DELETE] Utilisateur ${id} supprimé avec succès`);
    console.log(`📊 [USER DELETE] Résumé des suppressions:`);
    console.log(`   - Articles: ${deletedArticles.count}`);
    console.log(`   - Commentaires: ${deletedComments.count}`);
    console.log(`   - Contacts: ${deletedContacts.count}`);
    console.log(`   - Paiements: ${deletedPayments.count}`);
    console.log(`   - Historique des achats: ${deletedPurchaseHistory.count}`);
    console.log(`   - Factures: ${deletedInvoices.count}`);
    console.log(`   - Analytics: ${deletedPageViews.count} + ${deletedArticleViews.count} + ${deletedUserSessions.count}`);
    console.log(`   - 2FA: ${deleted2FASessions.count} + ${deleted2FACodes.count}`);
    console.log(`   - Autres: ${deletedNotifications.count} + ${deletedRatings.count} + ${deletedCategorySubscriptions.count}`);

    return NextResponse.json({ message: 'Utilisateur supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'utilisateur:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
} 