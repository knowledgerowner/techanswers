import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, email, password, notificationConsent } = body;

    if (!username || !email || !password) {
      return NextResponse.json(
        { error: 'Tous les champs sont requis' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Le mot de passe doit contenir au moins 6 caractères' },
        { status: 400 }
      );
    }

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { username }
        ]
      }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Un utilisateur avec cet email ou nom d\'utilisateur existe déjà' },
        { status: 409 }
      );
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 12);

    // Créer l'utilisateur avec une transaction pour inclure les paramètres de notifications
    const result = await prisma.$transaction(async (tx) => {
      // Créer l'utilisateur
      const user = await tx.user.create({
        data: {
          username,
          email,
          password: hashedPassword,
          isAdmin: false, // Par défaut, les nouveaux utilisateurs ne sont pas admin
        },
        select: {
          id: true,
          username: true,
          email: true,
          isAdmin: true,
          createdAt: true,
        },
      });

      // Créer les paramètres de notifications si l'utilisateur a donné son consentement
      if (notificationConsent) {
        await tx.notificationSettings.create({
          data: {
            userId: user.id,
            pushNotifications: true,
            inAppNotifications: true,
            newArticles: true,
            commentReplies: true,
            securityAlerts: true,
            newsletter: true,
            marketing: true, // Activé si consentement donné
            frequency: 'IMMEDIATE',
            emailNotifications: {
              create: {
                welcome: true,
                articlePublished: true,
                commentReply: true,
                securityAlert: true,
                newsletter: true,
                custom: true, // Activé si consentement donné
                htmlEmails: true,
                plainTextEmails: false
              }
            }
          }
        });

        // Récupérer toutes les catégories existantes
        const categories = await tx.category.findMany({
          select: { id: true }
        });

        // Créer des abonnements à toutes les catégories
        if (categories.length > 0) {
          await tx.categorySubscription.createMany({
            data: categories.map(category => ({
              userId: user.id,
              categoryId: category.id,
              type: 'ALL_ARTICLES',
              notifyOnPublish: true,
              notifyOnUpdate: false,
              notifyOnComment: false,
              frequency: 'IMMEDIATE'
            }))
          });
        }
      } else {
        // Créer des paramètres minimaux si pas de consentement
        await tx.notificationSettings.create({
          data: {
            userId: user.id,
            pushNotifications: false,
            inAppNotifications: true, // Notifications in-app uniquement pour l'expérience utilisateur de base
            newArticles: false,
            commentReplies: false,
            securityAlerts: true, // Les alertes de sécurité restent activées pour la sécurité
            newsletter: false,
            marketing: false,
            frequency: 'NEVER',
            emailNotifications: {
              create: {
                welcome: true, // Email de bienvenue toujours envoyé
                articlePublished: false,
                commentReply: false,
                securityAlert: true, // Alertes de sécurité toujours activées
                newsletter: false,
                custom: false,
                htmlEmails: true,
                plainTextEmails: false
              }
            }
          }
        });
      }

      return user;
    });

    // Compter les abonnements créés si applicable
    const categorySubscriptionsCount = notificationConsent 
      ? await prisma.categorySubscription.count({
          where: { userId: result.id }
        })
      : 0;

    return NextResponse.json({
      message: 'Inscription réussie',
      user: {
        id: result.id,
        username: result.username,
        email: result.email,
        isAdmin: result.isAdmin,
        notificationsConfigured: Boolean(notificationConsent),
        categorySubscriptionsCreated: categorySubscriptionsCount,
      },
    }, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
} 