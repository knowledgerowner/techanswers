const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function updateDatabaseSchema() {
  try {
    console.log('🔄 Mise à jour du schéma de la base de données...');

    // 1. Mettre à jour les utilisateurs existants avec les nouveaux champs
    console.log('📝 Mise à jour des utilisateurs existants...');
    
    const users = await prisma.user.findMany();
    console.log(`Trouvé ${users.length} utilisateurs à mettre à jour`);

    for (const user of users) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          // Nouvelles propriétés avec valeurs par défaut
          firstName: null,
          lastName: null,
          bio: null,
          avatarUrl: null,
          website: null,
          location: null,
          company: null,
          jobTitle: null,
          isEmailVerified: false,
          emailVerificationToken: null,
          emailVerificationExpires: null,
          passwordResetToken: null,
          passwordResetExpires: null,
          twoFactorEnabled: false,
          twoFactorSecret: null,
          twoFactorBackupCodes: [],
          lastLoginAt: null,
          loginAttempts: 0,
          lockedUntil: null,
        }
      });
    }

    // 2. Créer les préférences utilisateur par défaut
    console.log('⚙️ Création des préférences utilisateur par défaut...');
    
    for (const user of users) {
      // Vérifier si les préférences existent déjà
      const existingPreferences = await prisma.userPreferences.findUnique({
        where: { userId: user.id }
      });

      if (!existingPreferences) {
        await prisma.userPreferences.create({
          data: {
            userId: user.id,
            theme: 'dark',
            language: 'fr',
            timezone: 'Europe/Paris',
            showPremiumContent: true,
            autoPlayVideos: false,
            showComments: true,
            showRatings: true,
            compactMode: false,
            showSidebar: true,
            showBreadcrumbs: true,
            searchHistory: true,
            searchSuggestions: true,
          }
        });
      }
    }

    // 3. Créer les paramètres de notifications par défaut
    console.log('🔔 Création des paramètres de notifications par défaut...');
    
    for (const user of users) {
      // Vérifier si les paramètres existent déjà
      const existingSettings = await prisma.notificationSettings.findUnique({
        where: { userId: user.id }
      });

      if (!existingSettings) {
        const notificationSettings = await prisma.notificationSettings.create({
          data: {
            userId: user.id,
            pushNotifications: false,
            inAppNotifications: true,
            newArticles: true,
            commentReplies: true,
            securityAlerts: true,
            newsletter: true,
            marketing: false,
            frequency: 'IMMEDIATE',
            quietHoursStart: null,
            quietHoursEnd: null,
          }
        });

        // Créer les paramètres d'email par défaut
        await prisma.emailNotificationSettings.create({
          data: {
            notificationSettingsId: notificationSettings.id,
            welcome: true,
            articlePublished: true,
            commentReply: true,
            securityAlert: true,
            newsletter: true,
            custom: false,
            htmlEmails: true,
            plainTextEmails: false,
            emailSignature: null,
          }
        });
      }
    }

    // 4. Créer des notifications de bienvenue pour les nouveaux utilisateurs
    console.log('🎉 Création des notifications de bienvenue...');
    
    for (const user of users) {
      // Vérifier si une notification de bienvenue existe déjà
      const existingWelcomeNotification = await prisma.notification.findFirst({
        where: {
          userId: user.id,
          type: 'SUCCESS',
          title: 'Bienvenue sur TechAnswers !'
        }
      });

      if (!existingWelcomeNotification) {
        await prisma.notification.create({
          data: {
            userId: user.id,
            type: 'SUCCESS',
            title: 'Bienvenue sur TechAnswers !',
            message: `Bonjour ${user.username} ! Nous sommes ravis de vous accueillir dans notre communauté technique.`,
            data: {
              type: 'welcome',
              username: user.username
            },
            priority: 'NORMAL',
            isRead: false,
            isArchived: false,
          }
        });
      }
    }

    // 5. Créer des abonnements aux catégories populaires
    console.log('📚 Création des abonnements aux catégories populaires...');
    
    const popularCategories = await prisma.category.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' }
    });

    for (const user of users) {
      for (const category of popularCategories) {
        // Vérifier si l'abonnement existe déjà
        const existingSubscription = await prisma.categorySubscription.findUnique({
          where: {
            userId_categoryId: {
              userId: user.id,
              categoryId: category.id
            }
          }
        });

        if (!existingSubscription) {
          await prisma.categorySubscription.create({
            data: {
              userId: user.id,
              categoryId: category.id,
              type: 'ALL_ARTICLES',
              notifyOnPublish: true,
              notifyOnUpdate: false,
              notifyOnComment: false,
              frequency: 'IMMEDIATE',
            }
          });
        }
      }
    }

    console.log('✅ Mise à jour du schéma terminée avec succès !');
    console.log(`📊 Résumé des mises à jour :`);
    console.log(`   - ${users.length} utilisateurs mis à jour`);
    console.log(`   - ${users.length} préférences utilisateur créées`);
    console.log(`   - ${users.length} paramètres de notifications créés`);
    console.log(`   - ${users.length} notifications de bienvenue créées`);
    console.log(`   - ${users.length * Math.min(popularCategories.length, 5)} abonnements aux catégories créés`);

  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour du schéma:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Exécuter le script
if (require.main === module) {
  updateDatabaseSchema()
    .then(() => {
      console.log('🎯 Script terminé avec succès !');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Erreur fatale:', error);
      process.exit(1);
    });
}

module.exports = { updateDatabaseSchema }; 