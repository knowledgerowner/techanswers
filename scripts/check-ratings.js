const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkRatings() {
  try {
    console.log('🔍 Vérification des notes d\'articles...\n');

    // Récupérer tous les articles avec leurs notes
    const articles = await prisma.article.findMany({
      include: {
        ratings: {
          include: {
            user: {
              select: {
                username: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    console.log(`📊 Articles trouvés: ${articles.length}\n`);

    articles.forEach((article, index) => {
      console.log(`${index + 1}. Article: ${article.title}`);
      console.log(`   Slug: ${article.slug}`);
      console.log(`   Notes: ${article.ratings.length}`);
      
      if (article.ratings.length > 0) {
        // Calculer la note moyenne
        const totalRating = article.ratings.reduce((sum, rating) => sum + rating.rating, 0);
        const averageRating = (totalRating / article.ratings.length).toFixed(1);
        console.log(`   Note moyenne: ${averageRating}/5`);
        
        // Afficher les notes individuelles
        article.ratings.forEach((rating, rIndex) => {
          const username = rating.user?.username || rating.authorName || 'Utilisateur inconnu';
          console.log(`     ${rIndex + 1}. ${username}: ${rating.rating}/5 (${rating.createdAt})`);
        });
      } else {
        console.log(`   Aucune note`);
      }
      console.log('');
    });

    // Vérifier les utilisateurs qui ont noté plusieurs fois le même article
    console.log('🔍 Vérification des doublons de notes...\n');
    
    const duplicateRatings = await prisma.rating.groupBy({
      by: ['articleId', 'userId'],
      _count: {
        id: true,
      },
      having: {
        id: {
          _count: {
            gt: 1,
          },
        },
      },
    });

    if (duplicateRatings.length > 0) {
      console.log('❌ Doublons trouvés:');
      duplicateRatings.forEach((duplicate, index) => {
        console.log(`${index + 1}. Article ID: ${duplicate.articleId}, User ID: ${duplicate.userId}, Notes: ${duplicate._count.id}`);
      });
    } else {
      console.log('✅ Aucun doublon trouvé - chaque utilisateur ne peut noter qu\'une fois par article');
    }

  } catch (error) {
    console.error('❌ Erreur lors de la vérification:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkRatings(); 