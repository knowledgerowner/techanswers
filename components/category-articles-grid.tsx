'use client';

import { usePurchasedArticles } from '@/lib/hooks/usePurchasedArticles';
import PremiumArticleCard from '@/components/premium-article-card';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { User, Calendar, ArrowLeft, ArrowRight, BookOpen } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

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

interface CategoryArticlesGridProps {
  articles: Article[];
  totalPages: number;
  currentPage: number;
  categorySlug: string;
}

export default function CategoryArticlesGrid({ articles, totalPages, currentPage, categorySlug }: CategoryArticlesGridProps) {
  const { hasPurchased } = usePurchasedArticles();

  return (
    <>
      <div className="grid gap-6 grid-cols-2 lg:grid-cols-3 mb-12">
        {articles.map((article) => (
          <div key={article.id}>
            {article.isPremium ? (
              <div className="h-[400px] sm:h-[450px] lg:h-[500px]">
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
                  hasPurchased={hasPurchased(article.id)}
                />
              </div>
            ) : (
              <Link href={`/articles/${article.slug}`}>
                <Card className="h-[400px] sm:h-[450px] lg:h-[500px] group overflow-hidden transition-all duration-300 hover:shadow-lg bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-800 dark:to-gray-900 relative">
                  <div className="relative h-48 sm:h-56 lg:h-64 overflow-hidden bg-muted">
                    {article.imageUrl ? (
                      <Image 
                        src={article.imageUrl} 
                        alt={article.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105" 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl">
                            <BookOpen className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                          </div>
                          <p className="text-xs sm:text-sm text-muted-foreground font-medium">Article</p>
                        </div>
                      </div>
                    )}
                    
                    <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
                      <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 shadow-lg font-medium text-xs sm:text-sm">
                        <BookOpen className="w-3 h-3 mr-1" />
                        Gratuit
                      </Badge>
                    </div>
                  </div>

                  <CardContent className="p-4 sm:p-6 flex flex-col h-[152px] sm:h-[194px] lg:h-[236px]">
                    <div className="flex items-center gap-2 sm:gap-3 mb-3 text-xs sm:text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="truncate">{article.user.username}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="hidden sm:inline">{article.createdAt.toLocaleDateString('fr-FR', { 
                          day: 'numeric', 
                          month: 'short',
                          year: 'numeric'
                        })}</span>
                        <span className="sm:hidden">{article.createdAt.toLocaleDateString('fr-FR', { 
                          day: 'numeric', 
                          month: 'short'
                        })}</span>
                      </div>
                    </div>
                    
                    <h3 className="text-lg sm:text-xl font-bold mb-3 text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    
                    {/* Extrait - caché sur mobile */}
                    <p className="hidden sm:block text-muted-foreground text-sm leading-relaxed line-clamp-3 flex-1">
                      {article.excerpt || "Découvrez ce contenu technique gratuit et enrichissez vos connaissances."}
                    </p>

                    {/* Footer - affiché seulement sur desktop quand il y a l'extrait */}
                    <div className="hidden sm:flex items-center justify-end pt-4 mt-auto">
                      <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                        <ArrowRight className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )}
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mb-12">
          {currentPage > 1 && (
            <Link href={`/categories/${categorySlug}?page=${currentPage - 1}`}>
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Précédent
              </Button>
            </Link>
          )}
          
          <div className="flex gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              
              return (
                <Link key={pageNum} href={`/categories/${categorySlug}?page=${pageNum}`}>
                  <Button
                    variant={currentPage === pageNum ? "default" : "outline"}
                    size="sm"
                    className="w-10 h-10"
                  >
                    {pageNum}
                  </Button>
                </Link>
              );
            })}
          </div>
          
          {currentPage < totalPages && (
            <Link href={`/categories/${categorySlug}?page=${currentPage + 1}`}>
              <Button variant="outline" size="sm">
                Suivant
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          )}
        </div>
      )}

      {/* Navigation d'articles suggérés */}
      <div className="mt-12">
        <h3 className="text-lg font-semibold mb-6 text-center">Découvrez d&apos;autres articles</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {articles.slice(0, 3).map((article) => (
            <Link 
              key={article.id} 
              href={`/articles/${article.slug}`}
              className="block group"
            >
              <Card className="h-32 group-hover:shadow-lg transition-all duration-300">
                <CardContent className="p-4 h-full">
                  <div className="flex items-start space-x-3 h-full">
                    <div className="relative w-16 h-16 flex-shrink-0 rounded-md overflow-hidden bg-gray-100">
                      {article.imageUrl ? (
                        <Image
                          src={article.imageUrl}
                          alt={article.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-lg">📄</span>
                        </div>
                      )}
                      {article.isPremium && (
                        <div className="absolute top-0 right-0 w-3 h-3 bg-purple-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-white group-hover:text-blue-600 transition-colors line-clamp-2">
                        {article.title}
                      </h4>
                      {article.excerpt && (
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                          {article.excerpt}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
} 