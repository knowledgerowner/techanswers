import nodemailer from 'nodemailer';

// Configuration du transporteur email
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // true pour 465, false pour les autres ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Interface pour les données de contact
interface ContactData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// Interface pour les données de réponse
interface ReplyData {
  content: string;
  adminName: string;
}

// Fonction pour envoyer un email de réponse
export async function sendReplyEmail(
  contactData: ContactData,
  replyData: ReplyData
) {
  try {
    const mailOptions = {
      from: `"${process.env.SMTP_FROM_NAME || 'TechAnswers'}" <${process.env.SMTP_USER}>`,
      to: contactData.email,
      subject: `Réponse à votre demande : ${contactData.subject}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #0a0a0a; color: #ffffff;">
          <div style="background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); padding: 30px; border-radius: 12px 12px 0 0; text-align: center; border: 1px solid #333;">
            <h1 style="margin: 0; font-size: 28px; font-weight: 700; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">TechAnswers</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.8; color: #a1a1aa;">Réponse à votre demande de contact</p>
          </div>
          
          <div style="background: #1a1a1a; padding: 30px; border-radius: 0 0 12px 12px; border: 1px solid #333; border-top: none;">
            <p style="color: #ffffff; font-size: 16px; margin-bottom: 20px;">
              Bonjour <strong style="color: #667eea;">${contactData.name}</strong>,
            </p>
            
            <p style="color: #a1a1aa; font-size: 14px; line-height: 1.6; margin-bottom: 25px;">
              Nous avons bien reçu votre message concernant : <strong style="color: #ffffff;">"${contactData.subject}"</strong>
            </p>
            
            <div style="background: #2d2d2d; border-left: 4px solid #667eea; padding: 20px; margin: 20px 0; border-radius: 0 8px 8px 0; border: 1px solid #404040;">
              <p style="color: #ffffff; font-size: 14px; line-height: 1.6; margin: 0; white-space: pre-wrap;">
                ${replyData.content}
              </p>
            </div>
            
            <p style="color: #a1a1aa; font-size: 14px; margin-top: 25px;">
              Cordialement,<br>
              <strong style="color: #667eea;">${replyData.adminName}</strong><br>
              Équipe TechAnswers
            </p>
            
            <hr style="border: none; border-top: 1px solid #404040; margin: 30px 0;">
            
            <div style="background: #2d2d2d; padding: 15px; border-radius: 8px; font-size: 12px; color: #a1a1aa; border: 1px solid #404040;">
              <p style="margin: 0 0 10px 0; color: #ffffff;"><strong>Votre message original :</strong></p>
              <p style="margin: 0; line-height: 1.4; white-space: pre-wrap;">${contactData.message}</p>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 20px; color: #71717a; font-size: 12px;">
            <p>Cet email a été envoyé automatiquement. Merci de ne pas y répondre directement.</p>
            <p>Pour nous contacter, utilisez le formulaire sur notre site web.</p>
          </div>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email envoyé:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Erreur inconnue' };
  }
}

// Fonction pour envoyer un email de confirmation de contact
export async function sendContactConfirmationEmail(contactData: ContactData) {
  try {
    const mailOptions = {
      from: `"${process.env.SMTP_FROM_NAME || 'TechAnswers'}" <${process.env.SMTP_USER}>`,
      to: contactData.email,
      subject: 'Confirmation de votre message - TechAnswers',
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #0a0a0a; color: #ffffff;">
          <div style="background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); padding: 30px; border-radius: 12px 12px 0 0; text-align: center; border: 1px solid #333;">
            <h1 style="margin: 0; font-size: 28px; font-weight: 700; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">TechAnswers</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.8; color: #a1a1aa;">Confirmation de votre message</p>
          </div>
          
          <div style="background: #1a1a1a; padding: 30px; border-radius: 0 0 12px 12px; border: 1px solid #333; border-top: none;">
            <p style="color: #ffffff; font-size: 16px; margin-bottom: 20px;">
              Bonjour <strong style="color: #667eea;">${contactData.name}</strong>,
            </p>
            
            <p style="color: #a1a1aa; font-size: 14px; line-height: 1.6; margin-bottom: 25px;">
              Nous avons bien reçu votre message et nous vous en remercions. Notre équipe va l'examiner et vous répondre dans les plus brefs délais.
            </p>
            
            <div style="background: #2d2d2d; border-left: 4px solid #10b981; padding: 20px; margin: 20px 0; border-radius: 0 8px 8px 0; border: 1px solid #404040;">
              <p style="color: #ffffff; font-size: 14px; line-height: 1.6; margin: 0; white-space: pre-wrap;">
                ${contactData.message}
              </p>
            </div>
            
            <p style="color: #a1a1aa; font-size: 14px; margin-top: 25px;">
              <strong style="color: #ffffff;">Détails de votre demande :</strong><br>
              Sujet : ${contactData.subject}<br>
              Date : ${new Date().toLocaleString('fr-FR')}
            </p>
            
            <p style="color: #a1a1aa; font-size: 14px; margin-top: 25px;">
              Cordialement,<br>
              <strong style="color: #667eea;">L'équipe TechAnswers</strong>
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 20px; color: #71717a; font-size: 12px;">
            <p>Cet email confirme la réception de votre message. Vous recevrez une réponse dans les 24-48h.</p>
          </div>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email de confirmation envoyé:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email de confirmation:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Erreur inconnue' };
  }
}

// Interface pour les notifications
interface NotificationEmailData {
  to: string;
  subject: string;
  html: string;
}

// Fonction générique pour envoyer des emails de notification
export async function sendEmail(emailData: NotificationEmailData) {
  try {
    const mailOptions = {
      from: `"${process.env.SMTP_FROM_NAME || 'TechAnswers'}" <${process.env.SMTP_USER}>`,
      to: emailData.to,
      subject: emailData.subject,
      html: emailData.html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email de notification envoyé:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email de notification:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Erreur inconnue' };
  }
}

export default transporter; 