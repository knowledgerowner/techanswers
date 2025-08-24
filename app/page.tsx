"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { usePurchasedArticles } from "@/lib/hooks/usePurchasedArticles";
import { Globe } from "@/components/ui/globe";
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

export default function Home() {
  const [featuredArticles, setFeaturedArticles] = useState<Article[]>([]);
  const [recentArticles, setRecentArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const { hasPurchased } = usePurchasedArticles();

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const [featuredResponse, recentResponse] = await Promise.all([
          fetch('/api/articles/featured'),
          fetch('/api/articles/recent')
        ]);
        
        const featuredData = await featuredResponse.json();
        const recentData = await recentResponse.json();
        
        setFeaturedArticles(featuredData);
        setRecentArticles(recentData);
      } catch (error) {
        console.error('Erreur lors du chargement des articles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const faq = [
    {
      question: "Quelles sont les meilleures pratiques pour optimiser les performances React et Next.js ?",
      answer: "Pour optimiser React et Next.js, utilisez le code splitting avec React.lazy(), implémentez la mémorisation avec useMemo et useCallback, optimisez les images avec next/image, et utilisez le Server-Side Rendering (SSR) ou Static Generation (SSG) selon vos besoins. La virtualisation des listes longues et l'optimisation des bundles Webpack sont également essentielles."
    },
    {
      question: "Comment sécuriser une application Node.js contre les vulnérabilités OWASP ?",
      answer: "Sécurisez votre application Node.js en validant toutes les entrées utilisateur, en utilisant des tokens JWT sécurisés, en implémentant la protection CSRF, en configurant correctement les en-têtes de sécurité (helmet), en utilisant des variables d'environnement pour les secrets, et en effectuant des audits de sécurité réguliers avec npm audit."
    },
    {
      question: "Quelles sont les différences entre TypeScript et JavaScript pour le développement web moderne ?",
      answer: "TypeScript ajoute un système de types statiques à JavaScript, offrant une meilleure IntelliSense, une détection d'erreurs précoce, et une documentation du code plus claire. Il facilite la maintenance des projets complexes, améliore la collaboration d'équipe, et permet une meilleure intégration avec les frameworks modernes comme React, Angular et Vue.js."
    },
    {
      question: "Comment optimiser une base de données MongoDB pour de meilleures performances ?",
      answer: "Optimisez MongoDB en créant des index appropriés sur les champs de requête fréquents, en utilisant la pagination avec limit() et skip(), en implémentant l'agrégation avec des pipelines optimisés, en configurant la réplication et le sharding selon vos besoins, et en surveillant les performances avec MongoDB Compass et les outils de monitoring intégrés."
    },
    {
      question: "Quelles sont les meilleures pratiques de cybersécurité pour les applications web modernes ?",
      answer: "Implémentez l'authentification multi-facteurs (MFA), utilisez HTTPS avec des certificats SSL/TLS valides, protégez contre les injections SQL et XSS, configurez une politique de mots de passe forts, effectuez des tests de pénétration réguliers, maintenez vos dépendances à jour, et utilisez des outils de sécurité comme OWASP ZAP pour l'audit continu."
    },
    {
      question: "Comment déployer une application Next.js sur AWS avec Docker et Kubernetes ?",
      answer: "Déployez Next.js sur AWS en créant une image Docker optimisée avec multi-stage builds, en utilisant Amazon ECR pour stocker vos images, en configurant un cluster EKS pour Kubernetes, en implémentant un load balancer avec ALB, en configurant l'auto-scaling basé sur la charge, et en utilisant CloudWatch pour le monitoring et les alertes."
    },
    {
      question: "Quelles sont les tendances émergentes en intelligence artificielle et machine learning pour 2024 ?",
      answer: "Les tendances IA/ML incluent l'utilisation croissante de modèles de langage comme GPT-4 et Claude, l'IA générative pour la création de contenu, l'apprentissage fédéré pour la protection de la vie privée, l'IA explicable (XAI) pour la transparence, et l'intégration de l'IA dans les outils de développement avec GitHub Copilot et les assistants de codage intelligents."
    },
    {
      question: "Comment optimiser le SEO technique d'un site web développé avec React ou Vue.js ?",
      answer: "Optimisez le SEO en implémentant le Server-Side Rendering (SSR) ou le Static Site Generation (SSG), en utilisant des composants de métadonnées dynamiques, en optimisant les Core Web Vitals (LCP, FID, CLS), en implémentant le lazy loading des images, en créant des sitemaps XML dynamiques, et en utilisant des outils comme Lighthouse pour l'audit continu des performances."
    },
    {
      question: "Quelles sont les meilleures pratiques pour la gestion d'état dans les applications React complexes ?",
      answer: "Utilisez Redux Toolkit ou Zustand pour la gestion d'état globale, implémentez le Context API pour l'état local, utilisez React Query pour la gestion du cache serveur, séparez la logique métier avec des custom hooks, et implémentez une architecture de composants avec une séparation claire des responsabilités. Considérez également l'utilisation de Zustand pour des applications plus légères."
    },
    {
      question: "Comment implémenter l'authentification et l'autorisation dans une API REST avec Node.js et JWT ?",
      answer: "Implémentez l'authentification en utilisant bcrypt pour le hachage des mots de passe, créez des tokens JWT avec une expiration appropriée, implémentez le refresh token pour la sécurité, utilisez des middlewares d'autorisation basés sur les rôles, stockez les tokens de manière sécurisée côté client, et implémentez la déconnexion et l'invalidation des tokens."
    },
    {
      question: "Quelles sont les meilleures pratiques pour l'optimisation des performances frontend avec Webpack et Vite ?",
      answer: "Optimisez avec le tree shaking pour éliminer le code mort, utilisez le code splitting pour diviser les bundles, implémentez le lazy loading des composants, optimisez les images avec des loaders appropriés, utilisez la compression gzip/brotli, et configurez le cache des assets avec des hash de contenu. Vite offre également un HMR ultra-rapide et un build optimisé par défaut."
    },
    {
      question: "Comment sécuriser une application web contre les attaques de type injection et cross-site scripting ?",
      answer: "Protégez contre les injections en utilisant des requêtes préparées et l'ORM Prisma, validez et assainissez toutes les entrées utilisateur, implémentez la protection CSP (Content Security Policy), utilisez des en-têtes de sécurité appropriés, encodez correctement les sorties HTML, et effectuez des tests de sécurité automatisés avec des outils comme OWASP ZAP et SonarQube."
    },
    {
      question: "Quelles sont les meilleures pratiques pour le développement d'applications PWA (Progressive Web Apps) ?",
      answer: "Développez des PWA en implémentant un service worker pour le cache offline, créez un manifeste web avec des icônes appropriées, optimisez les performances avec le lazy loading, implémentez la synchronisation en arrière-plan, utilisez des stratégies de cache appropriées (Cache First, Network First), et testez sur différents appareils et conditions réseau pour garantir une expérience utilisateur optimale."
    },
    {
      question: "Comment optimiser les requêtes GraphQL pour de meilleures performances et une meilleure sécurité ?",
      answer: "Optimisez GraphQL en implémentant la limitation de profondeur des requêtes, en utilisant la pagination avec cursor-based pagination, en implémentant le DataLoader pour éviter le problème N+1, en utilisant des directives pour contrôler l'accès aux données, en implémentant la validation des schémas, et en utilisant des outils de monitoring comme Apollo Studio pour analyser les performances des requêtes."
    },
    {
      question: "Quelles sont les meilleures pratiques pour l'intégration continue et le déploiement (CI/CD) avec GitHub Actions ?",
      answer: "Implémentez un pipeline CI/CD en configurant des workflows GitHub Actions pour les tests automatisés, la construction des images Docker, les tests de sécurité avec Snyk, le déploiement automatique sur différents environnements, l&apos;analyse de la qualité du code avec SonarQube, et la gestion des secrets de manière sécurisée. Utilisez également des environnements protégés et des approbations pour les déploiements en production."
    }
  ];

  return (
    <div className="mx-auto max-w-8xl px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl border bg-gradient-to-b from-secondary to-background min-h-[600px]">
        <div className="absolute inset-0 -z-10 opacity-40 [mask-image:radial-gradient(60%_60%_at_50%_0%,black,transparent)]">
          <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-chart-2 blur-3xl" />
          <div className="absolute -right-24 -bottom-24 h-72 w-72 rounded-full bg-chart-4 blur-3xl" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 place-items-center justify-center md:p-12 gap-8">
          <div className="w-full p-4 text-center md:text-left ">
            <div className="inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1 text-xs text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              Nouveaux articles chaque semaine
            </div>
            <h1 className="mt-4 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
              TechAnswers - Trouvez les réponses à vos questions
            </h1>
            <p className="mt-4 text-pretty text-muted-foreground">
              Découvrez les dernières tendances en développement web, intelligence artificielle, 
              et technologies émergentes. Notre équipe d&apos;experts partage des insights précieux 
              sur React, Next.js, TypeScript, Node.js, MongoDB, et bien plus encore.
            </p>
            <div className="mt-6 flex flex-wrap gap-3 justify-center md:justify-start">
              <Button className="rounded-full">
                <Link href="#articles">Explorer les articles</Link>
              </Button>
              <Button variant="outline" className="rounded-full">
                <Link href="#newsletter">S&apos;abonner</Link>
              </Button>
            </div>
          </div>
          <div className="hidden md:flex items-center justify-center h-[550px] w-1/2 p-8">
            <div className="w-full h-full max-w-xl max-h-xl">
              <Globe className="w-full h-full" />
            </div>
          </div>
          <div className="flex items-center justify-center md:hidden w-full h-full max-w-xl max-h-xl">
              <Globe className="w-full h-full" />
            </div>
        </div>

      </section>



      {/* Featured Articles - Articles à la une */}
      <section id="articles" className="mt-16 max-w-7xl mx-auto">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Articles à la une</h2>
            <p className="text-muted-foreground mt-2">
              Nos meilleurs articles sur le développement web moderne, l&apos;IA, et les technologies émergentes
            </p>
          </div>
          <Link href="/articles" className="text-sm text-muted-foreground hover:text-foreground">
            Voir tous →
          </Link>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {featuredArticles.map((article) => (
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
      </section>

      {/* Recent Articles - Derniers articles */}
      <section className="mt-16 w-full max-w-80/100 mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold tracking-tight mb-4">
            Derniers Articles
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Découvrez nos 15 derniers articles sur les technologies les plus récentes
          </p>
        </div>
        
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="overflow-hidden animate-pulse">
                <div className="aspect-[16/9] bg-muted" />
                <CardContent className="p-4 space-y-2">
                  <div className="h-4 bg-muted rounded w-16" />
                  <div className="h-4 bg-muted rounded w-full" />
                  <div className="h-3 bg-muted rounded w-3/4" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : recentArticles.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {recentArticles.map((article) => (
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
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Aucun article à afficher</p>
          </div>
        )}
      </section>

      {/* Newsletter CTA */}
      <section id="newsletter" className="mt-16 mb-8 overflow-hidden rounded-2xl border bg-gradient-to-br from-background to-secondary max-w-7xl mx-auto">
        <div className="grid gap-8 p-8 md:grid-cols-2 md:p-12">
          <div>
            <h3 className="text-xl font-semibold tracking-tight">Restez à jour</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Abonnez-vous à notre newsletter pour recevoir nos meilleurs articles 
              sur le développement web, l&apos;IA, et les technologies émergentes 
              directement dans votre boîte mail.
            </p>
            <form
              className="mt-6 flex flex-col gap-3 sm:flex-row"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                required
                placeholder="Votre email"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:flex-1"
              />
              <Button className="sm:w-auto">S&apos;abonner</Button>
            </form>
          </div>
          <div className="relative h-40 md:h-auto">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="size-40 rounded-full bg-chart-1/20" />
              <div className="absolute size-24 rounded-full bg-chart-3/20" />
            </div>
          </div>
        </div>
      </section>
      
      {/* Topics Section */}
      <section className="mt-16 max-w-80/100 mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold tracking-tight mb-4">
            FAQ
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Voici les questions les plus fréquentes sur notre blog.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-3 xl:grid-cols-5">
          {faq.map((faq) => (
            <Card key={faq.question} className="hover:shadow-md transition">
              <CardContent className="p-4">
                <h3 className="font-medium mb-2">{faq.question}</h3>
                <p className="text-sm text-muted-foreground">
                  {faq.answer}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* SEO Content */}
      <section className="mt-16 mb-8">
        <div className="prose prose-invert max-w-none">
          <h2 className="text-2xl font-semibold mb-6">TechAnswers - Votre source d&apos;informations technologiques</h2>
          <p className="text-muted-foreground mb-4">
            Bienvenue sur TechAnswers, votre destination privilégiée pour les dernières actualités, 
            tutoriels et analyses approfondies du monde de la technologie. Notre équipe d&apos;experts 
            passionnés partage quotidiennement des contenus de qualité sur le développement web, 
            l&apos;intelligence artificielle, le cloud computing et bien plus encore.
          </p>
          <p className="text-muted-foreground mb-4">
            Que vous soyez développeur débutant cherchant à maîtriser React et Next.js, 
            ou expert confirmé explorant les dernières avancées en machine learning et 
            intelligence artificielle, nos articles vous fourniront les connaissances 
            et compétences nécessaires pour exceller dans votre domaine.
          </p>
          <p className="text-muted-foreground">
            Découvrez nos guides pratiques sur TypeScript, MongoDB, Prisma, Tailwind CSS, 
            et explorez les nouvelles frontières de la technologie avec nos articles sur 
            Three.js, WebGL, et les applications 3D modernes.
          </p>
        </div>
      </section>

      {/* Fallback NoScript pour les bots et navigateurs sans JavaScript */}
      <NoScriptFallback 
        articles={[...featuredArticles, ...recentArticles]}
        title="TechAnswers - Blog technique et articles de développement"
        description="Découvrez nos articles à la une et derniers articles sur le développement web, l&apos;IA, la cybersécurité et les technologies émergentes. Contenu technique de qualité par des experts."
        showPagination={false}
      />
    </div>
  );
}
