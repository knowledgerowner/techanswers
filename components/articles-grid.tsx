'use client';

import PremiumArticleCard from "@/components/premium-article-card";
import ArticleCard from "@/components/article-card";

interface Article {
  id: string;
  title: string;
  excerpt: string | null;
  slug: string;
  imageUrl: string | null;
  isMarketing: boolean;
  isPremium: boolean;
  premiumPrice: number | null;
  categoryIds: string[];
  createdAt: string;
  user: {
    username: string;
  };
}

interface ArticlesGridProps {
  articles: Article[];
}

export default function ArticlesGrid({ articles }: ArticlesGridProps) {
  if (articles.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Aucun article trouvé</p>
      </div>
    );
  }

  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {articles.map((article) => (
        <div key={article.id}>
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
                  isPremium: article.isPremium,
                }}
                hasPurchased={false}
              />
            </div>
          ) : (
            <ArticleCard article={{
              id: article.id,
              title: article.title,
              excerpt: article.excerpt,
              slug: article.slug,
              imageUrl: article.imageUrl,
              createdAt: article.createdAt,
              user: article.user,
            }} />
          )}
        </div>
      ))}
    </div>
  );
} 