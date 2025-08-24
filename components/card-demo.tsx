'use client';

import ArticleCard from './article-card';
import PremiumArticleCard from './premium-article-card';

// Données de test
const testArticle = {
  id: '1',
  title: 'Comment optimiser React avec Next.js 15 et TypeScript',
  excerpt: 'Découvrez les meilleures pratiques pour optimiser vos applications React avec Next.js 15, TypeScript et les dernières fonctionnalités du framework.',
  slug: 'optimiser-react-nextjs-typescript',
  imageUrl: null,
  createdAt: '2024-01-15T10:00:00Z',
  user: {
    username: 'TechExpert'
  }
};

const testPremiumArticle = {
  id: '2',
  title: 'Guide complet de cybersécurité pour développeurs web',
  excerpt: 'Un guide approfondi couvrant l\'ensemble des aspects de la cybersécurité moderne, des bonnes pratiques OWASP aux techniques de pentesting avancées.',
  slug: 'guide-cybersecurite-developpeurs',
  imageUrl: undefined,
  premiumPrice: 29.99,
  isPremium: true
};

export default function CardDemo() {
  return (
    <div className="p-8 space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Démonstration des Cartes</h2>
        <p className="text-muted-foreground mb-6">
          Test des différents types de cartes d&apos;articles avec leurs designs respectifs.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Carte d'article normale */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Article Normal</h3>
          <div className="h-96">
            <ArticleCard article={testArticle} />
          </div>
        </div>

        {/* Carte d'article premium */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Article Premium (Holographique)</h3>
          <div className="h-[500px]">
            <PremiumArticleCard article={testPremiumArticle} hasPurchased={false} />
          </div>
        </div>
      </div>

      <div className="mt-12 p-6 bg-muted rounded-lg">
        <h3 className="text-lg font-semibold mb-3">Fonctionnalités des Cartes</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <h4 className="font-medium text-green-600 mb-2">Article Normal</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Design moderne avec gradients</li>
              <li>• Effets de survol élégants</li>
              <li>• Animations fluides</li>
              <li>• Indicateurs de lecture</li>
              <li>• Responsive design</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-purple-600 mb-2">Article Premium</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Style holographique 3D</li>
              <li>• Effets de lumière dynamiques</li>
              <li>• Animation de tilt au survol</li>
              <li>• Design premium distinctif</li>
              <li>• Intégration Stripe</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 