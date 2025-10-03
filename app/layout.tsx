import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { AnalyticsTracker } from "@/components/analytics-tracker";
import PaymentStatusWrapper from "@/components/payment-status-wrapper";
import { NotificationProvider } from "@/lib/contexts/NotificationContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://www.techanswers.blog'),
  title: "TechAnswers - Votre Blog Tech",
  description: "TechAnswers est un site de questions et réponses pour trouver les réponses à vos questions. Nous offrons des articles techniques, des tutoriels, des conseils et des astuces pour aider vous à devenir un expert en technologie.",
  keywords: ["questions", "réponses", "technologie", "tutoriels", "conseils", "astuces", "expert", "technologie", "informatique", "cybersécurité", "transformation numérique", "audit sécurité", "conception web", "programmation", "conseil en informatique"],
  authors: [{ name: "TechAnswers", url: "https://www.techanswers.blog" }],
  creator: "TechAnswers",
  publisher: "TechAnswers",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://www.techanswers.blog",
    title: "TechAnswers - Votre Blog Tech",
    description: "TechAnswers est un site de questions et réponses pour trouver les réponses à vos questions. Nous offrons des articles techniques, des tutoriels, des conseils et des astuces pour aider vous à devenir un expert en technologie.",
    siteName: "TechAnswers",
    images: [
      {
        url: "/Logo.png",
        width: 1200,
        height: 630,
        alt: "TechAnswers - Votre Blog Tech",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TechAnswers - Votre Blog Tech",
    description: "TechAnswers est un site de questions et réponses pour trouver les réponses à vos questions. Nous offrons des articles techniques, des tutoriels, des conseils et des astuces pour aider vous à devenir un expert en technologie.",
    images: ["/Logo.png"],
  },
  alternates: {
    canonical: "https://www.techanswers.blog",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Organization",
                "name": "TechAnswers",
                "url": "https://www.techanswers.blog",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://www.techanswers.blog/Logo.png",
                  "width": 512,
                  "height": 512
                },
                "image": "https://www.techanswers.blog/Logo.png",
                "description": "TechAnswers est un site de questions et réponses pour trouver les réponses à vos questions. Nous offrons des articles techniques, des tutoriels, des conseils et des astuces pour aider vous à devenir un expert en technologie.",
                "address": {
                  "@type": "PostalAddress",
                  "addressLocality": "Bordeaux",
                  "addressRegion": "Nouvelle-Aquitaine",
                  "addressCountry": "FR"
                },
                "contactPoint": {
                  "@type": "ContactPoint",
                  "telephone": "+33-6-43-32-34-12",
                  "contactType": "customer service",
                  "availableLanguage": "French"
                },
                "sameAs": [
                  "https://www.techanswers.blog"
                ],
                "areaServed": {
                  "@type": "Place",
                  "name": "Bordeaux, Arcachon, Pessac, Mérignac, Marcheprime, Biganos, Gironde, France, La Teste-de-Buch, Gujan-Mestras, Le Teich, Cestas"
                },
                "foundingDate": "2024",
                "founder": {
                  "@type": "Person",
                  "name": "TechAnswers Team"
                },
                "hasOfferCatalog": {
                  "@type": "OfferCatalog",
                  "name": "Services TechAnswers",
                  "itemListElement": [
                    {
                      "@type": "Offer",
                      "itemOffered": {
                        "@type": "Articles",
                        "name": "Articles",
                        "description": "Trouvez les réponses à vos questions sur TechAnswers",
                        "url": "https://www.techanswers.blog/articles",
                        "category": "Articles"
                      }
                    },
                    {
                      "@type": "Offer",
                      "itemOffered": {
                        "@type": "A propos",
                        "name": "A propos",
                        "description": "Découvrez TechAnswers, notre mission et notre équipe",
                        "url": "https://www.techanswers.blog/about",
                        "category": "A propos"
                      }
                    },
                    {
                      "@type": "Offer",
                      "itemOffered": {
                        "@type": "Contact",
                        "name": "Contact",
                        "description": "Contactez-nous pour toute question ou demande de service",
                        "url": "https://www.techanswers.blog/contact",
                        "category": "Contact"
                      }
                    },
                    {
                      "@type": "Offer",
                      "itemOffered": {
                        "@type": "Partenaires",
                        "name": "Partenaires",
                        "description": "Découvrez nos partenaires et collaborateurs",
                        "url": "https://www.techanswers.blog/partners",
                        "category": "Partenaires"
                      }
                    }
                  ]
                }
              })
            }}
          />

          <script src="https://analytics.ahrefs.com/analytics.js" data-key="79ndNsuY8hQvaVJ9s0iYZg" async></script>

          {/* JSON-LD pour le site web */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "WebSite",
                "name": "TechAnswers",
                "url": "https://www.techanswers.blog",
                "description": "TechAnswers est un site de questions et réponses pour trouver les réponses à vos questions. Nous offrons des articles techniques, des tutoriels, des conseils et des astuces pour aider vous à devenir un expert en technologie.",
                "potentialAction": {
                  "@type": "SearchAction",
                  "target": "https://www.techanswers.blog/search?q={search_term_string}",
                  "query-input": "required name=search_term_string"
                },
                "publisher": {
                  "@type": "Organization",
                  "name": "TechAnswers"
                }
              })
            }}
          />

          {/* JSON-LD pour les liens de navigation */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "ItemList",
                "name": "Services TechAnswers",
                "description": "Liste des services proposés par TechAnswers",
                "itemListElement": [
                  {
                    "@type": "ListItem",
                    "position": 1,
                    "item": {
                      "@type": "WebPage",
                      "name": "Articles",
                      "url": "https://www.techanswers.blog/articles",
                      "description": "Trouvez les réponses à vos questions sur TechAnswers"
                    }
                  },
                  {
                    "@type": "ListItem",
                    "position": 2,
                    "item": {
                      "@type": "WebPage",
                      "name": "A propos",
                      "url": "https://www.techanswers.blog/about",
                      "description": "Découvrez TechAnswers, notre mission et notre équipe"
                    }
                  },
                  {
                    "@type": "ListItem",
                    "position": 3,
                    "item": {
                      "@type": "WebPage",
                      "name": "Contact",
                      "url": "https://www.techanswers.blog/contact",
                      "description": "Contactez-nous pour toute question ou demande de service"
                    }
                  },
                  {
                    "@type": "ListItem",
                    "position": 4,
                    "item": {
                      "@type": "WebPage",
                      "name": "Partenaires",
                      "url": "https://www.techanswers.blog/partners",
                      "description": "Découvrez nos partenaires et collaborateurs"
                    }
                  }
                ]
              })
            }}
          />
        </head>
      <body className={inter.className + " dark"}>
        <NotificationProvider>
          <AnalyticsTracker />
            <Navigation />
              <main className="pt-24">{children}</main>
            <Footer />
          <PaymentStatusWrapper />
        </NotificationProvider>
      </body>
    </html>
  );
}
