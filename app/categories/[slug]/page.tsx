import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  ArrowLeft as ArrowLeftIcon,
} from 'lucide-react';
import CategoryArticlesGridWrapper from '@/components/category-articles-grid-wrapper';

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

// Fonction pour générer les métadonnées dynamiques
export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  try {
    const { slug } = await params;
    const category = await prisma.category.findUnique({
      where: { slug },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        seoTitle: true,
        seoDesc: true,
        seoKeywords: true,
        seoImg: true,
      },
    });

    if (!category) {
      return {
        title: 'Catégorie non trouvée',
        description: 'La catégorie que vous recherchez n\'existe pas.',
      };
    }

    return {
      title: category.seoTitle || `${category.name} - Articles`,
      description: category.seoDesc || category.description || `Découvrez tous nos articles sur ${category.name}`,
      keywords: category.seoKeywords,
      openGraph: {
        title: category.seoTitle || `${category.name} - Articles`,
        description: category.seoDesc || category.description || `Découvrez tous nos articles sur ${category.name}`,
        type: 'website',
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/categories/${category.slug}`,
        images: category.seoImg ? [
          {
            url: category.seoImg,
            width: 1200,
            height: 630,
            alt: category.seoTitle || category.name,
          },
        ] : undefined,
      },
      twitter: {
        card: 'summary_large_image',
        title: category.seoTitle || `${category.name} - Articles`,
        description: category.seoDesc || category.description || `Découvrez tous nos articles sur ${category.name}`,
        images: category.seoImg ? [category.seoImg] : undefined,
      },
    };
  } catch (error) {
    console.error('Erreur lors de la génération des métadonnées:', error);
    return {
      title: 'Erreur',
      description: 'Une erreur est survenue lors du chargement de la catégorie.',
    };
  }
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  try {
    const { slug } = await params;
    const { page } = await searchParams;
    const pageNumber = parseInt(page || '1');
    const limit = 9;
    const skip = (pageNumber - 1) * limit;

    // Récupérer la catégorie
    const category = await prisma.category.findUnique({
      where: { slug },
    });

    if (!category) {
      notFound();
    }

    // Récupérer toutes les catégories pour le maillage interne
    const allCategories = await prisma.category.findMany({
      where: {
        id: { not: category.id }
      },
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
      },
      take: 4,
    });

    // Compter les articles pour chaque catégorie
    const relatedCategoriesWithCount = await Promise.all(
      allCategories.map(async (cat) => {
        const articleCount = await prisma.article.count({
          where: {
            isPublished: true,
            categoryIds: { has: cat.id }
          }
        });
        return {
          ...cat,
          articleCount
        };
      })
    );

    // Récupérer les articles de cette catégorie
    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where: {
          isPublished: true,
          categoryIds: { has: category.id },
        },
        include: {
          user: true,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.article.count({
        where: {
          isPublished: true,
          categoryIds: { has: category.id },
        },
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return (
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/articles">
            <Button variant="outline" className="mb-6">
              <ArrowLeftIcon className="mr-2 h-4 w-4" />
              Retour
            </Button>
          </Link>
          
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">
              {category.name}
            </h1>
            {category.description && (
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-6">
                {category.description}
              </p>
            )}
            <Badge variant="outline" className="text-lg px-4 py-2">
              {total} article{total > 1 ? 's' : ''}
            </Badge>
          </div>
        </div>

        {/* Articles Grid */}
        {articles.length > 0 ? (
          <CategoryArticlesGridWrapper
            articles={articles}
            totalPages={totalPages}
            currentPage={pageNumber}
            categorySlug={slug}
          />
        ) : (
          <Card>
            <CardContent className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 bg-muted rounded-full flex items-center justify-center">
                <span className="text-3xl">📝</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Aucun article dans cette catégorie
              </h3>
              <p className="text-muted-foreground mb-6">
                Aucun article n&apos;est disponible dans la catégorie &quot;{category.name}&quot; pour le moment.
              </p>
              <Link href="/articles">
                <Button variant="outline">
                  Voir tous les articles
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Section de maillage interne */}
        {relatedCategoriesWithCount.length > 0 && (
          <section className="mt-16 mb-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Découvrez nos autres catégories</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Explorez d&apos;autres domaines techniques pour enrichir vos connaissances et 
                découvrir de nouvelles perspectives technologiques.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {relatedCategoriesWithCount.map((cat) => (
                <Link key={cat.id} href={`/categories/${cat.slug}`}>
                  <Card className="h-full transition-all duration-200 hover:shadow-lg hover:-translate-y-1 group">
                    <CardContent className="p-6">
                      <div className="text-center">
                        <div className="w-12 h-12 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                          <span className="text-2xl font-bold text-primary">
                            {cat.name.charAt(0)}
                          </span>
                        </div>
                        <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                          {cat.name}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {cat.description || "Découvrez nos articles spécialisés"}
                        </p>
                        <Badge variant="outline" className="text-xs">
                          {cat.articleCount} article{cat.articleCount > 1 ? 's' : ''}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            <div className="text-center mt-8">
              <Link href="/categories">
                <Button variant="outline" size="lg">
                  Voir toutes les catégories
                </Button>
              </Link>
            </div>
          </section>
        )}
      </div>
    );
  } catch (error) {
    console.error('Erreur lors du chargement de la catégorie:', error);
    notFound();
  }
} 