'use client';

import { usePurchasedArticles } from '@/lib/hooks/usePurchasedArticles';
import CategoryArticlesGrid from '@/components/category-articles-grid';

interface Article {
  id: string;
  title: string;
  excerpt: string | null;
  slug: string;
  imageUrl?: string | null;
  premiumPrice: number | null;
  isPremium: boolean;
  isMarketing: boolean;
  createdAt: Date;
  user: {
    username: string;
  };
}

interface CategoryArticlesGridWrapperProps {
  articles: Article[];
  totalPages: number;
  currentPage: number;
  categorySlug: string;
}

export default function CategoryArticlesGridWrapper({ 
  articles, 
  totalPages, 
  currentPage, 
  categorySlug 
}: CategoryArticlesGridWrapperProps) {
  const { hasPurchased } = usePurchasedArticles();

  // Mettre à jour les articles avec l'état d'achat
  const articlesWithPurchaseState = articles.map(article => ({
    ...article,
    hasPurchased: hasPurchased(article.id)
  }));

  return (
    <CategoryArticlesGrid
      articles={articlesWithPurchaseState}
      totalPages={totalPages}
      currentPage={currentPage}
      categorySlug={categorySlug}
    />
  );
} 