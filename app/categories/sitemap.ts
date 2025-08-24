import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

export default async function categoriesSitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://wwww.techanswers.blog';
  
  try {
    // Récupérer toutes les catégories avec le nombre d'articles
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        slug: true,
        updatedAt: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    // Compter les articles par catégorie
    const categoriesWithCount = await Promise.all(
      categories.map(async (category) => {
        const articleCount = await prisma.article.count({
          where: {
            categoryIds: { has: category.id },
            isPublished: true,
          },
        });
        return { ...category, articleCount };
      })
    );

    // Générer le sitemap des catégories
    const categorySitemap = categoriesWithCount.map((category) => ({
      url: `${baseUrl}/categories/${category.slug}`,
      lastModified: category.updatedAt,
      changeFrequency: 'weekly' as const,
      // Priorité basée sur le nombre d'articles
      priority: Math.min(0.8, 0.3 + (category.articleCount * 0.1)),
    }));

    return categorySitemap;
  } catch (error) {
    console.error('Erreur lors de la génération du sitemap des catégories:', error);
    return [];
  }
} 