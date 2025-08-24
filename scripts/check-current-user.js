const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkCurrentUser() {
  try {
    // Récupérer tous les utilisateurs avec leurs rôles
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        isAdmin: true,
        isSuperAdmin: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log('📋 Tous les utilisateurs:');
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.username} (${user.email})`);
      console.log(`   - ID: ${user.id}`);
      console.log(`   - isAdmin: ${user.isAdmin}`);
      console.log(`   - isSuperAdmin: ${user.isSuperAdmin}`);
      console.log(`   - Créé le: ${user.createdAt}`);
      console.log('');
    });

    // Trouver les superadmins
    const superAdmins = users.filter(user => user.isSuperAdmin);
    console.log('👑 Superadmins:');
    superAdmins.forEach(user => {
      console.log(`   - ${user.username} (${user.email})`);
      console.log(`     isAdmin: ${user.isAdmin}, isSuperAdmin: ${user.isSuperAdmin}`);
    });

    // Trouver les admins
    const admins = users.filter(user => user.isAdmin);
    console.log('🔧 Admins:');
    admins.forEach(user => {
      console.log(`   - ${user.username} (${user.email})`);
      console.log(`     isAdmin: ${user.isAdmin}, isSuperAdmin: ${user.isSuperAdmin}`);
    });

  } catch (error) {
    console.error('Erreur:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkCurrentUser(); 