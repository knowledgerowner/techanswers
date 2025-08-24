import { prisma } from './prisma';
import { sendEmail } from './email';

export interface ArticleNotificationData {
  articleId: string;
  articleTitle: string;
  articleSlug: string;
  categoryIds: string[];
  authorUsername: string;
}

/**
 * Envoie des notifications à tous les utilisateurs abonnés à une catégorie
 * quand un nouvel article est publié
 */
export async function notifyArticlePublished(articleData: ArticleNotificationData): Promise<void> {
  try {
    console.log('🔔 [NOTIFICATIONS] Début notification article:', articleData.articleTitle);
    console.log('🔔 [NOTIFICATIONS] Catégories:', articleData.categoryIds);
    
    // Récupérer tous les utilisateurs abonnés aux catégories de l'article
    const subscriptions = await prisma.categorySubscription.findMany({
      where: {
        categoryId: { in: articleData.categoryIds },
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

    console.log('🔔 [NOTIFICATIONS] Abonnements trouvés:', subscriptions.length);

    // Grouper les utilisateurs par ID pour éviter les doublons
    const uniqueUsers = new Map();
    subscriptions.forEach(subscription => {
      if (!uniqueUsers.has(subscription.userId)) {
        uniqueUsers.set(subscription.userId, {
          user: subscription.user,
          categories: []
        });
      }
      uniqueUsers.get(subscription.userId).categories.push(subscription.category);
    });

    console.log('🔔 [NOTIFICATIONS] Utilisateurs uniques:', uniqueUsers.size);

    // Envoyer les notifications à chaque utilisateur
    for (const [userId, data] of uniqueUsers) {
      const { user, categories } = data;
      
      console.log(`🔔 [NOTIFICATIONS] Traitement utilisateur: ${user.username} (${user.email})`);
      
      // Vérifier si l'utilisateur veut des notifications par email
      const wantsEmailNotifications = user.notificationSettings?.emailNotifications?.articlePublished;
      const wantsInAppNotifications = user.notificationSettings?.inAppNotifications !== false; // Par défaut true

      console.log(`🔔 [NOTIFICATIONS] Préférences - Email: ${wantsEmailNotifications}, In-app: ${wantsInAppNotifications}`);

      if (wantsEmailNotifications) {
        console.log(`🔔 [NOTIFICATIONS] Envoi email à ${user.email}`);
        await sendArticlePublishedEmail(user, articleData, categories);
      }

      if (wantsInAppNotifications) {
        console.log(`🔔 [NOTIFICATIONS] Création notification in-app pour ${user.username}`);
        await createInAppNotification(userId, articleData, categories);
      }
    }

    console.log(`✅ [NOTIFICATIONS] Notifications envoyées pour l'article: ${articleData.articleTitle}`);
  } catch (error) {
    console.error('❌ [NOTIFICATIONS] Erreur lors de l\'envoi des notifications d\'article:', error);
  }
}

/**
 * Envoie un email de notification d'article publié
 */
async function sendArticlePublishedEmail(
  user: any, // eslint-disable-line @typescript-eslint/no-explicit-any
  articleData: ArticleNotificationData,
  categories: any[] // eslint-disable-line @typescript-eslint/no-explicit-any
): Promise<void> {
  try {
    const subject = `Nouvel article publié : ${articleData.articleTitle} - TechAnswers`;
    const htmlContent = generateArticlePublishedEmailHTML(
      user.username,
      articleData,
      categories
    );

    await sendEmail({
      to: user.email,
      subject: subject,
      html: htmlContent
    });
  } catch (error) {
    console.error(`Erreur lors de l'envoi de l'email à ${user.email}:`, error);
  }
}

/**
 * Crée une notification in-app
 */
async function createInAppNotification(
  userId: string,
  articleData: ArticleNotificationData,
  categories: any[] // eslint-disable-line @typescript-eslint/no-explicit-any
): Promise<void> {
  try {
    console.log(`🔔 [NOTIFICATIONS] Création notification in-app pour utilisateur ${userId}`);
    
    const notification = await prisma.notification.create({
      data: {
        userId,
        type: 'ARTICLE_PUBLISHED',
        title: `Nouvel article : ${articleData.articleTitle}`,
        message: `Un nouvel article "${articleData.articleTitle}" a été publié dans ${categories.map(c => c.name).join(', ')}`,
        data: {
          articleId: articleData.articleId,
          articleTitle: articleData.articleTitle,
          articleSlug: articleData.articleSlug,
          categoryNames: categories.map(c => c.name),
          articleUrl: `/articles/${articleData.articleSlug}`
        },
        priority: 'NORMAL',
        isRead: false
      }
    });
    
    console.log(`✅ [NOTIFICATIONS] Notification in-app créée avec succès: ${notification.id}`);
  } catch (error) {
    console.error(`❌ [NOTIFICATIONS] Erreur lors de la création de la notification in-app pour l'utilisateur ${userId}:`, error);
  }
}

/**
 * Génère le contenu HTML de l'email de notification d'article
 */
function generateArticlePublishedEmailHTML(
  username: string,
  articleData: ArticleNotificationData,
  categories: any[] // eslint-disable-line @typescript-eslint/no-explicit-any
): string {
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Nouvel article publié - TechAnswers</title>
      <style>
        body { 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
          line-height: 1.6; 
          color: #ffffff; 
          margin: 0; 
          padding: 0; 
          background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 50%, #2d2d2d 100%);
          min-height: 100vh;
        }
        .container { 
          max-width: 600px; 
          margin: 0 auto; 
          padding: 20px; 
        }
        .header { 
          background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%); 
          color: white; 
          padding: 40px 30px; 
          text-align: center; 
          border-radius: 15px 15px 0 0; 
          border: 1px solid #333;
          border-bottom: none;
        }
        .content { 
          background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); 
          padding: 40px 30px; 
          border-radius: 0 0 15px 15px; 
          border: 1px solid #333;
          border-top: none;
        }
        .article-card { 
          background: linear-gradient(135deg, #2d2d2d 0%, #404040 100%); 
          border: 1px solid #555; 
          padding: 25px; 
          margin: 25px 0; 
          border-radius: 12px; 
          box-shadow: 0 4px 20px rgba(0,0,0,0.3); 
        }
        .article-title { 
          font-size: 24px; 
          font-weight: bold; 
          color: #ffffff; 
          margin-bottom: 15px; 
        }
        .article-meta { 
          color: #cccccc; 
          font-size: 14px; 
          margin-bottom: 20px; 
        }
        .category-badge { 
          display: inline-block; 
          background: linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%); 
          color: #000000; 
          padding: 6px 14px; 
          border-radius: 20px; 
          font-size: 12px; 
          margin-right: 8px; 
          font-weight: 500;
        }
        .cta-button { 
          display: inline-block; 
          background: linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%); 
          color: #000000; 
          text-decoration: none; 
          padding: 14px 28px; 
          border-radius: 8px; 
          margin-top: 20px; 
          font-weight: 600;
          transition: all 0.3s ease;
        }
        .cta-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(255,255,255,0.2);
        }
        .footer { 
          text-align: center; 
          margin-top: 40px; 
          color: #999999; 
          font-size: 14px; 
        }
        .unsubscribe { 
          text-align: center; 
          margin-top: 30px; 
        }
        .unsubscribe a { 
          color: #ffffff; 
          text-decoration: none; 
          border-bottom: 1px solid #ffffff;
          padding-bottom: 2px;
        }
        .unsubscribe a:hover {
          color: #cccccc;
        }
        h2 {
          color: #ffffff;
          margin-bottom: 20px;
        }
        p {
          color: #e0e0e0;
          margin-bottom: 15px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0; font-size: 32px;">📚 TechAnswers</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Nouvel article publié</p>
        </div>
        
        <div class="content">
          <h2>Bonjour ${username},</h2>
          
          <p>Un nouvel article a été publié dans les catégories auxquelles vous êtes abonné !</p>
          
          <div class="article-card">
            <div class="article-title">${articleData.articleTitle}</div>
            <div class="article-meta">
              <strong>Par :</strong> ${articleData.authorUsername}<br>
              <strong>Catégories :</strong> 
              ${categories.map(c => `<span class="category-badge">${c.name}</span>`).join('')}
            </div>
            
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/articles/${articleData.articleSlug}" class="cta-button">
              Lire l'article →
            </a>
          </div>
          
          <p>Restez à jour avec les dernières actualités technologiques en consultant régulièrement notre blog.</p>
          
          <p>Cordialement,<br>L'équipe TechAnswers</p>
        </div>
        
        <div class="footer">
          <p>&copy; 2024 TechAnswers. Tous droits réservés.</p>
        </div>
        
        <div class="unsubscribe">
          <p>
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/profile/notifications">
              Gérer mes préférences de notifications
            </a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Envoie une notification de commentaire à un utilisateur
 */
export async function notifyCommentReply(
  userId: string,
  commentData: {
    articleTitle: string;
    articleSlug: string;
    commentAuthor: string;
    commentContent: string;
    replyContent: string;
  }
): Promise<void> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        notificationSettings: {
          include: {
            emailNotifications: true
          }
        }
      }
    });

    if (!user) return;

    // Vérifier si l'utilisateur veut des notifications par email
    if (user.notificationSettings?.emailNotifications?.commentReply) {
          const subject = `Nouvelle réponse à votre commentaire - TechAnswers`;
    const htmlContent = generateCommentReplyEmailHTML(user.username, commentData);
    
    await sendEmail({
      to: user.email,
      subject: subject,
      html: htmlContent
    });
    }

    // Créer une notification in-app
    await prisma.notification.create({
      data: {
        userId,
        type: 'COMMENT_REPLY',
        title: 'Nouvelle réponse à votre commentaire',
        message: `${commentData.commentAuthor} a répondu à votre commentaire sur "${commentData.articleTitle}"`,
        data: {
          articleTitle: commentData.articleTitle,
          articleSlug: commentData.articleSlug,
          commentAuthor: commentData.commentAuthor,
          replyContent: commentData.replyContent
        },
        priority: 'LOW',
        isRead: false
      }
    });
  } catch (error) {
    console.error('Erreur lors de l\'envoi de la notification de commentaire:', error);
  }
}

/**
 * Génère le contenu HTML de l'email de réponse de commentaire
 */
function generateCommentReplyEmailHTML(
  username: string,
  commentData: any // eslint-disable-line @typescript-eslint/no-explicit-any
): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Nouvelle réponse à votre commentaire - TechAnswers</title>
      <style>
        body { 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
          line-height: 1.6; 
          color: #ffffff; 
          margin: 0; 
          padding: 0; 
          background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 50%, #2d2d2d 100%);
          min-height: 100vh;
        }
        .container { 
          max-width: 600px; 
          margin: 0 auto; 
          padding: 20px; 
        }
        .header { 
          background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%); 
          color: white; 
          padding: 40px 30px; 
          text-align: center; 
          border-radius: 15px 15px 0 0; 
          border: 1px solid #333;
          border-bottom: none;
        }
        .content { 
          background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); 
          padding: 40px 30px; 
          border-radius: 0 0 15px 15px; 
          border: 1px solid #333;
          border-top: none;
        }
        .comment-card { 
          background: linear-gradient(135deg, #2d2d2d 0%, #404040 100%); 
          border: 1px solid #555; 
          padding: 25px; 
          margin: 25px 0; 
          border-radius: 12px; 
          box-shadow: 0 4px 20px rgba(0,0,0,0.3); 
        }
        .comment-author { 
          font-weight: bold; 
          color: #ffffff; 
          margin-bottom: 15px; 
          font-size: 16px;
        }
        .comment-content { 
          background: linear-gradient(135deg, #404040 0%, #555555 100%); 
          padding: 20px; 
          border-radius: 8px; 
          margin: 15px 0; 
          color: #e0e0e0;
          border: 1px solid #666;
        }
        .cta-button { 
          display: inline-block; 
          background: linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%); 
          color: #000000; 
          text-decoration: none; 
          padding: 14px 28px; 
          border-radius: 8px; 
          margin-top: 20px; 
          font-weight: 600;
          transition: all 0.3s ease;
        }
        .cta-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(255,255,255,0.2);
        }
        h2 {
          color: #ffffff;
          margin-bottom: 20px;
        }
        p {
          color: #e0e0e0;
          margin-bottom: 15px;
        }
        strong {
          color: #ffffff;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0; font-size: 32px;">💬 TechAnswers</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Nouvelle réponse à votre commentaire</p>
        </div>
        
        <div class="content">
          <h2>Bonjour ${username},</h2>
          
          <p>Quelqu'un a répondu à votre commentaire sur l'article <strong>"${commentData.articleTitle}"</strong>.</p>
          
          <div class="comment-card">
            <div class="comment-author">${commentData.commentAuthor} a répondu :</div>
            <div class="comment-content">${commentData.replyContent}</div>
            
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/articles/${commentData.articleSlug}" class="cta-button">
              Voir la discussion →
            </a>
          </div>
          
          <p>Cordialement,<br>L'équipe TechAnswers</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Envoie une notification de sécurité à un utilisateur
 */
export async function notifySecurityAlert(
  userId: string,
  alertData: {
    type: 'LOGIN_ATTEMPT' | 'PASSWORD_CHANGE' | '2FA_ENABLED' | '2FA_DISABLED' | 'SUSPICIOUS_ACTIVITY';
    message: string;
    details?: string;
  }
): Promise<void> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        notificationSettings: {
          include: {
            emailNotifications: true
          }
        }
      }
    });

    if (!user) return;

    // Vérifier si l'utilisateur veut des notifications de sécurité par email
    if (user.notificationSettings?.emailNotifications?.securityAlert) {
          const subject = `Alerte de sécurité - TechAnswers`;
    const htmlContent = generateSecurityAlertEmailHTML(user.username, alertData);
    
    await sendEmail({
      to: user.email,
      subject: subject,
      html: htmlContent
    });
    }

    // Créer une notification in-app
    await prisma.notification.create({
      data: {
        userId,
        type: 'SECURITY_ALERT',
        title: 'Alerte de sécurité',
        message: alertData.message,
        data: alertData,
        priority: 'HIGH',
        isRead: false
      }
    });
  } catch (error) {
    console.error('Erreur lors de l\'envoi de la notification de sécurité:', error);
  }
}

/**
 * Génère le contenu HTML de l'email d'alerte de sécurité
 */
function generateSecurityAlertEmailHTML(
  username: string,
  alertData: {
    type: 'LOGIN_ATTEMPT' | 'PASSWORD_CHANGE' | '2FA_ENABLED' | '2FA_DISABLED' | 'SUSPICIOUS_ACTIVITY';
    message: string;
    details?: string;
  }
): string {
  const alertIcon = getSecurityAlertIcon(alertData.type);
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Alerte de sécurité - TechAnswers</title>
      <style>
        body { 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
          line-height: 1.6; 
          color: #ffffff; 
          margin: 0; 
          padding: 0; 
          background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 50%, #2d2d2d 100%);
          min-height: 100vh;
        }
        .container { 
          max-width: 600px; 
          margin: 0 auto; 
          padding: 20px; 
        }
        .header { 
          background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%); 
          color: white; 
          padding: 40px 30px; 
          text-align: center; 
          border-radius: 15px 15px 0 0; 
          border: 1px solid #333;
          border-bottom: none;
        }
        .content { 
          background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); 
          padding: 40px 30px; 
          border-radius: 0 0 15px 15px; 
          border: 1px solid #333;
          border-top: none;
        }
        .alert-card { 
          background: linear-gradient(135deg, #2d2d2d 0%, #404040 100%); 
          border: 2px solid #ffffff; 
          padding: 30px; 
          margin: 25px 0; 
          border-radius: 12px; 
          box-shadow: 0 4px 20px rgba(0,0,0,0.3); 
        }
        .alert-icon { 
          font-size: 48px; 
          text-align: center; 
          margin-bottom: 20px; 
        }
        .cta-button { 
          display: inline-block; 
          background: linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%); 
          color: #000000; 
          text-decoration: none; 
          padding: 14px 28px; 
          border-radius: 8px; 
          margin-top: 20px; 
          font-weight: 600;
          transition: all 0.3s ease;
        }
        .cta-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(255,255,255,0.2);
        }
        h2, h3 {
          color: #ffffff;
          margin-bottom: 20px;
        }
        p {
          color: #e0e0e0;
          margin-bottom: 15px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0; font-size: 32px;">${alertIcon} TechAnswers</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Alerte de sécurité</p>
        </div>
        
        <div class="content">
          <h2>Bonjour ${username},</h2>
          
          <div class="alert-card">
            <div class="alert-icon">${alertIcon}</div>
            <h3>Alerte de sécurité détectée</h3>
            <p>${alertData.message}</p>
            
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/profile/security" class="cta-button">
              Vérifier la sécurité →
            </a>
          </div>
          
          <p>Si vous n'êtes pas à l'origine de cette action, veuillez contacter immédiatement notre support.</p>
          
          <p>Cordialement,<br>L'équipe TechAnswers</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function getSecurityAlertIcon(type: string): string {
  switch (type) {
    case 'LOGIN_ATTEMPT': return '🔐';
    case 'PASSWORD_CHANGE': return '🔑';
    case '2FA_ENABLED': return '✅';
    case '2FA_DISABLED': return '⚠️';
    case 'SUSPICIOUS_ACTIVITY': return '🚨';
    default: return '🔒';
  }
}