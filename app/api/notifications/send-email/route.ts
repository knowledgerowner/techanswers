import { NextRequest, NextResponse } from 'next/server';
import { EmailNotification } from '@/lib/contexts/NotificationContext';
import { sendEmail } from '@/lib/email';
// Templates HTML inline pour éviter les problèmes de conversion JSX

export async function POST(request: NextRequest) {
  try {
    const body: EmailNotification = await request.json();
    const { to, subject, template, data } = body;

    // Validation des données
    if (!to || !subject || !template) {
      return NextResponse.json(
        { error: 'Données manquantes: to, subject et template sont requis' },
        { status: 400 }
      );
    }

    let htmlContent: string;

    // Générer le contenu HTML selon le template
    switch (template) {
      case 'welcome':
        htmlContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 20px; text-align: center;">
              <h1 style="margin: 0; font-size: 28px; font-weight: bold;">🎉 Bienvenue sur TechAnswers !</h1>
              <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Votre communauté technique de référence</p>
            </div>
            <div style="padding: 40px 20px; background-color: #ffffff;">
              <h2 style="color: #333; margin-bottom: 20px;">Bonjour ${data.username || 'Utilisateur'} !</h2>
              <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">Nous sommes ravis de vous accueillir dans la communauté TechAnswers ! Vous faites maintenant partie d'une communauté passionnée de développeurs, experts en cybersécurité et passionnés de technologies.</p>
              ${data.activationLink ? `<div style="text-align: center; margin: 30px 0;"><a href="${data.activationLink}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; font-size: 16px;">✅ Activer mon compte</a></div>` : ''}
              <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">Notre équipe d'experts s'engage à vous fournir du contenu de qualité sur les dernières technologies et bonnes pratiques du développement web.</p>
            </div>
            <div style="background-color: #f8f9fa; padding: 30px 20px; text-align: center; border-top: 1px solid #e9ecef;">
              <p style="color: #666; margin: 0 0 15px 0;"><strong>TechAnswers</strong> - Votre source de connaissances techniques</p>
              <p style="color: #999; font-size: 12px; margin: 0;">Cet email a été envoyé à ${to}. Si vous n'avez pas créé de compte, vous pouvez ignorer cet email.</p>
            </div>
          </div>
        `;
        break;

      case 'article-published':
        htmlContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>🎉 Votre article a été publié !</h2>
            <p>Félicitations ! Votre article "${data.title}" est maintenant en ligne.</p>
            <a href="${data.articleUrl}" style="background: #667eea; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
              Voir l'article
            </a>
          </div>
        `;
        break;

      case 'comment-reply':
        htmlContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>💬 Nouvelle réponse à votre commentaire</h2>
            <p>Quelqu'un a répondu à votre commentaire sur l'article "${data.articleTitle}".</p>
            <a href="${data.commentUrl}" style="background: #667eea; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
              Voir la réponse
            </a>
          </div>
        `;
        break;

      case 'security-alert':
        htmlContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #dc3545;">🚨 Alerte de sécurité</h2>
            <p>Une activité suspecte a été détectée sur votre compte.</p>
            <p><strong>Détails :</strong> ${data.details}</p>
            <p><strong>Heure :</strong> ${data.timestamp}</p>
            <a href="${data.securityUrl}" style="background: #dc3545; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
              Vérifier la sécurité
            </a>
          </div>
        `;
        break;

      case 'custom':
        htmlContent = data.htmlContent || `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>${data.title || 'Notification'}</h2>
            <p>${data.message || 'Vous avez reçu une notification.'}</p>
            ${data.actionUrl ? `<a href="${data.actionUrl}" style="background: #667eea; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">${data.actionText || 'En savoir plus'}</a>` : ''}
          </div>
        `;
        break;

      default:
        return NextResponse.json(
          { error: 'Template non reconnu' },
          { status: 400 }
        );
    }

    // Envoyer l'email
    await sendEmail({
      to,
      subject,
      html: htmlContent,
    });

    // Log de succès
    console.log(`Email envoyé avec succès à ${to} (template: ${template})`);

    return NextResponse.json(
      { success: true, message: 'Email envoyé avec succès' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);
    
    return NextResponse.json(
      { error: 'Erreur lors de l\'envoi de l\'email' },
      { status: 500 }
    );
  }
} 