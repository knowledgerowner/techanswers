const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
let usersToUpdate = []; // Variable globale pour le scope

async function updateUsersWithSuperAdmin() {
  try {
    console.log('🔄 Début de la mise à jour des utilisateurs...\n');

    // 1. Récupérer tous les utilisateurs existants
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        isAdmin: true,
        isSuperAdmin: true,
        createdAt: true
      }
    });

    console.log(`📊 ${users.length} utilisateur(s) trouvé(s) dans la base de données\n`);

    if (users.length === 0) {
      console.log('ℹ️  Aucun utilisateur à mettre à jour.');
      return;
    }

    // 2. Afficher l'état actuel
    console.log('📋 État actuel des utilisateurs :');
    users.forEach(user => {
      console.log(`  - ${user.username} (${user.email})`);
      console.log(`    Admin: ${user.isAdmin ? '✅' : '❌'}`);
      console.log(`    SuperAdmin: ${user.isSuperAdmin ? '✅' : '❌'}`);
      console.log(`    Créé le: ${user.createdAt.toLocaleDateString('fr-FR')}`);
      console.log('');
    });

    // 3. Identifier les utilisateurs à mettre à jour
    usersToUpdate = users.filter(user => user.isSuperAdmin === null || user.isSuperAdmin === undefined);

    if (usersToUpdate.length === 0) {
      console.log('✅ Tous les utilisateurs ont déjà le champ isSuperAdmin défini.');
      return;
    }

    console.log(`🔄 ${usersToUpdate.length} utilisateur(s) à mettre à jour...\n`);

    // 4. Demander confirmation pour la mise à jour
    console.log('⚠️  ATTENTION: Cette opération va mettre à jour les utilisateurs suivants :');
    usersToUpdate.forEach(user => {
      console.log(`  - ${user.username} (${user.email})`);
    });

    console.log('\n❓ Voulez-vous continuer ? (y/N)');
    
    // Pour automatiser, on peut commenter cette partie et forcer la mise à jour
    // const readline = require('readline');
    // const rl = readline.createInterface({
    //   input: process.stdin,
    //   output: process.stdout
    // });
    
    // rl.question('', (answer) => {
    //   rl.close();
    //   if (answer.toLowerCase() !== 'y' && answer.toLowerCase() !== 'yes') {
    //     console.log('❌ Opération annulée.');
    //     return;
    //   }
    //   performUpdate();
    // });

    // Pour l'instant, on force la mise à jour
    await performUpdate();

  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour :', error);
  } finally {
    await prisma.$disconnect();
  }
}

async function performUpdate() {
  try {
    console.log('\n🔄 Mise à jour en cours...\n');

    // 5. Mettre à jour tous les utilisateurs
    const updatePromises = usersToUpdate.map(async (user) => {
      const newIsSuperAdmin = user.isAdmin; // Les admins deviennent super admin par défaut
      
      const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: { 
          isSuperAdmin: newIsSuperAdmin 
        },
        select: {
          id: true,
          username: true,
          email: true,
          isAdmin: true,
          isSuperAdmin: true
        }
      });

      console.log(`✅ ${updatedUser.username} mis à jour :`);
      console.log(`   Admin: ${updatedUser.isAdmin ? '✅' : '❌'}`);
      console.log(`   SuperAdmin: ${updatedUser.isSuperAdmin ? '✅' : '❌'}`);
      console.log('');

      return updatedUser;
    });

    const updatedUsers = await Promise.all(updatePromises);

    // 6. Afficher le résumé
    console.log('📊 Résumé de la mise à jour :');
    console.log(`✅ ${updatedUsers.length} utilisateur(s) mis à jour avec succès`);
    
    const superAdmins = updatedUsers.filter(user => user.isSuperAdmin);
    const regularAdmins = updatedUsers.filter(user => user.isAdmin && !user.isSuperAdmin);
    const regularUsers = updatedUsers.filter(user => !user.isAdmin && !user.isSuperAdmin);

    console.log(`👑 Super Administrateurs: ${superAdmins.length}`);
    console.log(`🔧 Administrateurs: ${regularAdmins.length}`);
    console.log(`👤 Utilisateurs normaux: ${regularUsers.length}`);

    if (superAdmins.length > 0) {
      console.log('\n👑 Super Administrateurs :');
      superAdmins.forEach(user => {
        console.log(`  - ${user.username} (${user.email})`);
      });
    }

    console.log('\n🎉 Mise à jour terminée avec succès !');

  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour :', error);
  }
}

// Fonction pour créer un super admin si aucun n'existe
async function ensureSuperAdminExists() {
  try {
    console.log('\n🔍 Vérification de l\'existence d\'un super administrateur...');

    const superAdmins = await prisma.user.findMany({
      where: { isSuperAdmin: true },
      select: { id: true, username: true, email: true }
    });

    if (superAdmins.length === 0) {
      console.log('⚠️  Aucun super administrateur trouvé !');
      console.log('💡 Création d\'un super administrateur par défaut...\n');

      // Créer un super admin par défaut
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash('!Minecraft33', 12);

      const superAdmin = await prisma.user.create({
        data: {
          username: 'superadmin',
          email: 'superadmin@techanswers.com',
          password: hashedPassword,
          isAdmin: true,
          isSuperAdmin: true
        },
        select: {
          id: true,
          username: true,
          email: true,
          isAdmin: true,
          isSuperAdmin: true
        }
      });

      console.log('✅ Super administrateur créé :');
      console.log(`  Username: ${superAdmin.username}`);
      console.log(`  Email: ${superAdmin.email}`);
      console.log(`  Password: !Minecraft33`);
      console.log(`  Admin: ${superAdmin.isAdmin ? '✅' : '❌'}`);
      console.log(`  SuperAdmin: ${superAdmin.isSuperAdmin ? '✅' : '❌'}`);
    } else {
      console.log(`✅ ${superAdmins.length} super administrateur(s) trouvé(s)`);
      superAdmins.forEach(admin => {
        console.log(`  - ${admin.username} (${admin.email})`);
      });
    }

  } catch (error) {
    console.error('❌ Erreur lors de la vérification :', error);
  }
}

// Exécution du script
async function main() {
  console.log('🚀 Script de mise à jour des utilisateurs - Super Admin\n');
  
  await updateUsersWithSuperAdmin();
  await ensureSuperAdminExists();
  
  console.log('\n✨ Script terminé !');
}

main()
  .catch((error) => {
    console.error('❌ Erreur fatale :', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 