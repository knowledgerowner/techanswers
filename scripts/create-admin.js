const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createAdminUser() {
  try {
    const password = '!Minecraft33';
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Vérifier si l'admin existe déjà
    const existingAdmin = await prisma.user.findFirst({
      where: {
        OR: [
          { email: 'admin@techanswers.blog' },
          { username: 'admin' }
        ]
      }
    });

    if (existingAdmin) {
      console.log('❌ Un utilisateur admin existe déjà avec cet email ou username');
      console.log('Email existant:', existingAdmin.email);
      console.log('Username existant:', existingAdmin.username);
      return;
    }

    // Créer l'admin
    const admin = await prisma.user.create({
      data: {
        email: 'admin@techanswers.com',
        username: 'admin',
        password: hashedPassword,
        isAdmin: true,
        isSuperAdmin: true
      }
    });

    console.log('✅ Super Admin créé avec succès !');
    console.log('ID:', admin.id);
    console.log('Email:', admin.email);
    console.log('Username:', admin.username);
    console.log('isAdmin:', admin.isAdmin);
    console.log('isSuperAdmin:', admin.isSuperAdmin);
    console.log('Créé le:', admin.createdAt);
    console.log('\n🔑 Identifiants de connexion:');
    console.log('Username: admin');
    console.log('Password: !Minecraft33');
    console.log('\n👑 Statut: Super Administrateur');

  } catch (error) {
    console.error('❌ Erreur lors de la création de l\'admin:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdminUser(); 