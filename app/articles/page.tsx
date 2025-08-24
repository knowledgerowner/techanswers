"use client";

import { useState, useEffect, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Search, 
  ArrowLeft, 
  ArrowRight,
  Filter,
} from "lucide-react";
import { usePurchasedArticles } from "@/lib/hooks/usePurchasedArticles";
import PremiumArticleCard from "@/components/premium-article-card";
import ArticleCard from "@/components/article-card";
import NoScriptFallback from "@/components/noscript-fallback";

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

interface Category {
  id: string;
  name: string;
  slug: string;
}

// Composant de pagination séparé pour Suspense
function Pagination({ 
  currentPage, 
  totalPages, 
  onPageChange 
}: { 
  currentPage: number; 
  totalPages: number; 
  onPageChange: (page: number) => void; 
}) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center gap-2 mt-8">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Précédent
      </Button>
      
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
            <Button
              key={pageNum}
              variant={currentPage === pageNum ? "default" : "outline"}
              size="sm"
              onClick={() => onPageChange(pageNum)}
              className="w-10 h-10"
            >
              {pageNum}
            </Button>
          );
        })}
      </div>
      
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
      >
        Suivant
        <ArrowRight className="h-4 w-4 ml-1" />
      </Button>
    </div>
  );
}

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState<"date" | "title">("date");
  const { hasPurchased } = usePurchasedArticles();

  const ITEMS_PER_PAGE = 12;

  useEffect(() => {
    fetchArticles();
    fetchCategories();
  }, [currentPage, searchTerm, selectedCategory, sortBy]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchArticles = async () => {
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: ITEMS_PER_PAGE.toString(),
        search: searchTerm,
        category: selectedCategory,
        sort: sortBy,
      });

      const response = await fetch(`/api/articles?${params}`);
      const data = await response.json();
      
      setArticles(data.articles || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error('Erreur lors du chargement des articles:', error);
      setArticles([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Erreur lors du chargement des catégories:', error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="container mx-auto px-4 pb-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">
          Articles TechAnswers - Votre bibliothèque de connaissances technologiques
        </h1>
        <p className="text-xl text-muted-foreground max-w-4xl mx-auto mb-6">
          Explorez notre collection complète d&apos;articles techniques, tutoriels et guides pratiques 
          sur le développement web moderne, la cybersécurité, l&apos;intelligence artificielle et les 
          technologies émergentes. Chaque article est soigneusement rédigé par nos experts pour vous 
          fournir des informations fiables et à jour.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto text-sm text-muted-foreground">
          <div className="flex items-center justify-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            Articles gratuits et premium
          </div>
          <div className="flex items-center justify-center gap-2">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            Mise à jour hebdomadaire
          </div>
          <div className="flex items-center justify-center gap-2">
            <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
            Expertise technique validée
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Recherche et filtres
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                type="text"
                placeholder="Rechercher un article..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </form>
          
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Filtrer par :</span>
            </div>
            
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">Toutes les catégories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value as "date" | "title");
                setCurrentPage(1);
              }}
              className="px-3 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="date">Plus récents</option>
              <option value="title">Ordre alphabétique</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Articles Grid */}
      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
            <Card key={i} className="overflow-hidden animate-pulse">
              <div className="aspect-[16/9] bg-muted" />
              <CardContent className="p-6 space-y-3">
                <div className="h-4 bg-muted rounded w-20" />
                <div className="h-6 bg-muted rounded w-full" />
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-4 bg-muted rounded w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : articles && articles.length > 0 ? (
        <>
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
                    hasPurchased={hasPurchased(article.id)}
                  />
                </div>
              ) : (
                <ArticleCard article={article} />
              )}
            </div>
          ))}
        </div>

          {/* Pagination */}
          <Suspense fallback={<div className="h-16 flex items-center justify-center">Chargement...</div>}>
            <Pagination 
              currentPage={currentPage} 
              totalPages={totalPages} 
              onPageChange={handlePageChange} 
            />
          </Suspense>
        </>
      ) : (
        <Card>
          <CardContent className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-muted rounded-full flex items-center justify-center">
              <span className="text-3xl">📝</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">
              Aucun article trouvé
            </h3>
            <p className="text-muted-foreground mb-6">
              {searchTerm || selectedCategory 
                ? "Essayez de modifier vos critères de recherche" 
                : "Aucun article n'est disponible pour le moment"
              }
            </p>
            {(searchTerm || selectedCategory) && (
              <Button 
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("");
                  setCurrentPage(1);
                }}
                variant="outline"
              >
                Effacer les filtres
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Section SEO */}
      <section className="mt-16 mb-8">
        <div className="prose prose-invert max-w-none">
          <h2 className="text-2xl font-semibold mb-6">TechAnswers - Votre source d&apos;articles techniques de qualité</h2>
          <p className="text-muted-foreground mb-4">
            Notre bibliothèque d&apos;articles couvre l&apos;ensemble du spectre technologique moderne, 
            du développement frontend avec React, Next.js et Vue.js, au backend avec Node.js, Python et Java. 
            Nous abordons également les sujets de cybersécurité, d&apos;intelligence artificielle, de cloud computing 
            et de DevOps pour vous tenir informés des dernières tendances et bonnes pratiques.
          </p>
          <p className="text-muted-foreground mb-4">
            Chaque article est rédigé par des experts du domaine, testé et validé pour garantir 
            l&apos;exactitude des informations. Que vous soyez développeur débutant ou expert confirmé, 
            nos contenus s&apos;adaptent à tous les niveaux et vous accompagnent dans votre progression technique.
          </p>
          <p className="text-muted-foreground">
            Découvrez nos articles premium pour accéder à du contenu exclusif, des tutoriels avancés 
            et des analyses approfondies. Notre équipe s&apos;engage à publier régulièrement de nouveaux 
            contenus pour vous maintenir à la pointe de la technologie.
          </p>
        </div>
      </section>

      {/* Fallback NoScript pour les bots et navigateurs sans JavaScript */}
      <NoScriptFallback 
        articles={articles}
        title="Articles TechAnswers - Bibliothèque technique complète"
        description="Explorez notre collection d'articles sur le développement web, la cybersécurité, l'IA et les technologies émergentes. Contenu technique validé par des experts."
        showPagination={true}
        currentPage={currentPage}
        totalPages={totalPages}
      />
    </div>
  );
} 