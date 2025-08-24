import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL('https://www.techanswers.blog'),
  title: "TechAnswers - À propos",
  description: "Découvrez TechAnswers, notre mission et notre équipe ainsi que nos partenaires qui travaillent en étroite collaboration avec nous.",
  keywords: ["a propos de techanswers", "solutions tech", "probleme linux", "probleme windows", "probleme mac", "probleme android", "probleme ios", "probleme web", "probleme mobile", "probleme desktop", "probleme server", "probleme network", "probleme securite", "probleme performance", "probleme maintenance", "probleme support", "probleme formation", "probleme conseil", "probleme audit", "probleme conception", "probleme programmation", "probleme conseil en informatique"],
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
    url: "https://www.techanswers.blog/about",
    title: "TechAnswers - À propos",
    description: "TechAnswers est un site de questions et réponses pour trouver les réponses à vos questions. Nous offrons des articles techniques, des tutoriels, des conseils et des astuces pour aider vous à devenir un expert en technologie.",
    siteName: "TechAnswers",
    images: [
      {
        url: "/Logo.png",
        width: 1200,
        height: 630,
        alt: "TechAnswers - À propos",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TechAnswers - À propos",
    description: "TechAnswers est un site de questions et réponses pour trouver les réponses à vos questions. Nous offrons des articles techniques, des tutoriels, des conseils et des astuces pour aider vous à devenir un expert en technologie.",
    images: ["/Logo.png"],
  },
  alternates: {
    canonical: "https://www.techanswers.blog/about",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (  
    <main className="pt-24">{children}</main>
  );
}
