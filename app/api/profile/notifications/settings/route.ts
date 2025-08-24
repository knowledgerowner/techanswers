import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

// GET - Récupérer les paramètres de notifications de l'utilisateur
export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    if (user instanceof NextResponse) {
      return user;
    }

    let settings = await prisma.notificationSettings.findUnique({
      where: { userId: user.userId },
      include: {
        emailNotifications: true
      }
    });

    // Si aucun paramètre n'existe, créer des paramètres par défaut
    if (!settings) {
      settings = await prisma.notificationSettings.create({
        data: {
          userId: user.userId,
          pushNotifications: true,
          inAppNotifications: true,
          newArticles: true,
          commentReplies: true,
          securityAlerts: true,
          newsletter: false,
          marketing: false,
          frequency: 'IMMEDIATE',
          emailNotifications: {
            create: {
              welcome: true,
              articlePublished: true,
              commentReply: true,
              securityAlert: true,
              newsletter: false,
              custom: false,
              htmlEmails: true,
              plainTextEmails: false
            }
          }
        },
        include: {
          emailNotifications: true
        }
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Erreur lors de la récupération des paramètres:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

// PUT - Mettre à jour les paramètres de notifications
export async function PUT(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    if (user instanceof NextResponse) {
      return user;
    }

    const body = await request.json();

    // Mettre à jour les paramètres principaux
    const updatedSettings = await prisma.notificationSettings.upsert({
      where: { userId: user.userId },
      update: {
        pushNotifications: body.pushNotifications,
        inAppNotifications: body.inAppNotifications,
        newArticles: body.newArticles,
        commentReplies: body.commentReplies,
        securityAlerts: body.securityAlerts,
        newsletter: body.newsletter,
        marketing: body.marketing,
        frequency: body.frequency,
        quietHoursStart: body.quietHoursStart,
        quietHoursEnd: body.quietHoursEnd
      },
      create: {
        userId: user.userId,
        pushNotifications: body.pushNotifications ?? true,
        inAppNotifications: body.inAppNotifications ?? true,
        newArticles: body.newArticles ?? true,
        commentReplies: body.commentReplies ?? true,
        securityAlerts: body.securityAlerts ?? true,
        newsletter: body.newsletter ?? false,
        marketing: body.marketing ?? false,
        frequency: body.frequency ?? 'IMMEDIATE',
        quietHoursStart: body.quietHoursStart,
        quietHoursEnd: body.quietHoursEnd
      }
    });

    // Mettre à jour les paramètres d'email
    if (body.emailNotifications) {
      await prisma.emailNotificationSettings.upsert({
        where: { notificationSettingsId: updatedSettings.id },
        update: {
          welcome: body.emailNotifications.welcome,
          articlePublished: body.emailNotifications.articlePublished,
          commentReply: body.emailNotifications.commentReply,
          securityAlert: body.emailNotifications.securityAlert,
          newsletter: body.emailNotifications.newsletter,
          custom: body.emailNotifications.custom,
          htmlEmails: body.emailNotifications.htmlEmails,
          plainTextEmails: body.emailNotifications.plainTextEmails,
          emailSignature: body.emailNotifications.emailSignature
        },
        create: {
          notificationSettingsId: updatedSettings.id,
          welcome: body.emailNotifications.welcome ?? true,
          articlePublished: body.emailNotifications.articlePublished ?? true,
          commentReply: body.emailNotifications.commentReply ?? true,
          securityAlert: body.emailNotifications.securityAlert ?? true,
          newsletter: body.emailNotifications.newsletter ?? false,
          custom: body.emailNotifications.custom ?? false,
          htmlEmails: body.emailNotifications.htmlEmails ?? true,
          plainTextEmails: body.emailNotifications.plainTextEmails ?? false,
          emailSignature: body.emailNotifications.emailSignature
        }
      });
    }

    // Récupérer les paramètres mis à jour
    const finalSettings = await prisma.notificationSettings.findUnique({
      where: { userId: user.userId },
      include: {
        emailNotifications: true
      }
    });

    return NextResponse.json(finalSettings);
  } catch (error) {
    console.error('Erreur lors de la mise à jour des paramètres:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
} 