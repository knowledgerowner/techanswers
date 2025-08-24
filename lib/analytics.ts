import { prisma } from './prisma';
import { NextRequest } from 'next/server';

export interface AnalyticsData {
  pageViews: number;
  uniqueVisitors: number;
  sessions: number;
  avgSessionDuration: number;
  bounceRate: number;
  topPages: Array<{
    page: string;
    views: number;
    uniqueVisitors: number;
    avgTimeOnPage: number;
  }>;
  deviceBreakdown: Array<{
    device: string;
    percentage: number;
  }>;
  trafficSources: Array<{
    source: string;
    percentage: number;
  }>;
  hourlyData: Array<{
    hour: number;
    views: number;
    visitors: number;
  }>;
  dailyData: Array<{
    date: string;
    views: number;
    visitors: number;
    sessions: number;
  }>;
}

// Fonction pour générer un ID de session unique
export function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Fonction pour obtenir les informations du navigateur
export function getBrowserInfo(userAgent: string) {
  const ua = userAgent.toLowerCase();
  
  // Détection du navigateur
  let browser = 'Unknown';
  if (ua.includes('chrome')) browser = 'Chrome';
  else if (ua.includes('firefox')) browser = 'Firefox';
  else if (ua.includes('safari') && !ua.includes('chrome')) browser = 'Safari';
  else if (ua.includes('edge')) browser = 'Edge';
  else if (ua.includes('opera')) browser = 'Opera';
  
  // Détection du système d'exploitation
  let os = 'Unknown';
  if (ua.includes('windows')) os = 'Windows';
  else if (ua.includes('mac')) os = 'macOS';
  else if (ua.includes('linux')) os = 'Linux';
  else if (ua.includes('android')) os = 'Android';
  else if (ua.includes('ios') || ua.includes('iphone') || ua.includes('ipad')) os = 'iOS';
  
  // Détection de l'appareil
  let device = 'Desktop';
  if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone')) {
    device = 'Mobile';
  } else if (ua.includes('tablet') || ua.includes('ipad')) {
    device = 'Tablet';
  }
  
  return { browser, os, device };
}

// Fonction pour tracker une vue de page
export async function trackPageView(
  request: NextRequest,
  page: string,
  title?: string,
  sessionId?: string
): Promise<string> {
  const { prisma } = await import('@/lib/prisma');
  
  try {
    console.log('🔍 trackPageView - Début du tracking pour:', page);
    console.log('🔍 trackPageView - SessionId fourni:', sessionId);
    
    // Exclure les pages admin
    if (page.startsWith('/admin')) {
      console.log('❌ Page admin exclue:', page);
      return sessionId || '';
    }

    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               request.headers.get('cf-connecting-ip') ||
               'unknown';
    const userAgent = request.headers.get('user-agent') || '';
    const referrer = request.headers.get('referer') || null;
    
    console.log('🔍 trackPageView - IP:', ip);
    console.log('🔍 trackPageView - User-Agent:', userAgent.substring(0, 50) + '...');
    console.log('🔍 trackPageView - Referrer:', referrer);

    // Utiliser le sessionId fourni ou en chercher un existant pour cette IP
    let newSessionId = sessionId;
    
    if (!newSessionId) {
      // Chercher une session existante pour cette IP dans les dernières 30 minutes
      const existingSession = await prisma.userSession.findFirst({
        where: {
          ip,
          startTime: {
            gte: new Date(Date.now() - 30 * 60 * 1000) // 30 minutes
          }
        },
        orderBy: {
          startTime: 'desc'
        }
      });
      
      if (existingSession) {
        newSessionId = existingSession.sessionId;
        console.log('🔍 trackPageView - Session existante trouvée pour IP:', newSessionId);
      } else {
        newSessionId = generateSessionId();
        console.log('🔍 trackPageView - Nouvelle session générée:', newSessionId);
      }
    }
    
    // S'assurer que newSessionId n'est jamais undefined
    if (!newSessionId) {
      newSessionId = generateSessionId();
      console.log('🔍 trackPageView - SessionId fallback généré:', newSessionId);
    }
    
    // Obtenir les informations du navigateur
    const { browser, os, device } = getBrowserInfo(userAgent);
    
    console.log('🔍 trackPageView - Browser:', browser, 'OS:', os, 'Device:', device);

    // Créer l'enregistrement PageView (pour tous les utilisateurs)
    const pageView = await prisma.pageView.create({
      data: {
        page,
        title: title || page,
        sessionId: newSessionId,
        ip,
        userAgent,
        referrer,
        timeOnPage: 0,
        scrollDepth: 0,
      },
    });

    console.log('✅ trackPageView - PageView créé avec ID:', pageView.id);

    // Créer ou mettre à jour la session utilisateur (pour tous les utilisateurs)
    let userSession = await prisma.userSession.findUnique({
      where: { sessionId: newSessionId },
    });

    if (!userSession) {
      userSession = await prisma.userSession.create({
        data: {
          sessionId: newSessionId,
          ip,
          userAgent,
          referrer,
          startTime: new Date(),
          pageViews: 1,
          device,
          browser,
          os,
        },
      });
      console.log('✅ trackPageView - Nouvelle session créée:', userSession.sessionId);
    } else {
      // Utiliser updateMany avec increment pour éviter les problèmes de concurrence
      await prisma.userSession.updateMany({
        where: { sessionId: newSessionId },
        data: {
          pageViews: {
            increment: 1
          },
        },
      });
      console.log('✅ trackPageView - Session existante mise à jour avec increment');
    }

    return newSessionId;
  } catch (error) {
    console.error('❌ Erreur dans trackPageView:', error);
    return sessionId || '';
  }
}

// Fonction pour tracker une vue d'article spécifique
export async function trackArticleView(
  request: NextRequest,
  articleId: string,
  sessionId?: string
) {
  try {
    // const fingerprint = getClientFingerprint(request); // Fonction non utilisée pour le moment
    const userAgent = request.headers.get('user-agent') || '';
    const referrer = request.headers.get('referer') || '';
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               request.headers.get('cf-connecting-ip') ||
               'unknown';
    
    const { browser, os, device } = getBrowserInfo(userAgent);
    
    // Créer ou récupérer la session
    let session = sessionId;
    if (!session) {
      session = generateSessionId();
      
      await prisma.userSession.create({
        data: {
          sessionId: session,
          ip,
          userAgent,
          referrer,
          device,
          browser,
          os,
          startTime: new Date(),
        }
      });
    }
    
    // Créer la vue d'article
    await prisma.articleView.create({
      data: {
        articleId,
        sessionId: session,
        ip,
        userAgent,
        referrer,
      }
    });
    
    return session;
  } catch (error) {
    console.error('Erreur lors du tracking de la vue d\'article:', error);
    return sessionId;
  }
}

// Fonction pour mettre à jour le temps passé sur une page
export async function updatePageViewMetrics(
  sessionId: string,
  page: string,
  timeOnPage: number,
  scrollDepth: number
): Promise<void> {
  const { prisma } = await import('@/lib/prisma');
  
  try {
    console.log('🔍 updatePageViewMetrics - Mise à jour des métriques:', {
      sessionId,
      page,
      timeOnPage,
      scrollDepth
    });

    // Mettre à jour la PageView la plus récente pour cette session et cette page
    const pageView = await prisma.pageView.findFirst({
      where: {
        sessionId,
        page,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (pageView) {
      await prisma.pageView.update({
        where: { id: pageView.id },
        data: {
          timeOnPage,
          scrollDepth,
        },
      });
      console.log('✅ updatePageViewMetrics - PageView mise à jour avec timeOnPage:', timeOnPage);
    } else {
      console.log('❌ updatePageViewMetrics - PageView non trouvée pour:', sessionId, page);
    }

    // Mettre à jour la session utilisateur
    await prisma.userSession.updateMany({
      where: { sessionId },
      data: {
        endTime: new Date(),
        duration: timeOnPage,
      },
    });
    console.log('✅ updatePageViewMetrics - Session mise à jour avec duration:', timeOnPage);
  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour des métriques:', error);
  }
}

// Fonction pour mettre à jour les métriques d'article
export async function updateArticleViewMetrics(
  sessionId: string,
  articleId: string,
  timeOnPage: number,
  scrollDepth?: number,
  readProgress?: number
) {
  try {
    await prisma.articleView.updateMany({
      where: {
        sessionId,
        articleId,
      },
      data: {
        timeOnPage,
        scrollDepth,
        readProgress,
      }
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour des métriques d\'article:', error);
  }
}

// Fonction pour terminer une session
export async function endSession(sessionId: string) {
  try {
    const session = await prisma.userSession.findUnique({
      where: { sessionId }
    });
    
    if (session && !session.endTime) {
      const duration = Math.floor((Date.now() - session.startTime.getTime()) / 1000);
      
      await prisma.userSession.update({
        where: { sessionId },
        data: {
          endTime: new Date(),
          duration,
        }
      });
    }
  } catch (error) {
    console.error('Erreur lors de la fin de session:', error);
  }
}

// Fonction pour récupérer les analytics
export async function getAnalyticsData(days: number = 30): Promise<AnalyticsData> {
  const { prisma } = await import('@/lib/prisma');
  
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  try {
    // Récupérer les vues de pages (exclure les pages admin, seulement celles avec 10+ secondes)
    const pageViews = await prisma.pageView.count({
      where: {
        createdAt: {
          gte: startDate,
        },
        page: {
          not: {
            startsWith: '/admin',
          },
        },
        timeOnPage: {
          gte: 10, // Seulement les pages avec 10+ secondes
        },
      },
    });

    // Récupérer les sessions uniques (basé sur sessionId unique)
    // Utiliser le même filtre que pour les vues (timeOnPage >= 10)
    const sessions = await prisma.pageView.groupBy({
      by: ['sessionId'],
      where: {
        createdAt: {
          gte: startDate,
        },
        page: {
          not: {
            startsWith: '/admin',
          },
        },
        timeOnPage: {
          gte: 10, // Même filtre que pour les vues
        },
      },
      _count: {
        sessionId: true,
      },
    });

    const totalSessions = sessions.length;

    // Récupérer les visiteurs uniques (basé sur IP unique)
    // Utiliser le même filtre que pour les vues (timeOnPage >= 10)
    const uniqueVisitors = await prisma.pageView.groupBy({
      by: ['ip'],
      where: {
        createdAt: {
          gte: startDate,
        },
        page: {
          not: {
            startsWith: '/admin',
          },
        },
        timeOnPage: {
          gte: 10, // Même filtre que pour les vues
        },
      },
      _count: {
        ip: true,
      },
    });

    const totalUniqueVisitors = uniqueVisitors.length;

    // Calculer la durée moyenne des sessions (basé sur PageView timeOnPage)
    let avgSessionDuration = 0;
    try {
      // Calculer la durée moyenne basée sur timeOnPage des PageViews
      const pageViewsWithTime = await prisma.pageView.findMany({
        where: {
          createdAt: {
            gte: startDate,
          },
          page: {
            not: {
              startsWith: '/admin',
            },
          },
          timeOnPage: {
            gt: 0, // Seulement les pages avec du temps passé
          },
        },
        select: {
          timeOnPage: true,
        },
      });

      if (pageViewsWithTime.length > 0) {
        const totalTime = pageViewsWithTime.reduce((sum, pv) => sum + (pv.timeOnPage || 0), 0);
        avgSessionDuration = Math.round(totalTime / pageViewsWithTime.length);
        console.log('📊 Durée moyenne calculée:', avgSessionDuration, 'secondes sur', pageViewsWithTime.length, 'pages');
      }
    } catch (error) {
      console.error('❌ Erreur lors du calcul de la durée moyenne:', error);
      avgSessionDuration = 0;
    }

    // Calculer le taux de rebond (sessions avec une seule vue de page)
    // Utiliser le même filtre que pour les vues (timeOnPage >= 10)
    const singlePageSessions = await prisma.pageView.groupBy({
      by: ['sessionId'],
      where: {
        createdAt: {
          gte: startDate,
        },
        page: {
          not: {
            startsWith: '/admin',
          },
        },
        timeOnPage: {
          gte: 10, // Même filtre que pour les vues
        },
      },
      _count: {
        id: true,
      },
    });

    const bounceSessions = singlePageSessions.filter(session => session._count.id === 1).length;
    const bounceRate = totalSessions > 0 ? Math.round((bounceSessions / totalSessions) * 100) : 0;

    // Récupérer les pages les plus visitées (exclure les pages admin, seulement 10+ secondes)
    const topPages = await prisma.pageView.groupBy({
      by: ['page'],
      where: {
        createdAt: {
          gte: startDate,
        },
        page: {
          not: {
            startsWith: '/admin',
          },
        },
        timeOnPage: {
          gte: 10, // Seulement les pages avec 10+ secondes
        },
      },
      _count: {
        page: true,
      },
      _avg: {
        timeOnPage: true,
      },
      orderBy: {
        _count: {
          page: 'desc',
        },
      },
      take: 10,
    });


    // Récupérer les IP uniques par page en utilisant distinct
    const uniqueIPsPerPage = await prisma.pageView.findMany({
      where: {
        createdAt: {
          gte: startDate,
        },
        page: {
          not: {
            startsWith: '/admin',
          },
        },
        timeOnPage: {
          gte: 10, // Seulement les pages avec 10+ secondes
        },
      },
      select: {
        page: true,
        ip: true,
      },
      distinct: ['page', 'ip'],
    });

    // Compter les IP uniques par page
    const uniqueVisitorsCountPerPage = new Map<string, number>();
    uniqueIPsPerPage.forEach(item => {
      const current = uniqueVisitorsCountPerPage.get(item.page) || 0;
      uniqueVisitorsCountPerPage.set(item.page, current + 1);
    });

    // Combiner les données des pages
    const topPagesWithDetails = topPages.map(page => {
      const uniqueVisitors = uniqueVisitorsCountPerPage.get(page.page) || 0;
      return {
        page: page.page,
        views: page._count.page,
        uniqueVisitors,
        avgTimeOnPage: Math.round(page._avg.timeOnPage || 0),
      };
    });

    // Récupérer la répartition par appareil (exclure les pages admin)
    const deviceBreakdown = await prisma.pageView.groupBy({
      by: ['device'],
      where: {
        createdAt: {
          gte: startDate,
        },
        page: {
          not: {
            startsWith: '/admin',
          },
        },
        device: {
          not: null,
        },
      },
      _count: {
        device: true,
      },
    });

    const totalDeviceViews = deviceBreakdown.reduce((sum, device) => sum + device._count.device, 0);
    const deviceBreakdownWithPercentage = deviceBreakdown.map(device => ({
      device: device.device || 'Unknown',
      percentage: totalDeviceViews > 0 ? Math.round((device._count.device / totalDeviceViews) * 100) : 0,
    }));

    // Récupérer les sources de trafic (basé sur le referrer, exclure les pages admin)
    const trafficSources = await prisma.pageView.groupBy({
      by: ['referrer'],
      where: {
        createdAt: {
          gte: startDate,
        },
        page: {
          not: {
            startsWith: '/admin',
          },
        },
        referrer: {
          not: null,
        },
      },
      _count: {
        referrer: true,
      },
    });

    const totalReferrerViews = trafficSources.reduce((sum, source) => sum + source._count.referrer, 0);
    
    // Améliorer la détection des sources de trafic
    const sourceMap = new Map<string, number>();
    
    trafficSources.forEach(source => {
      let sourceName = 'Direct';
      if (source.referrer) {
        const referrer = source.referrer.toLowerCase();
        if (referrer.includes('google') || referrer.includes('google.com')) {
          sourceName = 'Google';
        } else if (referrer.includes('facebook') || referrer.includes('fb.com')) {
          sourceName = 'Facebook';
        } else if (referrer.includes('twitter') || referrer.includes('x.com')) {
          sourceName = 'Twitter';
        } else if (referrer.includes('linkedin')) {
          sourceName = 'LinkedIn';
        } else if (referrer.includes('instagram')) {
          sourceName = 'Instagram';
        } else if (referrer.includes('youtube')) {
          sourceName = 'YouTube';
        } else if (referrer.includes('bing') || referrer.includes('yahoo') || referrer.includes('duckduckgo')) {
          sourceName = 'Autres moteurs';
        } else if (referrer.includes('localhost') || referrer.includes('127.0.0.1')) {
          sourceName = 'Local';
        } else if (referrer.includes('http')) {
          sourceName = 'Autres sites';
        }
      }
      
      const currentCount = sourceMap.get(sourceName) || 0;
      sourceMap.set(sourceName, currentCount + source._count.referrer);
    });

    const trafficSourcesWithPercentage = Array.from(sourceMap.entries()).map(([source, count]) => ({
      source,
      percentage: totalReferrerViews > 0 ? Math.round((count / totalReferrerViews) * 100) : 0,
    }));

    // Récupérer les données horaires (exclure les pages admin)
    const hourlyData = await prisma.pageView.groupBy({
      by: ['createdAt'],
      where: {
        createdAt: {
          gte: startDate,
        },
        page: {
          not: {
            startsWith: '/admin',
          },
        },
      },
      _count: {
        id: true,
      },
    });

    // Grouper par heure
    const hourlyStats = new Array(24).fill(0).map(() => ({ views: 0, visitors: 0 }));
    hourlyData.forEach(data => {
      const hour = new Date(data.createdAt).getHours();
      hourlyStats[hour].views += data._count.id;
    });

    // Récupérer les données quotidiennes (exclure les pages admin)
    const dailyData = await prisma.pageView.groupBy({
      by: ['createdAt'],
      where: {
        createdAt: {
          gte: startDate,
        },
        page: {
          not: {
            startsWith: '/admin',
          },
        },
      },
      _count: {
        id: true,
      },
    });

    // Grouper par jour
    const dailyStats = new Map<string, { views: number; visitors: number; sessions: number }>();
    
    // Initialiser tous les jours avec 0
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (days - 1 - i));
      const dateKey = date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
      dailyStats.set(dateKey, { views: 0, visitors: 0, sessions: 0 });
    }

    // Ajouter les vraies données
    dailyData.forEach(data => {
      const dateKey = new Date(data.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
      const existing = dailyStats.get(dateKey);
      if (existing) {
        existing.views += data._count.id;
      }
    });

    // Ajouter les sessions par jour
    const dailySessions = await prisma.pageView.groupBy({
      by: ['createdAt'],
      where: {
        createdAt: {
          gte: startDate,
        },
        page: {
          not: {
            startsWith: '/admin',
          },
        },
      },
      _count: {
        sessionId: true,
      },
    });

    dailySessions.forEach(data => {
      const dateKey = new Date(data.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
      const existing = dailyStats.get(dateKey);
      if (existing) {
        existing.sessions += data._count.sessionId;
      }
    });

    const dailyDataArray = Array.from(dailyStats.entries()).map(([date, stats]) => ({
      date,
      views: stats.views,
      visitors: stats.visitors,
      sessions: stats.sessions,
    }));

    // Debug logs
    console.log('🔍 Analytics Debug:');
    console.log('- Page Views:', pageViews);
    console.log('- Unique Visitors (IP):', totalUniqueVisitors);
    console.log('- Sessions (sessionId):', totalSessions);
    console.log('- Top Pages:', topPagesWithDetails.length);
    console.log('- Device Breakdown:', deviceBreakdownWithPercentage.length);
    console.log('- Traffic Sources:', trafficSourcesWithPercentage.length);

    return {
      pageViews,
      uniqueVisitors: totalUniqueVisitors,
      sessions: totalSessions,
      avgSessionDuration,
      bounceRate,
      topPages: topPagesWithDetails,
      deviceBreakdown: deviceBreakdownWithPercentage,
      trafficSources: trafficSourcesWithPercentage,
      hourlyData: hourlyStats.map((stats, hour) => ({
        hour,
        views: stats.views,
        visitors: stats.visitors,
      })),
      dailyData: dailyDataArray,
    };
  } catch (error) {
    console.error('Erreur lors de la récupération des analytics:', error);
    
    // En cas d'erreur, retourner des données vides mais structurées
    return {
      pageViews: 0,
      uniqueVisitors: 0,
      sessions: 0,
      avgSessionDuration: 0,
      bounceRate: 0,
      topPages: [],
      deviceBreakdown: [],
      trafficSources: [],
      hourlyData: Array.from({ length: 24 }, (_, i) => ({ hour: i, views: 0, visitors: 0 })),
      dailyData: Array.from({ length: days }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (days - 1 - i));
        return {
          date: date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }),
          views: 0,
          visitors: 0,
          sessions: 0,
        };
      }),
    };
  }
} 