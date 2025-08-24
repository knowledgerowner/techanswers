
import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

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

interface NoScriptFallbackProps {
  articles: Article[];
  title?: string;
  description?: string;
  showPagination?: boolean;
  currentPage?: number;
  totalPages?: number;
  searchParams?: Record<string, string>;
}

export default function NoScriptFallback({ 
  articles, 
  title = "Articles TechAnswers",
  description = "Découvrez nos articles techniques sur le développement web, la cybersécurité et l'intelligence artificielle",
  showPagination = false,
  currentPage = 1,
  totalPages = 1,
  searchParams = {}
}: NoScriptFallbackProps) {
  return (
    <noscript>
      <div className="container mx-auto px-4 py-8">
        {/* Header statique */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            {title}
          </h1>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto mb-6">
            {description}
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

        {/* Grille d&apos;articles statique */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {articles.map((article) => (
            <Card key={article.id} className="h-full overflow-hidden">
              {/* Image */}
              <div className="aspect-[16/9] relative overflow-hidden bg-muted">
                {article.imageUrl ? (
                  <Image 
                    src={article.imageUrl} 
                    alt={article.title}
                    fill
                    className="object-cover" 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-2 bg-background rounded-full flex items-center justify-center">
                        <span className="text-2xl">📄</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Aucune image</p>
                    </div>
                  </div>
                )}
                
                {/* Badge Premium si applicable */}
                {article.isPremium && (
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-none">
                      <span className="mr-1">🔒</span>
                      Premium
                    </Badge>
                  </div>
                )}
              </div>

              {/* Contenu */}
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="outline" className="text-xs">
                    {article.isPremium ? 'Article Premium' : 'Article'}
                  </Badge>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <span className="mr-1">👤</span>
                    {article.user.username}
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold leading-tight mb-2">
                  <Link href={`/articles/${article.slug}`} className="hover:text-primary transition-colors">
                    {article.title}
                  </Link>
                </h3>
                
                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                  {article.excerpt || "Aucun résumé disponible"}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-xs text-muted-foreground">
                    <span className="mr-1">📅</span>
                    {new Date(article.createdAt).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                  
                  {article.isPremium && (
                    <div className="text-sm font-bold text-green-600">
                      {article.premiumPrice?.toFixed(2)} €
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pagination statique */}
        {showPagination && totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-8">
            {/* Fonction helper pour construire les URLs avec tous les paramètres */}
            {(() => {
              const buildPageUrl = (page: number) => {
                const params = new URLSearchParams(searchParams || {});
                params.set('page', page.toString());
                return `?${params.toString()}`;
              };
              
              return (
                <>
                  {currentPage > 1 && (
                    <Link 
                      href={buildPageUrl(currentPage - 1)}
                      className="px-4 py-2 border border-input bg-background rounded-md text-sm hover:bg-accent transition-colors"
                    >
                      ← Précédent
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
                        <Link
                          key={pageNum}
                          href={buildPageUrl(pageNum)}
                          className={`px-3 py-2 rounded-md text-sm transition-colors ${
                            currentPage === pageNum 
                              ? 'bg-primary text-primary-foreground' 
                              : 'border border-input bg-background hover:bg-accent'
                          }`}
                        >
                          {pageNum}
                        </Link>
                      );
                    })}
                  </div>
                  
                  {currentPage < totalPages && (
                    <Link 
                      href={buildPageUrl(currentPage + 1)}
                      className="px-4 py-2 border border-input bg-background rounded-md text-sm hover:bg-accent transition-colors"
                    >
                      Suivant →
                    </Link>
                  )}
                </>
              );
            })()}
          </div>
        )}

        {/* Section SEO statique */}
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
      </div>
    </noscript>
  );
} 