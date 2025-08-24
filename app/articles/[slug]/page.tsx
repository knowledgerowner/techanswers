import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { markdownToHtml } from "@/lib/markdown";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Calendar, User, Eye, MessageCircle, Star } from "lucide-react";
import Link from "next/link";
import { RatingStars } from "@/components/rating-stars";
import { ArticleComments } from "@/components/article-comments";
import PremiumArticleContent from "@/components/premium-article-content";
import Image from "next/image";

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  
  // Récupérer l'article actuel
  const article = await prisma.article.findUnique({
    where: { slug },
    include: {
      user: {
        select: {
          username: true,
        },
      },
      comments: {
        include: {
          user: {
            select: {
              username: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      },
      ratings: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  // Récupérer tous les articles publiés pour la navigation
  const allArticles = await prisma.article.findMany({
    where: { isPublished: true },
    select: {
      id: true,
      title: true,
      excerpt: true,
      slug: true,
      imageUrl: true,
      isPremium: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  // Trouver l'index de l'article actuel
  const currentIndex = allArticles.findIndex(a => a.slug === slug);
  
  // Récupérer 3 articles précédents et 3 suivants
  const previousArticles = allArticles
    .slice(Math.max(0, currentIndex - 3), currentIndex)
    .reverse();
  
  const nextArticles = allArticles
    .slice(currentIndex + 1, Math.min(allArticles.length, currentIndex + 4));

  if (!article || !article.isPublished) {
    notFound();
  }

  // Calculer la note moyenne
  const averageRating = article.ratings.length > 0
    ? article.ratings.reduce((sum, rating) => sum + rating.rating, 0) / article.ratings.length
    : 0;

  // Convertir le contenu Markdown en HTML pour les articles gratuits
  const htmlContent = article.isPremium ? article.content : await markdownToHtml(article.content);

  // Si c'est un article premium, utiliser le composant client
  if (article.isPremium) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <Link href="/articles">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour aux articles
            </Button>
          </Link>
          
          <PremiumArticleContent
            article={{
              id: article.id,
              title: article.title,
              content: article.content,
              excerpt: article.excerpt || undefined,
              slug: article.slug,
              imageUrl: article.imageUrl || undefined,
              premiumPrice: article.premiumPrice || 0,
              isPremium: article.isPremium,
              createdAt: article.createdAt,
              categoryIds: article.categoryIds,
              user: article.user,
              comments: article.comments,
              ratings: article.ratings,
            }}
            averageRating={averageRating}
            navigationArticles={{
              previous: previousArticles.map(article => ({
                ...article,
                createdAt: article.createdAt.toISOString()
              })),
              next: nextArticles.map(article => ({
                ...article,
                createdAt: article.createdAt.toISOString()
              })),
              currentIndex,
              total: allArticles.length
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Tracker les vues d'articles */}
      {/* <ArticleTracker articleId={article.id} /> */}
      
      <div className="container mx-auto px-4 py-8">
        {/* Bouton retour */}
        <Link href="/articles">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour aux articles
          </Button>
        </Link>

        {/* En-tête de l'article */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            {article.categoryIds.map((categoryId) => (
              <Badge key={categoryId} variant="outline">
                {categoryId}
              </Badge>
            ))}
          </div>
          
          <h1 className="text-4xl font-bold mb-4">{article.title}</h1>
          
          <div className="flex items-center gap-6 text-muted-foreground mb-6">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>{article.user.username}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{format(article.createdAt, "dd MMMM yyyy", { locale: fr })}</span>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              <span>0 vues</span>
            </div>
            <div className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              <span>{article.comments.length} commentaires</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4" />
              <span>{averageRating.toFixed(1)}/5 ({article.ratings.length} votes)</span>
            </div>
          </div>

          {article.excerpt && (
            <p className="text-lg text-muted-foreground mb-6">
              {article.excerpt}
            </p>
          )}
        </div>

        {/* Image de l'article */}
        {article.imageUrl && (
          <div className="mb-8">
            <Image
              src={article.imageUrl}
              alt={article.title}
              className="w-full h-64 object-cover rounded-lg"
              width={1000}
              height={1000}
            />
          </div>
        )}

        {/* Contenu de l'article */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div 
              className="markdown-preview"
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            />
          </CardContent>
        </Card>

        <Separator className="my-8" />

        {/* Système de notation */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Noter cet article</CardTitle>
            <CardDescription>
              Donnez votre avis sur cet article
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RatingStars 
              articleSlug={slug}
              currentRating={0}
            />
          </CardContent>
        </Card>

        <Separator className="my-8" />

        {/* Commentaires */}
        <ArticleComments 
          articleSlug={slug}
          comments={article.comments.map(comment => ({
            id: comment.id,
            content: comment.content,
            createdAt: comment.createdAt.toISOString(),
            user: comment.user || undefined,
            authorName: comment.authorName,
          }))}
        />

        {/* Navigation d'articles mobile - Visible uniquement sur mobile/tablette */}
        <div className="md:hidden">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-lg">Découvrez nos derniers articles</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Articles précédents */}
              {previousArticles.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">
                    Articles précédents
                  </h4>
                  <div className="space-y-3">
                    {previousArticles.map((prevArticle) => (
                      <Link 
                        key={prevArticle.id} 
                        href={`/articles/${prevArticle.slug}`}
                        className="block group"
                      >
                        <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors border border-border">
                          <div className="relative w-16 h-16 flex-shrink-0 rounded-md overflow-hidden bg-muted">
                            {prevArticle.imageUrl ? (
                              <Image
                                src={prevArticle.imageUrl}
                                alt={prevArticle.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <span className="text-xl">📄</span>
                              </div>
                            )}
                            {prevArticle.isPremium && (
                              <div className="absolute top-0 right-0 w-3 h-3 bg-purple-500 rounded-full border-2 border-background"></div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h5 className="text-sm font-medium group-hover:text-primary transition-colors line-clamp-2">
                              {prevArticle.title}
                            </h5>
                            {prevArticle.excerpt && (
                              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                {prevArticle.excerpt}
                              </p>
                            )}
                            <div className="flex items-center mt-2">
                              {prevArticle.isPremium ? (
                                <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
                                  Premium
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                                  Gratuit
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Articles suivants */}
              {nextArticles.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">
                    Articles suivants
                  </h4>
                  <div className="space-y-3">
                    {nextArticles.map((nextArticle) => (
                      <Link 
                        key={nextArticle.id} 
                        href={`/articles/${nextArticle.slug}`}
                        className="block group"
                      >
                        <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors border border-border">
                          <div className="relative w-16 h-16 flex-shrink-0 rounded-md overflow-hidden bg-muted">
                            {nextArticle.imageUrl ? (
                              <Image
                                src={nextArticle.imageUrl}
                                alt={nextArticle.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <span className="text-xl">📄</span>
                              </div>
                            )}
                            {nextArticle.isPremium && (
                              <div className="absolute top-0 right-0 w-3 h-3 bg-purple-500 rounded-full border-2 border-background"></div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h5 className="text-sm font-medium group-hover:text-primary transition-colors line-clamp-2">
                              {nextArticle.title}
                            </h5>
                            {nextArticle.excerpt && (
                              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                {nextArticle.excerpt}
                              </p>
                            )}
                            <div className="flex items-center mt-2">
                              {nextArticle.isPremium ? (
                                <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
                                  Premium
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                                  Gratuit
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Indicateur de position */}
              <div className="pt-3 border-t border-border">
                <div className="text-center">
                  <div className="text-xs text-muted-foreground">
                    {currentIndex + 1} sur {allArticles.length}
                  </div>
                  <div className="w-full bg-muted rounded-full h-1 mt-1">
                    <div
                      className="bg-gradient-to-r from-primary to-primary/70 h-1 rounded-full transition-all duration-300"
                      style={{ width: `${((currentIndex + 1) / allArticles.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

      

      {/* Navigation en bas par défaut (md+) */}
      <div className="hidden md:block fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-sm border-t border-border shadow-lg">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {previousArticles.length > 0 && (
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-muted-foreground">Précédents</span>
                  {previousArticles.slice(0, 3).map((article) => (
                    <Link key={article.id} href={`/articles/${article.slug}`} className="text-sm hover:text-primary">
                      {article.title.slice(0, 20)}...
                    </Link>
                  ))}
                </div>
              )}
            </div>
            
            <span className="text-xs text-muted-foreground">
              {currentIndex + 1} sur {allArticles.length}
            </span>
            
            <div className="flex items-center space-x-4">
              {nextArticles.length > 0 && (
                <div className="flex items-center space-x-2">
                  {nextArticles.slice(0, 3).map((article) => (
                    <Link key={article.id} href={`/articles/${article.slug}`} className="text-sm hover:text-primary">
                      {article.title.slice(0, 20)}...
                    </Link>
                  ))}
                  <span className="text-xs text-muted-foreground">Suivants</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      </div>
    </div>
  );
} 