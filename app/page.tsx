"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";
import { useEffect, useState } from "react";
import { Scene } from "@/components/3d/scene";
import { Planet } from "@/components/3d/planet";
import { RotatingSphere } from "@/components/3d/rotating-sphere";
import { TechGrid } from "@/components/3d/tech-grid";
import { Carousel } from "@/components/ui/carousel";

interface Article {
  id: string;
  title: string;
  excerpt: string | null;
  slug: string;
  imageUrl: string | null;
  isMarketing: boolean;
  categoryIds: string[];
  createdAt: Date;
  admin: {
    username: string;
  };
}

export default function Home() {
  const [featuredArticles, setFeaturedArticles] = useState<Article[]>([]);
  const [recentArticles, setRecentArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

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
      question: "Comment créer un article ?",
      answer: "Pour créer un article, vous devez vous connecter à votre compte et cliquer sur le bouton 'Créer un article' en haut de la page. Vous pourrez ensuite ajouter un titre, un contenu, une image et des méta-données."
    },
    {
      question: "Comment ajouter une image ?",
      answer: "Pour ajouter une image, vous devez cliquer sur le bouton 'Ajouter une image' en haut de la page. Vous pourrez ensuite sélectionner une image depuis votre ordinateur."
    },
    {
      question: "Comment ajouter un lien ?",
      answer: "Pour ajouter un lien, vous devez cliquer sur le bouton 'Ajouter un lien' en haut de la page. Vous pourrez ensuite entrer l'URL du lien et un texte optionnel."
    },
    {
      question: "Comment ajouter un tableau ?",
      answer: "Pour ajouter un tableau, vous devez cliquer sur le bouton 'Ajouter un tableau' en haut de la page. Vous pourrez ensuite entrer les données du tableau."
    },
    {
      question: "Comment ajouter un code ?",
      answer: "Pour ajouter un code, vous devez cliquer sur le bouton 'Ajouter un code' en haut de la page. Vous pourrez ensuite entrer le code et un langage." 
    },
    {
      question: "Comment ajouter un audio ?",
      answer: "Pour ajouter un audio, vous devez cliquer sur le bouton 'Ajouter un audio' en haut de la page. Vous pourrez ensuite entrer l'URL de l'audio."
    },
    {
      question: "Comment ajouter un formulaire ?",
      answer: "Pour ajouter un formulaire, vous devez cliquer sur le bouton 'Ajouter un formulaire' en haut de la page. Vous pourrez ensuite entrer les champs du formulaire."
    }
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl border bg-gradient-to-b from-secondary to-background mt-8">
        <div className="absolute inset-0 -z-10 opacity-40 [mask-image:radial-gradient(60%_60%_at_50%_0%,black,transparent)]">
          <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-chart-2 blur-3xl" />
          <div className="absolute -right-24 -bottom-24 h-72 w-72 rounded-full bg-chart-4 blur-3xl" />
        </div>
        <div className="grid gap-8 p-8 md:grid-cols-2 md:items-center md:p-12">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1 text-xs text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              Nouveaux articles chaque semaine
            </div>
            <h1 className="mt-4 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
              Le blog tech ultra moderne
            </h1>
            <p className="mt-4 text-pretty text-muted-foreground">
              Découvrez les dernières tendances en développement web, intelligence artificielle, 
              et technologies émergentes. Notre équipe d'experts partage des insights précieux 
              sur React, Next.js, TypeScript, Node.js, MongoDB, et bien plus encore.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button className="rounded-full">
                <Link href="#articles">Explorer les articles</Link>
              </Button>
              <Button variant="outline" className="rounded-full">
                <Link href="#newsletter">S'abonner</Link>
              </Button>
            </div>
          </div>
          <div className="relative h-64 md:h-80">
            <Scene className="h-full w-full">
              <Planet />
            </Scene>
          </div>
        </div>
      </section>

      {/* Recent Articles Carousel */}
      <section className="mt-16">
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
              <div key={i} className="h-full overflow-hidden rounded-xl border bg-card animate-pulse">
                <div className="aspect-[16/9] w-full bg-muted" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-muted rounded w-16" />
                  <div className="h-4 bg-muted rounded w-full" />
                  <div className="h-3 bg-muted rounded w-3/4" />
                </div>
              </div>
            ))}
          </div>
        ) : recentArticles.length > 0 ? (
          <div className="h-96">
            <Carousel autoPlay={true} interval={4000}>
              {recentArticles.map((article) => (
                <div key={article.id} className="h-full p-4">
                  <Link href={`/articles/${article.slug}`} className="group block h-full">
                    <article className="h-full overflow-hidden rounded-xl border bg-card transition hover:shadow-md">
                      <div className="aspect-[16/9] w-full bg-muted flex items-center justify-center">
                        {article.imageUrl ? (
                          <Image 
                            src={article.imageUrl} 
                            alt={article.title}
                            width={400}
                            height={225}
                            className="w-full h-full object-cover transition group-hover:scale-105" 
                          />
                        ) : (
                          <div className="flex items-center justify-center text-muted-foreground">
                            <Image src="/window.svg" alt="" width={60} height={60} className="opacity-50" />
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge>
                            {article.isMarketing ? "Marketing" : "Article"}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            par {article.admin.username}
                          </span>
                        </div>
                        <h3 className="text-lg font-semibold leading-tight group-hover:underline mb-2">
                          {article.title}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {article.excerpt || "Aucun résumé disponible"}
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {new Date(article.createdAt).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </article>
                  </Link>
                </div>
              ))}
            </Carousel>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Aucun article à afficher</p>
          </div>
        )}
      </section>

      {/* Featured Articles */}
      <section id="articles" className="mt-16">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Articles à la une</h2>
            <p className="text-muted-foreground mt-2">
              Nos meilleurs articles sur le développement web moderne, l'IA, et les technologies émergentes
            </p>
          </div>
          <Link href="/articles" className="text-sm text-muted-foreground hover:text-foreground">
            Voir tous →
          </Link>
        </div>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-full overflow-hidden rounded-xl border bg-card animate-pulse">
                <div className="aspect-[16/9] w-full bg-muted" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-muted rounded w-16" />
                  <div className="h-4 bg-muted rounded w-full" />
                  <div className="h-3 bg-muted rounded w-3/4" />
                </div>
              </div>
            ))
          ) : featuredArticles.length > 0 ? (
            featuredArticles.map((article) => (
              <Link key={article.id} href={`/articles/${article.slug}`} className="group">
                <article className="h-full overflow-hidden rounded-xl border bg-card transition hover:shadow-md">
                  <div className="aspect-[16/9] w-full bg-muted flex items-center justify-center">
                    {article.imageUrl ? (
                      <Image 
                        src={article.imageUrl} 
                        alt={article.title}
                        width={400}
                        height={225}
                        className="w-full h-full object-cover transition group-hover:scale-105" 
                      />
                    ) : (
                      <div className="flex items-center justify-center text-muted-foreground">
                        <Image src="/window.svg" alt="" width={60} height={60} className="opacity-50" />
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <Badge className="mb-2">
                      {article.isMarketing ? "Marketing" : "Article"}
                    </Badge>
                    <h3 className="text-base font-semibold leading-tight group-hover:underline">
                      {article.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                      {article.excerpt || "Aucun résumé disponible"}
                    </p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {new Date(article.createdAt).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </article>
              </Link>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">Aucun article à afficher</p>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section id="newsletter" className="mt-16 mb-8 overflow-hidden rounded-2xl border bg-gradient-to-br from-background to-secondary">
        <div className="grid gap-8 p-8 md:grid-cols-2 md:p-12">
          <div>
            <h3 className="text-xl font-semibold tracking-tight">Restez à jour</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Abonnez-vous à notre newsletter pour recevoir nos meilleurs articles 
              sur le développement web, l'IA, et les technologies émergentes 
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
              <Button className="sm:w-auto">S'abonner</Button>
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
      <section className="mt-16">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold tracking-tight mb-4">
            FAQ
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Voici les questions les plus fréquentes sur notre blog.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {faq.map((faq) => (
            <div key={faq.question} className="p-4 rounded-xl border bg-card hover:shadow-md transition">
              <h3 className="font-medium mb-2">{faq.question}</h3>
              <p className="text-sm text-muted-foreground">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* SEO Content */}
      <section className="mt-16 mb-8">
        <div className="prose prose-invert max-w-none">
          <h2 className="text-2xl font-semibold mb-6">TechAnswers - Votre source d'informations technologiques</h2>
          <p className="text-muted-foreground mb-4">
            Bienvenue sur TechAnswers, votre destination privilégiée pour les dernières actualités, 
            tutoriels et analyses approfondies du monde de la technologie. Notre équipe d'experts 
            passionnés partage quotidiennement des contenus de qualité sur le développement web, 
            l'intelligence artificielle, le cloud computing et bien plus encore.
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
    </div>
  );
}
