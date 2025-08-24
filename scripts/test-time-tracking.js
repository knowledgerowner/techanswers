const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testTimeTracking() {
  try {
    console.log('🔍 Test du tracking du temps...\n');

    // Vérifier les PageViews avec du temps
    const pageViewsWithTime = await prisma.pageView.findMany({
      where: {
        timeOnPage: {
          gt: 0
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 10
    });

    console.log('📊 PageViews avec du temps passé (10 derniers):');
    console.log(`Total PageViews avec temps: ${pageViewsWithTime.length}`);
    pageViewsWithTime.forEach((pv, index) => {
      console.log(`${index + 1}. ${pv.page} - ${pv.timeOnPage}s - ${pv.scrollDepth}% scroll - ${pv.createdAt}`);
    });

    // Calculer la durée moyenne
    const allPageViews = await prisma.pageView.findMany({
      where: {
        timeOnPage: {
          gt: 0
        }
      },
      select: {
        timeOnPage: true
      }
    });

    if (allPageViews.length > 0) {
      const totalTime = allPageViews.reduce((sum, pv) => sum + (pv.timeOnPage || 0), 0);
      const avgTime = Math.round(totalTime / allPageViews.length);
      console.log(`\n📊 Statistiques de temps:`);
      console.log(`- Total pages avec temps: ${allPageViews.length}`);
      console.log(`- Temps total: ${totalTime} secondes`);
      console.log(`- Durée moyenne: ${avgTime} secondes (${Math.floor(avgTime / 60)}m ${avgTime % 60}s)`);
    }

    // Vérifier les UserSessions avec durée
    const userSessionsWithDuration = await prisma.userSession.findMany({
      where: {
        duration: {
          gt: 0
        }
      },
      orderBy: {
        startTime: 'desc'
      },
      take: 10
    });

    console.log('\n📊 UserSessions avec durée (10 derniers):');
    console.log(`Total UserSessions avec durée: ${userSessionsWithDuration.length}`);
    userSessionsWithDuration.forEach((us, index) => {
      console.log(`${index + 1}. Session: ${us.sessionId} - ${us.duration}s - ${us.pageViews} pages - ${us.startTime}`);
    });

  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testTimeTracking(); 