import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

export default async function articlesSitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.techanswers.blog';
  
  try {
    // Récupérer tous les articles publiés
    const articles = await prisma.article.findMany({
      where: {
        isPublished: true,
      },
      select: {
        slug: true,
        updatedAt: true,
        isPremium: true,
        isMarketing: true,
        createdAt: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    // Générer le sitemap des articles
    const articleSitemap = articles.map((article) => ({
      url: `${baseUrl}/articles/${article.slug}`,
      lastModified: article.updatedAt,
      changeFrequency: 'monthly' as const,
      // Priorité basée sur le type d'article
      priority: article.isMarketing ? 0.9 : article.isPremium ? 0.8 : 0.7,
    }));

    return articleSitemap;
  } catch (error) {
    console.error('Erreur lors de la génération du sitemap des articles:', error);
    return [];
  }
} 