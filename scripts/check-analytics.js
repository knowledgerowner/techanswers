const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkAnalytics() {
  try {
    console.log('🔍 Vérification des données d\'analytics...\n');

    // Vérifier les PageViews
    const pageViews = await prisma.pageView.findMany({
      take: 10,
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log('📊 PageViews (10 derniers):');
    console.log(`Total PageViews: ${await prisma.pageView.count()}`);
    pageViews.forEach((pv, index) => {
      console.log(`${index + 1}. ${pv.page} - ${pv.createdAt} - IP: ${pv.ip}`);
    });

    console.log('\n📊 UserSessions (10 derniers):');
    const userSessions = await prisma.userSession.findMany({
      take: 10,
      orderBy: {
        startTime: 'desc'
      }
    });

    console.log(`Total UserSessions: ${await prisma.userSession.count()}`);
    userSessions.forEach((us, index) => {
      console.log(`${index + 1}. Session: ${us.sessionId} - IP: ${us.ip} - PageViews: ${us.pageViews}`);
    });

    console.log('\n📊 ArticleViews (10 derniers):');
    const articleViews = await prisma.articleView.findMany({
      take: 10,
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log(`Total ArticleViews: ${await prisma.articleView.count()}`);
    articleViews.forEach((av, index) => {
      console.log(`${index + 1}. Article: ${av.articleId} - Session: ${av.sessionId}`);
    });

    // Vérifier les pages les plus visitées
    console.log('\n🏆 Pages les plus visitées:');
    const topPages = await prisma.pageView.groupBy({
      by: ['page'],
      _count: {
        page: true
      },
      orderBy: {
        _count: {
          page: 'desc'
        }
      },
      take: 10
    });

    topPages.forEach((page, index) => {
      console.log(`${index + 1}. ${page.page}: ${page._count.page} vues`);
    });

    // Vérifier les appareils
    console.log('\n📱 Répartition par appareil:');
    const devices = await prisma.pageView.groupBy({
      by: ['device'],
      _count: {
        device: true
      },
      orderBy: {
        _count: {
          device: 'desc'
        }
      }
    });

    devices.forEach((device, index) => {
      console.log(`${index + 1}. ${device.device || 'Unknown'}: ${device._count.device} vues`);
    });

  } catch (error) {
    console.error('❌ Erreur lors de la vérification:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAnalytics(); 