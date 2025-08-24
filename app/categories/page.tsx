"use client";

import { useState, useEffect } from "react";
import { usePurchasedArticles } from "@/lib/hooks/usePurchasedArticles";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import ArticleCard from "@/components/article-card";
import PremiumArticleCard from "@/components/premium-article-card";
import { Button } from "@/components/ui/button";
import { BookOpen, Star } from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  _count: {
    articles: number;
  };
}

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  imageUrl: string | null;
  readingTime: number;
  createdAt: string;
  isPremium: boolean;
  premiumPrice: number;
  user: {
    username: string;
  };
  category: {
    name: string;
    slug: string;
  };
  _count: {
    ratings: number;
  };
  averageRating: number;
}

export default function CategoriesPage() {
  const { hasPurchased } = usePurchasedArticles();
  const [categories, setCategories] = useState<Category[]>([]);
  const [marketingArticles, setMarketingArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [marketingLoading, setMarketingLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
    fetchMarketingArticles();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories/with-count');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Erreur lors du chargement des catégories:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMarketingArticles = async () => {
    try {
      const response = await fetch('/api/articles?isMarketing=true&limit=3');
      const data = await response.json();
      setMarketingArticles(data.articles || []);
    } catch (error) {
      console.error('Erreur lors du chargement des articles marketing:', error);
    } finally {
      setMarketingLoading(false);
    }
  };

  const getCategoryIcon = (name: string) => {
    const iconClass = "w-8 h-8";
    const nameLower = name.toLowerCase();
    
    if (nameLower.includes('web') || nameLower.includes('frontend') || nameLower.includes('react')) {
      return <div className={`${iconClass} bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold`}>W</div>;
    }
    if (nameLower.includes('sécurité') || nameLower.includes('security') || nameLower.includes('cyber')) {
      return <div className={`${iconClass} bg-red-500 rounded-lg flex items-center justify-center text-white font-bold`}>S</div>;
    }
    if (nameLower.includes('ai') || nameLower.includes('intelligence') || nameLower.includes('machine')) {
      return <div className={`${iconClass} bg-purple-500 rounded-lg flex items-center justify-center text-white font-bold`}>AI</div>;
    }
    if (nameLower.includes('devops') || nameLower.includes('cloud') || nameLower.includes('aws')) {
      return <div className={`${iconClass} bg-orange-500 rounded-lg flex items-center justify-center text-white font-bold`}>C</div>;
    }
    if (nameLower.includes('backend') || nameLower.includes('server') || nameLower.includes('api')) {
      return <div className={`${iconClass} bg-green-500 rounded-lg flex items-center justify-center text-white font-bold`}>B</div>;
    }
    return <div className={`${iconClass} bg-gray-500 rounded-lg flex items-center justify-center text-white font-bold`}>{name.charAt(0)}</div>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <BookOpen className="w-4 h-4" />
            Explorer nos catégories
          </div>
          
          <h1 className="text-5xl font-bold tracking-tight mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Catégories TechAnswers
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Naviguez dans notre collection d&apos;articles techniques organisés par domaines d&apos;expertise. 
            Trouvez rapidement les contenus qui correspondent à vos besoins et à votre niveau.
          </p>

          {/* Stats Cards */}
          
        </div>

        {/* Articles Marketing Section */}
        {!marketingLoading && marketingArticles.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <div className="flex items-center gap-2">
                <Star className="w-6 h-6 text-yellow-500" />
                <h2 className="text-3xl font-bold">Articles en vedette</h2>
              </div>
              <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-500">
                Sélection de l&apos;équipe
              </Badge>
            </div>
            
            <p className="text-muted-foreground mb-8 max-w-2xl">
              Découvrez notre sélection d&apos;articles techniques soigneusement choisis par notre équipe d&apos;experts. 
              Ces contenus premium vous offrent des insights approfondis et des perspectives uniques.
            </p>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {marketingArticles.map((article) => (
                <div key={article.id} className="hover:scale-105 transition-transform duration-200">
                  {article.isPremium ? (
                    <div className="h-[500px]">
                      <PremiumArticleCard 
                        article={{
                          ...article,
                          imageUrl: article.imageUrl || undefined,
                          excerpt: article.excerpt || undefined
                        }}
                        hasPurchased={hasPurchased(article.id)}
                      />
                    </div>
                  ) : (
                    <ArticleCard 
                      article={article}
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="text-center mt-8">
              <Link href="/articles?isMarketing=true">
                <Button variant="outline" size="lg">
                  Voir tous les articles vedette
                </Button>
              </Link>
            </div>
          </section>
        )}

        {/* Categories Section */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <h2 className="text-3xl font-bold">Toutes les catégories</h2>
            <Badge variant="outline">{categories.length} catégories</Badge>
          </div>

          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <Card key={i} className="h-40 animate-pulse">
                  <CardContent className="p-6 space-y-3">
                    <div className="h-8 w-8 bg-muted rounded-lg" />
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-3 bg-muted rounded w-full" />
                    <div className="h-3 bg-muted rounded w-1/2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : categories.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {categories.map((category) => (
                <Link key={category.id} href={`/categories/${category.slug}`}>
                  <Card className="h-full transition-all duration-200 hover:shadow-lg hover:-translate-y-1 group">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="group-hover:scale-110 transition-transform duration-200">
                          {getCategoryIcon(category.name)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-lg group-hover:text-primary transition-colors truncate">
                              {category.name}
                            </h3>
                            <Badge variant="outline" className="ml-2 flex-shrink-0">
                              {category._count.articles}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {category.description || "Découvrez nos articles spécialisés dans cette catégorie"}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <CardContent>
                <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Aucune catégorie trouvée</h3>
                <p className="text-muted-foreground">Les catégories seront bientôt disponibles.</p>
              </CardContent>
            </Card>
          )}
        </section>

        {/* SEO Section */}
        <section className="mt-20 mb-8">
          <Card className="border-none bg-gradient-to-r from-muted/50 to-muted/30">
            <CardContent className="p-8 lg:p-12">
              <h2 className="text-3xl font-bold mb-6 text-center">
                Organisation intelligente de nos contenus techniques
              </h2>
              
              <div className="grid gap-8 lg:grid-cols-2">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Navigation intuitive</h3>
                  <p className="text-muted-foreground mb-4">
                    Notre système de catégorisation couvre l&apos;ensemble des technologies modernes, 
                    organisées de manière logique pour faciliter votre navigation et votre apprentissage. 
                    Chaque catégorie regroupe des contenus cohérents et complémentaires.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-4">Expertise reconnue</h3>
                  <p className="text-muted-foreground mb-4">
                    Que vous soyez intéressé par le développement frontend, le backend, la cybersécurité 
                    ou l&apos;intelligence artificielle, nos catégories vous guident vers les contenus 
                    les plus pertinents pour vos objectifs d&apos;apprentissage.
                  </p>
                </div>
              </div>
              
              <div className="mt-8 text-center">
                <p className="text-muted-foreground max-w-3xl mx-auto">
                  Explorez nos catégories pour découvrir des articles spécialisés, des tutoriels pratiques, 
                  et des guides approfondis qui vous accompagneront dans votre parcours de développement technique. 
                  Notre équipe d&apos;experts maintient cette organisation à jour avec les dernières tendances.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
} 