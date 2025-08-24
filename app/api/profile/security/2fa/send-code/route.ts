import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { sendEmail } from '@/lib/email';
import { scheduleCodeCleanup } from '@/lib/2fa-cleanup';

// POST - Envoyer un code de vérification 2FA
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    if (user instanceof NextResponse) {
      return user;
    }

    const { type = 'SETUP' } = await request.json();

    // Récupérer l'utilisateur
    const userData = await prisma.user.findUnique({
      where: { id: user.userId }
    });

    console.log('🔍 [2FA SEND-CODE] User ID:', user.userId);
    console.log('🔍 [2FA SEND-CODE] User Data:', userData);

    if (!userData) {
      console.log('❌ [2FA SEND-CODE] Utilisateur non trouvé');
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    console.log('✅ [2FA SEND-CODE] Email trouvé:', userData.email);

    // Générer un code de vérification à 6 chiffres
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Code expire dans 10 minutes
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    // Supprimer les anciens codes expirés
    await prisma.twoFactorCode.deleteMany({
      where: {
        userId: user.userId,
        type,
        OR: [
          { expiresAt: { lt: new Date() } },
          { used: true }
        ]
      }
    });

    // Créer le nouveau code
    const twoFactorCode = await prisma.twoFactorCode.create({
      data: {
        userId: user.userId,
        code: verificationCode,
        type,
        expiresAt,
        used: false,
        attempts: 0
      }
    });

    // Programmer la suppression automatique du code
    scheduleCodeCleanup(twoFactorCode.id, expiresAt);

    // Préparer l'email
    const subject = getTwoFactorEmailSubject(type);
    const htmlContent = generateTwoFactorEmailHTML(userData.username, verificationCode, type);

    console.log('📧 [2FA SEND-CODE] Préparation email:');
    console.log('📧 [2FA SEND-CODE] To:', userData.email);
    console.log('📧 [2FA SEND-CODE] Subject:', subject);
    console.log('📧 [2FA SEND-CODE] Code:', verificationCode);

    // Envoyer l'email
    try {
      const emailResult = await sendEmail({
        to: userData.email,
        subject: subject,
        html: htmlContent
      });
      
      console.log('📧 [2FA SEND-CODE] Résultat envoi email:', emailResult);
      
      return NextResponse.json({
        message: 'Code de vérification envoyé avec succès',
        expiresIn: '10 minutes'
      });
    } catch (emailError) {
      // Supprimer le code si l'email échoue
      await prisma.twoFactorCode.delete({
        where: { id: twoFactorCode.id }
      });
      
      console.error('❌ [2FA SEND-CODE] Erreur lors de l\'envoi de l\'email:', emailError);
      console.error('❌ [2FA SEND-CODE] Détails erreur:', {
        message: emailError instanceof Error ? emailError.message : 'Erreur inconnue',
        stack: emailError instanceof Error ? emailError.stack : undefined
      });
      return NextResponse.json(
        { error: 'Erreur lors de l\'envoi de l\'email' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Erreur lors de l\'envoi du code 2FA:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

// Fonctions utilitaires pour les emails
function getTwoFactorEmailSubject(type: 'LOGIN' | 'SETUP' | 'RESET'): string {
  switch (type) {
    case 'LOGIN':
      return 'Code de vérification pour votre connexion - TechAnswers';
    case 'SETUP':
      return 'Code de vérification pour activer la 2FA - TechAnswers';
    case 'RESET':
      return 'Code de vérification pour réinitialiser la 2FA - TechAnswers';
    default:
      return 'Code de vérification - TechAnswers';
  }
}

function generateTwoFactorEmailHTML(username: string, code: string, type: 'LOGIN' | 'SETUP' | 'RESET'): string {
  const actionText = getActionText(type);
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Code de vérification TechAnswers</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .code { background: #fff; border: 2px dashed #667eea; padding: 20px; text-align: center; margin: 20px 0; border-radius: 10px; }
        .code-text { font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 5px; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔐 TechAnswers</h1>
          <p>Authentification à deux facteurs</p>
        </div>
        
        <div class="content">
          <h2>Bonjour ${username},</h2>
          
          <p>Vous avez demandé ${actionText}.</p>
          
          <p>Voici votre code de vérification à 6 chiffres :</p>
          
          <div class="code">
            <div class="code-text">${code}</div>
          </div>
          
          <div class="warning">
            <strong>⚠️ Important :</strong>
            <ul>
              <li>Ce code expire dans 10 minutes</li>
              <li>Ne partagez jamais ce code avec qui que ce soit</li>
              <li>Si vous n'avez pas demandé ce code, ignorez cet email</li>
            </ul>
          </div>
          
          <p>Si vous rencontrez des problèmes, contactez notre support.</p>
          
          <p>Cordialement,<br>L'équipe TechAnswers</p>
        </div>
        
        <div class="footer">
          <p>Cet email a été envoyé automatiquement, merci de ne pas y répondre.</p>
          <p>&copy; 2024 TechAnswers. Tous droits réservés.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function getActionText(type: 'LOGIN' | 'SETUP' | 'RESET'): string {
  switch (type) {
    case 'LOGIN':
      return 'de vous connecter à votre compte';
    case 'SETUP':
      return 'd\'activer l\'authentification à deux facteurs sur votre compte';
    case 'RESET':
      return 'de réinitialiser l\'authentification à deux facteurs sur votre compte';
    default:
      return 'cette action';
  }
} 