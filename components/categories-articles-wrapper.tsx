'use client';

import { usePurchasedArticles } from '@/lib/hooks/usePurchasedArticles';
import PremiumArticleCard from '@/components/premium-article-card';
import ArticleCard from '@/components/article-card';

interface Article {
  id: string;
  title: string;
  excerpt: string | null;
  slug: string;
  imageUrl: string | null;
  isMarketing: boolean;
  isPremium: boolean;
  premiumPrice: number | null;
  createdAt: Date;
  user: {
    username: string;
  };
}

interface CategoriesArticlesWrapperProps {
  articles: Article[];
}

export default function CategoriesArticlesWrapper({ articles }: CategoriesArticlesWrapperProps) {
  const { hasPurchased } = usePurchasedArticles();

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {articles.map((article) => (
        <div key={article.id} className="hover:scale-105 transition-transform duration-200">
          {article.isPremium ? (
            <div className="h-[500px]">
              <PremiumArticleCard 
                article={{
                  id: article.id,
                  title: article.title,
                  excerpt: article.excerpt || undefined,
                  slug: article.slug,
                  imageUrl: article.imageUrl || undefined,
                  premiumPrice: article.premiumPrice || 0,
                  isPremium: article.isPremium
                }}
                hasPurchased={hasPurchased(article.id)}
              />
            </div>
          ) : (
            <ArticleCard 
              article={{
                id: article.id,
                title: article.title,
                excerpt: article.excerpt,
                slug: article.slug,
                imageUrl: article.imageUrl,
                createdAt: article.createdAt.toISOString(),
                user: article.user
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
} 