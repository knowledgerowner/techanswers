import { Metadata, Viewport } from 'next';
import { prisma } from '@/lib/prisma';

interface CategoryLayoutProps {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CategoryLayoutProps): Promise<Metadata> {
  try {
    const { slug } = await params;
    const category = await prisma.category.findUnique({
      where: { slug },
    });

    if (!category) {
      return {
        title: 'Catégorie non trouvée - TechAnswers',
        description: 'La catégorie demandée n\'existe pas.',
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
          }
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
    console.error('Erreur lors de la génération des métadonnées de catégorie:', error);
    return {
      title: 'Catégorie - TechAnswers',
      description: 'Découvrez nos articles par catégorie.',
    };
  }
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' }
  ],
};

export default function CategoryLayout({
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