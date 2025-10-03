import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Conditions Générales de Vente | TechAnswers',
  description: 'Conditions générales de vente TechAnswers pour les articles premium : prix, paiement, livraison numérique, garanties et droits des consommateurs.',
  keywords: [
    'conditions générales vente',
    'CGV',
    'articles premium',
    'contenu numérique',
    'paiement sécurisé',
    'Stripe',
    'livraison numérique',
    'droit rétractation',
    'garanties',
    'TechAnswers',
    'propriété intellectuelle',
    'support client'
  ],
  authors: [{ name: 'TechAnswers' }],
  creator: 'TechAnswers',
  publisher: 'TechAnswers SAS',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'Conditions Générales de Vente | TechAnswers',
    description: 'Découvrez les conditions de vente des articles premium TechAnswers : paiement sécurisé, livraison instantanée et garanties.',
    url: 'https://techanswers.fr/legal/cgv',
    siteName: 'TechAnswers',
    locale: 'fr_FR',
    type: 'website',
    images: [
      {
        url: 'https://techanswers.fr/og-cgv.jpg',
        width: 1200,
        height: 630,
        alt: 'TechAnswers - Conditions générales de vente',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Conditions Générales de Vente | TechAnswers',
    description: 'Conditions de vente TechAnswers : articles premium, paiement sécurisé Stripe, livraison numérique instantanée.',
    site: '@TechAnswers',
    creator: '@TechAnswers',
    images: ['https://techanswers.fr/og-cgv.jpg'],
  },
  alternates: {
    canonical: 'https://techanswers.fr/legal/cgv',
  },
  category: 'Legal',
  other: {
    'terms-of-service': 'https://techanswers.fr/legal/cgv',
  },
};

interface CGVLayoutProps {
  children: React.ReactNode;
}

export default function CGVLayout({ children }: CGVLayoutProps) {
  return (
    <>
      {children}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'TermsOfService',
            name: 'Conditions Générales de Vente',
            description: 'Conditions générales de vente de TechAnswers pour les articles premium et contenus numériques.',
            url: 'https://techanswers.fr/legal/cgv',
            dateModified: new Date().toISOString(),
            datePublished: '2024-01-01',
            publisher: {
              '@type': 'Organization',
              name: 'TechAnswers SAS',
              url: 'https://techanswers.fr',
              logo: {
                '@type': 'ImageObject',
                url: 'https://techanswers.fr/logo.png',
              },
              contactPoint: [
                {
                  '@type': 'ContactPoint',
                  telephone: '+33-1-23-45-67-89',
                  contactType: 'customer service',
                  email: 'support@techanswers.fr',
                  hoursAvailable: {
                    '@type': 'OpeningHoursSpecification',
                    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
                    opens: '09:00',
                    closes: '18:00',
                  },
                },
                {
                  '@type': 'ContactPoint',
                  email: 'legal@techanswers.fr',
                  contactType: 'legal support',
                },
              ],
            },
            about: {
              '@type': 'Service',
              name: 'Articles Premium TechAnswers',
              description: 'Vente de contenus numériques techniques premium',
              provider: {
                '@type': 'Organization',
                name: 'TechAnswers SAS',
              },
            },
            mainEntity: {
              '@type': 'FAQPage',
              mainEntity: [
                {
                  '@type': 'Question',
                  name: 'Comment puis-je payer mes achats ?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Nous acceptons les paiements par carte bancaire (Visa, Mastercard, American Express) via notre partenaire sécurisé Stripe.'
                  }
                },
                {
                  '@type': 'Question',
                  name: 'Puis-je être remboursé ?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Le droit de rétractation ne s\'applique pas aux contenus numériques dont l\'exécution a commencé après votre accord exprès.'
                  }
                },
                {
                  '@type': 'Question',
                  name: 'Quand ai-je accès au contenu acheté ?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'L\'accès au contenu premium est immédiat après validation du paiement, disponible dans votre espace personnel.'
                  }
                },
                {
                  '@type': 'Question',
                  name: 'Puis-je partager le contenu acheté ?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Non, le contenu est protégé par le droit d\'auteur et réservé à un usage personnel uniquement.'
                  }
                }
              ]
            },
            offers: {
              '@type': 'AggregateOffer',
              priceCurrency: 'EUR',
              lowPrice: '2.99',
              highPrice: '49.99',
              offerCount: '100+',
              availability: 'https://schema.org/InStock',
              itemCondition: 'https://schema.org/NewCondition',
            }
          }),
        }}
      />
    </>
  );
}
