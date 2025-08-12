const bcrypt = require('bcryptjs');

async function createAdminUser() {
  const hashedPassword = await bcrypt.hash('!Minecraft33', 12);
  
  console.log('Mot de passe hashé pour admin:');
  console.log(hashedPassword);
  console.log('\nUtilisez ces données dans votre base MongoDB:');
  console.log('Email: admin@blogtech.com');
  console.log('Username: admin');
  console.log('Password: admin123');
  console.log('isAdmin: true');
  console.log('Password hashé:', hashedPassword);
}

createAdminUser().catch(console.error); 