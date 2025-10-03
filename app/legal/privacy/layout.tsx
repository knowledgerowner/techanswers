import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Politique de confidentialité | TechAnswers',
  description: 'Politique de confidentialité TechAnswers conforme au RGPD : protection des données personnelles, cookies, droits des utilisateurs et sécurité.',
  keywords: [
    'politique confidentialité',
    'RGPD',
    'protection données',
    'données personnelles',
    'cookies',
    'droits utilisateurs',
    'sécurité',
    'TechAnswers',
    'CNIL',
    'DPO',
    'consentement',
    'vie privée'
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
    title: 'Politique de confidentialité | TechAnswers',
    description: 'Découvrez comment TechAnswers protège vos données personnelles conformément au RGPD. Vos droits, nos engagements.',
    url: 'https://techanswers.fr/legal/privacy',
    siteName: 'TechAnswers',
    locale: 'fr_FR',
    type: 'website',
    images: [
      {
        url: 'https://techanswers.fr/og-privacy.jpg',
        width: 1200,
        height: 630,
        alt: 'TechAnswers - Protection des données personnelles',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Politique de confidentialité | TechAnswers',
    description: 'Comment TechAnswers protège vos données personnelles conformément au RGPD. Transparence et respect de votre vie privée.',
    site: '@TechAnswers',
    creator: '@TechAnswers',
    images: ['https://techanswers.fr/og-privacy.jpg'],
  },
  alternates: {
    canonical: 'https://techanswers.fr/legal/privacy',
  },
  category: 'Legal',
  other: {
    'privacy-policy': 'https://techanswers.fr/legal/privacy',
  },
};

interface PrivacyLayoutProps {
  children: React.ReactNode;
}

export default function PrivacyLayout({ children }: PrivacyLayoutProps) {
  return (
    <>
      {children}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'PrivacyPolicy',
            name: 'Politique de confidentialité',
            description: 'Politique de confidentialité de TechAnswers conforme au RGPD pour la protection des données personnelles.',
            url: 'https://techanswers.fr/legal/privacy',
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
                  email: 'contact@techanswers.fr',
                },
                {
                  '@type': 'ContactPoint',
                  email: 'dpo@techanswers.fr',
                  contactType: 'data protection officer',
                  name: 'Délégué à la Protection des Données',
                },
              ],
            },
            about: {
              '@type': 'Thing',
              name: 'Protection des données personnelles',
              description: 'Traitement des données personnelles conformément au RGPD',
            },
            mainEntity: {
              '@type': 'FAQPage',
              mainEntity: [
                {
                  '@type': 'Question',
                  name: 'Quelles données collectons-nous ?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Nous collectons les données d\'inscription (nom d\'utilisateur, email), les données de profil optionnelles, les données d\'utilisation et les données de paiement.'
                  }
                },
                {
                  '@type': 'Question',
                  name: 'Comment exercer mes droits RGPD ?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Vous pouvez exercer vos droits (accès, rectification, effacement, etc.) en contactant notre DPO à dpo@techanswers.fr'
                  }
                },
                {
                  '@type': 'Question',
                  name: 'Combien de temps conservez-vous mes données ?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Les durées varient selon le type de données : compte actif jusqu\'à suppression, données supprimées 30 jours, facturation 10 ans.'
                  }
                }
              ]
            }
          }),
        }}
      />
    </>
  );
}
