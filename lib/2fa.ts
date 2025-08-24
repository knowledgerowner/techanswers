import { prisma } from './prisma';
import { sendEmail } from './email';
import crypto from 'crypto';
import { scheduleCodeCleanup } from './2fa-cleanup';

export interface TwoFactorCode {
  id: string;
  userId: string;
  code: string;
  type: 'LOGIN' | 'SETUP' | 'RESET';
  expiresAt: Date;
  used: boolean;
  attempts: number;
}

export interface TwoFactorSession {
  id: string;
  userId: string;
  sessionId: string;
  deviceName?: string | null;
  ip: string | null;
  userAgent: string | null;
  lastUsed: Date;
  expiresAt: Date;
  isActive: boolean;
}

/**
 * Génère un code de vérification à 6 chiffres
 */
export function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Crée un nouveau code de vérification 2FA
 */
export async function createTwoFactorCode(
  userId: string,
  type: 'LOGIN' | 'SETUP' | 'RESET',
  expiresInMinutes: number = 10
): Promise<TwoFactorCode> {
  // Supprimer les anciens codes expirés
  await prisma.twoFactorCode.deleteMany({
    where: {
      userId,
      type,
      OR: [
        { expiresAt: { lt: new Date() } },
        { used: true }
      ]
    }
  });

  const code = generateVerificationCode();
  const expiresAt = new Date(Date.now() + expiresInMinutes * 60 * 1000);

  const twoFactorCode = await prisma.twoFactorCode.create({
    data: {
      userId,
      code,
      type,
      expiresAt,
      used: false,
      attempts: 0
    }
  });

  // Programmer la suppression automatique du code
  scheduleCodeCleanup(twoFactorCode.id, expiresAt);

  return twoFactorCode;
}

/**
 * Vérifie un code de vérification 2FA
 */
export async function verifyTwoFactorCode(
  userId: string,
  code: string,
  type: 'LOGIN' | 'SETUP' | 'RESET'
): Promise<{ success: boolean; message: string; codeId?: string }> {
  const twoFactorCode = await prisma.twoFactorCode.findFirst({
    where: {
      userId,
      code,
      type,
      used: false,
      expiresAt: { gt: new Date() }
    }
  });

  if (!twoFactorCode) {
    return {
      success: false,
      message: 'Code de vérification invalide ou expiré'
    };
  }

  // Vérifier le nombre de tentatives
  if (twoFactorCode.attempts >= 5) {
    await prisma.twoFactorCode.update({
      where: { id: twoFactorCode.id },
      data: { used: true }
    });
    return {
      success: false,
      message: 'Trop de tentatives. Le code a été invalidé.'
    };
  }

  // Marquer le code comme utilisé
  await prisma.twoFactorCode.update({
    where: { id: twoFactorCode.id },
    data: { used: true }
  });

  return {
    success: true,
    message: 'Code de vérification valide',
    codeId: twoFactorCode.id
  };
}

/**
 * Envoie un code de vérification par email
 */
export async function sendTwoFactorCode(
  userId: string,
  type: 'LOGIN' | 'SETUP' | 'RESET'
): Promise<{ success: boolean; message: string }> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return {
        success: false,
        message: 'Utilisateur non trouvé'
      };
    }

    // Créer le code de vérification
    const twoFactorCode = await createTwoFactorCode(userId, type);

    // Préparer l'email
    const subject = getTwoFactorEmailSubject(type, twoFactorCode.code);
    const htmlContent = generateTwoFactorEmailHTML(user.username, twoFactorCode.code, type);

    // Envoyer l'email
    await sendEmail({
      to: user.email,
      subject,
      html: htmlContent
    });

    return {
      success: true,
      message: 'Code de vérification envoyé avec succès'
    };
  } catch (error) {
    console.error('Erreur lors de l\'envoi du code 2FA:', error);
    return {
      success: false,
      message: 'Erreur lors de l\'envoi du code de vérification'
    };
  }
}

/**
 * Active la 2FA pour un utilisateur
 */
export async function enableTwoFactor(userId: string): Promise<{ success: boolean; message: string }> {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        twoFactorEnabled: true,
        twoFactorSecret: crypto.randomBytes(32).toString('hex')
      }
    });

    return {
      success: true,
      message: '2FA activée avec succès'
    };
  } catch (error) {
    console.error('Erreur lors de l\'activation de la 2FA:', error);
    return {
      success: false,
      message: 'Erreur lors de l\'activation de la 2FA'
    };
  }
}

/**
 * Désactive la 2FA pour un utilisateur
 */
export async function disableTwoFactor(userId: string): Promise<{ success: boolean; message: string }> {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        twoFactorEnabled: false,
        twoFactorSecret: null
      }
    });

    // Supprimer tous les codes 2FA de l'utilisateur
    await prisma.twoFactorCode.deleteMany({
      where: { userId }
    });

    return {
      success: true,
      message: '2FA désactivée avec succès'
    };
  } catch (error) {
    console.error('Erreur lors de la désactivation de la 2FA:', error);
    return {
      success: false,
      message: 'Erreur lors de la désactivation de la 2FA'
    };
  }
}

/**
 * Crée une nouvelle session 2FA
 */
export async function createTwoFactorSession(
  userId: string,
  sessionId: string,
  ip: string,
  userAgent: string,
  deviceName?: string
): Promise<TwoFactorSession> {
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 jours

  const session = await prisma.twoFactorSession.create({
    data: {
      userId,
      sessionId,
      deviceName,
      ip,
      userAgent,
      lastUsed: new Date(),
      expiresAt,
      isActive: true
    }
  });

  return session;
}

/**
 * Vérifie si une session 2FA est valide
 */
export async function validateTwoFactorSession(
  userId: string,
  sessionId: string
): Promise<{ valid: boolean; session?: TwoFactorSession }> {
  const session = await prisma.twoFactorSession.findFirst({
    where: {
      userId,
      sessionId,
      isActive: true,
      expiresAt: { gt: new Date() }
    }
  });

  if (!session) {
    return { valid: false };
  }

  // Mettre à jour la dernière utilisation
  await prisma.twoFactorSession.update({
    where: { id: session.id },
    data: { lastUsed: new Date() }
  });

  return { valid: true, session };
}

/**
 * Révoque une session 2FA
 */
export async function revokeTwoFactorSession(sessionId: string): Promise<{ success: boolean; message: string }> {
  try {
    await prisma.twoFactorSession.update({
      where: { sessionId },
      data: { isActive: false }
    });

    return {
      success: true,
      message: 'Session révoquée avec succès'
    };
  } catch (error) {
    console.error('Erreur lors de la révocation de la session:', error);
    return {
      success: false,
      message: 'Erreur lors de la révocation de la session'
    };
  }
}

/**
 * Révoque toutes les sessions d'un utilisateur
 */
export async function revokeAllUserSessions(userId: string): Promise<{ success: boolean; message: string }> {
  try {
    await prisma.twoFactorSession.updateMany({
      where: { userId },
      data: { isActive: false }
    });

    return {
      success: true,
      message: 'Toutes les sessions ont été révoquées'
    };
  } catch (error) {
    console.error('Erreur lors de la révocation des sessions:', error);
    return {
      success: false,
      message: 'Erreur lors de la révocation des sessions'
    };
  }
}

/**
 * Nettoie les sessions et codes expirés
 */
export async function cleanupExpiredTwoFactorData(): Promise<void> {
  try {
    // Supprimer les codes expirés
    await prisma.twoFactorCode.deleteMany({
      where: {
        OR: [
          { expiresAt: { lt: new Date() } },
          { used: true }
        ]
      }
    });

    // Désactiver les sessions expirées
    await prisma.twoFactorSession.updateMany({
      where: {
        expiresAt: { lt: new Date() }
      },
      data: { isActive: false }
    });
  } catch (error) {
    console.error('Erreur lors du nettoyage des données 2FA:', error);
  }
}

// Fonctions utilitaires pour les emails
function getTwoFactorEmailSubject(type: 'LOGIN' | 'SETUP' | 'RESET', code: string): string {
  switch (type) {
    case 'LOGIN':
      return `Code de vérification ${code} pour votre connexion - TechAnswers`;
    case 'SETUP':
      return `Code de vérification ${code} pour activer la 2FA - TechAnswers`;
    case 'RESET':
      return `Code de vérification ${code} pour réinitialiser la 2FA - TechAnswers`;
    default:
      return `Code de vérification ${code} - TechAnswers`;
  }
}

export function generateTwoFactorEmailHTML(username: string, code: string, type: 'LOGIN' | 'SETUP' | 'RESET'): string {
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