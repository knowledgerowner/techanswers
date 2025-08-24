const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function promoteToSuperAdmin() {
  try {
    console.log('👑 Promotion d\'un utilisateur en Super Admin\n');

    // Récupérer tous les utilisateurs
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        isAdmin: true,
        isSuperAdmin: true
      },
      orderBy: { createdAt: 'desc' }
    });

    console.log('📋 Utilisateurs disponibles :\n');
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.username} (${user.email})`);
      console.log(`   Admin: ${user.isAdmin ? '✅' : '❌'}`);
      console.log(`   SuperAdmin: ${user.isSuperAdmin ? '✅' : '❌'}`);
      console.log('');
    });

    // Promouvoir l'utilisateur margoul1 en super admin
    const targetUser = users.find(user => user.username === 'margoul1' || user.email === 'theo.morio@gmail.com');
    
    if (targetUser) {
      console.log(`🔄 Promotion de ${targetUser.username} en Super Admin...`);
      
      const updatedUser = await prisma.user.update({
        where: { id: targetUser.id },
        data: {
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

      console.log('✅ Utilisateur promu avec succès !');
      console.log(`  Username: ${updatedUser.username}`);
      console.log(`  Email: ${updatedUser.email}`);
      console.log(`  Admin: ${updatedUser.isAdmin ? '✅' : '❌'}`);
      console.log(`  SuperAdmin: ${updatedUser.isSuperAdmin ? '✅' : '❌'}`);
    } else {
      console.log('❌ Utilisateur margoul1 non trouvé');
    }

  } catch (error) {
    console.error('❌ Erreur lors de la promotion :', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Exécution du script
promoteToSuperAdmin()
  .catch((error) => {
    console.error('❌ Erreur fatale :', error);
    process.exit(1);
  }); 