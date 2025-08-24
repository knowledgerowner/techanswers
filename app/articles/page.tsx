import { prisma } from "@/lib/prisma";
import NoScriptFallback from "@/components/noscript-fallback";
import ArticlesSearchFilters from "@/components/articles-search-filters";
import ArticlesGrid from "@/components/articles-grid";
import ArticlesPagination from "@/components/articles-pagination";

export default async function ArticlesPage({
  searchParams,
}: {
  searchParams: Promise<{ 
    page?: string; 
    search?: string; 
    category?: string; 
    sort?: string; 
  }>;
}) {
  const ITEMS_PER_PAGE = 12;
  
  // Récupération des paramètres de recherche
  const resolvedSearchParams = await searchParams;
  const page = parseInt(resolvedSearchParams.page || '1');
  const search = resolvedSearchParams.search || '';
  const category = resolvedSearchParams.category || '';
  const sort = resolvedSearchParams.sort || 'date';
  
  // Calcul de l'offset pour la pagination
  const skip = (page - 1) * ITEMS_PER_PAGE;
  
  // Construction des conditions de recherche
  const where: any = { isPublished: true }; // eslint-disable-line @typescript-eslint/no-explicit-any
  
  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { excerpt: { contains: search, mode: 'insensitive' } },
      { content: { contains: search, mode: 'insensitive' } }
    ];
  }
  
  if (category) {
    where.categoryIds = { has: category };
  }
  
  // Récupération des articles et catégories côté serveur
  const [articles, categories, totalCount] = await Promise.all([
    prisma.article.findMany({
      where,
      include: {
        user: {
          select: { username: true }
        }
      },
      orderBy: sort === 'title' 
        ? { title: 'asc' }
        : { createdAt: 'desc' },
      skip,
      take: ITEMS_PER_PAGE
    }),
    prisma.category.findMany({
      select: { id: true, name: true, slug: true }
    }),
    prisma.article.count({ where })
  ]);
  
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
  
  // Conversion des dates en string pour la compatibilité
  const articlesWithStringDates = articles.map(article => ({
    ...article,
    createdAt: article.createdAt.toISOString()
  }));

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
      <ArticlesSearchFilters 
        categories={categories}
        initialSearch={search}
        initialCategory={category}
        initialSort={sort}
      />

      {/* Articles Grid */}
      <ArticlesGrid articles={articlesWithStringDates} />

      {/* Pagination */}
      <ArticlesPagination currentPage={page} totalPages={totalPages} />

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
        articles={articlesWithStringDates}
        title="Articles TechAnswers - Bibliothèque technique complète"
        description="Explorez notre collection d'articles sur le développement web, la cybersécurité, l'IA et les technologies émergentes. Contenu technique validé par des experts."
        showPagination={true}
        currentPage={page}
        totalPages={totalPages}
        searchParams={{
          page: page.toString(),
          ...(search && { search }),
          ...(category && { category }),
          ...(sort && { sort })
        }}
      />
    </div>
  );
} 