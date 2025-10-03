'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Lock, CreditCard, Check, MessageCircle, Star, User, Calendar } from 'lucide-react';
import { useAuth } from '@/lib/hooks/useAuth';
import { usePurchasedArticles } from '@/lib/hooks/usePurchasedArticles';
import { markdownToHtmlSync } from '@/lib/markdown';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { RatingStars } from '@/components/rating-stars';
import { ArticleComments } from '@/components/article-comments';
import { loadStripe } from '@stripe/stripe-js';
import Link from 'next/link';
import Image from 'next/image';

interface PremiumArticleContentProps {
  article: {
    id: string;
    title: string;
    content: string;
    excerpt?: string;
    slug: string;
    imageUrl?: string;
    premiumPrice: number;
    isPremium: boolean;
    createdAt: Date;
    categoryIds: string[];
    categories?: Array<{
      id: string;
      name: string;
      slug: string;
    }>;
    user: {
      username: string;
    };
    comments: any[]; // eslint-disable-line @typescript-eslint/no-explicit-any
    ratings: any[]; // eslint-disable-line @typescript-eslint/no-explicit-any
  };
  averageRating: number;
  navigationArticles?: {
    previous: Array<{
      id: string;
      title: string;
      excerpt?: string | null;
      slug: string;
      imageUrl?: string | null;
      isPremium: boolean;
      createdAt: string;
    }>;
    next: Array<{
      id: string;
      title: string;
      excerpt?: string | null;
      slug: string;
      imageUrl?: string | null;
      isPremium: boolean;
      createdAt: string;
    }>;
    currentIndex: number;
    total: number;
  };
}

export default function PremiumArticleContent({ 
  article, 
  averageRating,
  navigationArticles
}: PremiumArticleContentProps) {
  
  const [stripe, setStripe] = useState<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any
  const [isLoading, setIsLoading] = useState(false);
  const [htmlContent, setHtmlContent] = useState<string>('');
  const { user } = useAuth();
  const { hasPurchased, loading: purchasedLoading } = usePurchasedArticles();
  const router = useRouter();

  // Vérifier si l'utilisateur est admin ou super admin
  const isAdmin = user?.isAdmin || user?.isSuperAdmin;
  const hasAccess = hasPurchased(article.id) || isAdmin;

  useEffect(() => {
    // Convertir le contenu Markdown en HTML
    const convertedContent = markdownToHtmlSync(article.content);
    setHtmlContent(convertedContent);
  }, [article.content]);

  useEffect(() => {
    // Charger Stripe côté client
    const initStripe = async () => {
      const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
      if (!publishableKey) {
        console.error('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not defined');
        return;
      }
      const stripeInstance = await loadStripe(publishableKey);
      setStripe(stripeInstance);
    };
    initStripe();
  }, []);

  const handlePurchase = async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (!stripe) {
      alert('Stripe n\'est pas encore initialisé. Veuillez réessayer.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ articleId: article.id }),
      });

      const data = await response.json();

      if (response.ok) {
        // Rediriger vers Stripe Checkout avec le SDK
        const { error } = await stripe.redirectToCheckout({
          sessionId: data.sessionId,
        });

        if (error) {
          alert(error.message || 'Erreur lors de la redirection vers Stripe');
        }
      } else {
        alert(data.error || 'Erreur lors de la création de la session de paiement');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la création de la session de paiement');
    } finally {
      setIsLoading(false);
    }
  };

  // Affichage de chargement
  if (purchasedLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  // Si l'utilisateur n'a pas acheté l'article, afficher l'écran de vente
  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="container mx-auto px-4 py-8">
          {/* En-tête premium */}
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2">
              <Lock className="w-4 h-4 mr-2" />
              Contenu Premium
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              {article.title}
            </h1>
            {article.excerpt && (
              <p className="text-xl text-purple-200 max-w-3xl mx-auto">
                {article.excerpt}
              </p>
            )}
          </div>

          {/* Image de l'article */}
          {article.imageUrl && (
            <div className="mb-12">
              <Image
                src={article.imageUrl}
                alt={article.title}
                className="w-full h-96 object-cover rounded-lg mx-auto max-w-4xl"
                width={1000}
                height={1000}
              />
            </div>
          )}

          {/* Carte de vente */}
          <div className="max-w-2xl mx-auto">
            <Card className="bg-black/20 backdrop-blur-lg border-purple-500/30 text-white">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl mb-4">Accédez au contenu complet</CardTitle>
                <CardDescription className="text-purple-200 text-lg">
                  Débloquez l&apos;article premium et accédez à l&apos;intégralité du contenu exclusif
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Prix */}
                <div className="text-center">
                  <div className="text-6xl font-bold text-white mb-2">
                    {article.premiumPrice.toFixed(2)} €
                  </div>
                  <p className="text-purple-200">Accès à vie • Contenu exclusif • Support premium</p>
                </div>

                {/* Bouton d'achat */}
                <Button 
                  onClick={handlePurchase}
                  disabled={isLoading}
                  size="lg"
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-lg py-6"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3" />
                      Traitement...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5 mr-3" />
                      Acheter maintenant
                    </>
                  )}
                </Button>

                {/* Informations supplémentaires */}
                <div className="text-center text-sm text-purple-200">
                  <p>Paiement sécurisé avec Stripe • Satisfaction garantie</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Si l'utilisateur a acheté l'article, afficher le contenu complet
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Badge d'accès premium */}
        <div className="mb-6">
          {isAdmin ? (
            <Badge className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2">
              <Star className="w-4 h-4 mr-2" />
              Accès Administrateur
            </Badge>
          ) : (
            <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2">
              <Check className="w-4 h-4 mr-2" />
              Accès Premium Activé
            </Badge>
          )}
        </div>

        {/* En-tête de l'article */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            {article.categories && article.categories.length > 0 ? (
              article.categories.map((category) => (
                <Link key={category.id} href={`/categories/${category.slug}`}>
                  <Badge variant="outline" className="hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer">
                    {category.name}
                  </Badge>
                </Link>
              ))
            ) : (
              article.categoryIds.map((categoryId) => (
                <Badge key={categoryId} variant="outline">
                  {categoryId}
                </Badge>
              ))
            )}
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
              articleSlug={article.slug}
              currentRating={0}
            />
          </CardContent>
        </Card>

        <Separator className="my-8" />

        {/* Commentaires */}
        <ArticleComments 
          articleSlug={article.slug}
          comments={article.comments.map(comment => ({
            id: comment.id,
            content: comment.content,
            createdAt: comment.createdAt.toISOString(),
            user: comment.user || undefined,
            authorName: comment.authorName,
          }))}
        />

        {/* Navigation d'articles mobile - Visible uniquement sur mobile/tablette */}
        {navigationArticles && (
          <div className="md:hidden">
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-lg">Découvrez nos derniers articles</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Articles précédents */}
                {navigationArticles.previous.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">
                      Articles précédents
                    </h4>
                    <div className="space-y-3">
                      {navigationArticles.previous.map((prevArticle) => (
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
                {navigationArticles.next.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">
                      Articles suivants
                    </h4>
                    <div className="space-y-3">
                      {navigationArticles.next.map((nextArticle) => (
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
                      {navigationArticles.currentIndex + 1} sur {navigationArticles.total}
                    </div>
                    <div className="w-full bg-muted rounded-full h-1 mt-1">
                      <div
                        className="bg-gradient-to-r from-primary to-primary/70 h-1 rounded-full transition-all duration-300"
                        style={{ width: `${((navigationArticles.currentIndex + 1) / navigationArticles.total) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Navigation en bas par défaut (md+) */}
        {navigationArticles && (
          <div className="hidden md:block fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-sm border-t border-border shadow-lg">
            <div className="container mx-auto px-4 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {navigationArticles.previous.length > 0 && (
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-muted-foreground">Précédents</span>
                      {navigationArticles.previous.slice(0, 3).map((article) => (
                        <Link key={article.id} href={`/articles/${article.slug}`} className="text-sm hover:text-primary">
                          {article.title.slice(0, 20)}...
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
                
                <span className="text-xs text-muted-foreground">
                  {navigationArticles.currentIndex + 1} sur {navigationArticles.total}
                </span>
                
                <div className="flex items-center space-x-4">
                  {navigationArticles.next.length > 0 && (
                    <div className="flex items-center space-x-2">
                      {navigationArticles.next.slice(0, 3).map((article) => (
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
        )}

        {/* Navigation en bas par défaut (md+) */}
        {navigationArticles && (
          <div className="hidden md:block fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-sm border-t border-border shadow-lg">
            <div className="container mx-auto px-4 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {navigationArticles.previous.length > 0 && (
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-muted-foreground">Précédents</span>
                      {navigationArticles.previous.slice(0, 3).map((article) => (
                        <Link key={article.id} href={`/articles/${article.slug}`} className="text-sm hover:text-primary">
                          {article.title.slice(0, 20)}...
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
                
                <span className="text-xs text-muted-foreground">
                  {navigationArticles.currentIndex + 1} sur {navigationArticles.total}
                </span>
                
                <div className="flex items-center space-x-4">
                  {navigationArticles.next.length > 0 && (
                    <div className="flex items-center space-x-2">
                      {navigationArticles.next.slice(0, 3).map((article) => (
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
        )}
      </div>
    </div>
  );
} 