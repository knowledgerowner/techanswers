import { Metadata, Viewport } from 'next';
import { prisma } from '@/lib/prisma';

interface ArticleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}

// Fonction pour générer les métadonnées dynamiques
export async function generateMetadata({ params }: ArticleLayoutProps): Promise<Metadata> {
  try {
    const { slug } = await params;
    const article = await prisma.article.findUnique({
      where: { slug },
      include: {
        user: true,
      },
    });

    if (!article) {
      return {
        title: 'Article non trouvé',
        description: 'L\'article que vous recherchez n\'existe pas.',
      };
    }

    return {
      title: article.seoTitle || article.title,
      description: article.seoDesc || article.excerpt || undefined,
      keywords: article.seoKeywords || undefined,
      openGraph: {
        title: article.seoTitle || article.title,
        description: article.seoDesc || article.excerpt || undefined,
        type: 'article',
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/articles/${article.slug}`,
        images: article.seoImg || article.imageUrl ? [
          {
            url: article.seoImg || article.imageUrl!,
            width: 1200,
            height: 630,
            alt: article.seoTitle || article.title,
          },
        ] : undefined,
        authors: article.user ? [article.user.username] : undefined,
        publishedTime: article.createdAt?.toISOString(),
        modifiedTime: article.updatedAt?.toISOString(),
        // Ajouter les mots-clés dans Open Graph
        ...(article.seoKeywords && { keywords: article.seoKeywords.split(', ').filter(k => k.trim()) }),
      },
      twitter: {
        card: 'summary_large_image',
        title: article.seoTitle || article.title,
        description: article.seoDesc || article.excerpt || undefined,
        images: article.seoImg || article.imageUrl ? [article.seoImg || article.imageUrl!] : undefined,
        // Ajouter les mots-clés dans Twitter
        ...(article.seoKeywords && { keywords: article.seoKeywords.split(', ').filter(k => k.trim()) }),
      },
      alternates: {
        canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/articles/${article.slug}`,
      },
    };
  } catch (error) {
    console.error('Erreur lors de la génération des métadonnées:', error);
    return {
      title: 'Erreur',
      description: 'Une erreur est survenue lors du chargement de l\'article.',
    };
  }
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
};

export default function ArticleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex-1">
      {children}
    </main>
  );
} 