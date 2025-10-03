import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mentions légales | TechAnswers',
  description: 'Mentions légales de TechAnswers : informations sur la société, directeur de publication, hébergement et conditions d\'utilisation du site.',
  keywords: [
    'mentions légales',
    'TechAnswers',
    'informations légales',
    'SIRET',
    'RCS',
    'société',
    'directeur publication',
    'hébergement',
    'responsabilité',
    'propriété intellectuelle'
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
    title: 'Mentions légales | TechAnswers',
    description: 'Consultez les mentions légales de TechAnswers : informations sur la société, responsabilités et conditions d\'utilisation.',
    url: 'https://techanswers.fr/legal/terms',
    siteName: 'TechAnswers',
    locale: 'fr_FR',
    type: 'website',
    images: [
      {
        url: 'https://techanswers.fr/og-legal.jpg',
        width: 1200,
        height: 630,
        alt: 'TechAnswers - Mentions légales',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mentions légales | TechAnswers',
    description: 'Consultez les mentions légales de TechAnswers : informations légales et conditions d\'utilisation.',
    site: '@TechAnswers',
    creator: '@TechAnswers',
    images: ['https://techanswers.fr/og-legal.jpg'],
  },
  alternates: {
    canonical: 'https://techanswers.fr/legal/terms',
  },
  category: 'Legal',
};

interface TermsLayoutProps {
  children: React.ReactNode;
}

export default function TermsLayout({ children }: TermsLayoutProps) {
  return (
    <>
      {children}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'LegalDocument',
            name: 'Mentions légales',
            description: 'Mentions légales de TechAnswers : informations sur la société, directeur de publication, hébergement et conditions d\'utilisation.',
            url: 'https://techanswers.fr/legal/terms',
            dateModified: new Date().toISOString(),
            publisher: {
              '@type': 'Organization',
              name: 'TechAnswers SAS',
              url: 'https://techanswers.fr',
              logo: {
                '@type': 'ImageObject',
                url: 'https://techanswers.fr/logo.png',
              },
              contactPoint: {
                '@type': 'ContactPoint',
                telephone: '+33-1-23-45-67-89',
                contactType: 'legal support',
                email: 'legal@techanswers.fr',
              },
            },
            about: {
              '@type': 'Organization',
              name: 'TechAnswers SAS',
              legalName: 'TechAnswers SAS',
              foundingDate: '2024',
              address: {
                '@type': 'PostalAddress',
                streetAddress: '123 Avenue des Champs-Élysées',
                addressLocality: 'Paris',
                postalCode: '75008',
                addressCountry: 'FR',
              },
              email: 'contact@techanswers.fr',
              telephone: '+33-1-23-45-67-89',
            },
          }),
        }}
      />
    </>
  );
}
