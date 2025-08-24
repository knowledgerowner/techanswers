import React from 'react';
import WelcomeTemplate from './welcome';
import ArticlePublishedTemplate from './article-published';
import CommentReplyTemplate from './comment-reply';
import SecurityAlertTemplate from './security-alert';

export default function EmailTemplatesDemo() {
  return (
    <div className="space-y-8 p-6">
      <h1 className="text-3xl font-bold text-center mb-8">
        🎨 Démonstration des Templates d&apos;Email
      </h1>

      {/* Template Welcome */}
      <div className="border rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-4">1. Template de Bienvenue</h2>
        <div className="border rounded overflow-hidden">
          <WelcomeTemplate
            username="John Doe"
            email="john.doe@example.com"
            activationLink="https://techanswers.com/activate/abc123"
          />
        </div>
      </div>

      {/* Template Article Published */}
      <div className="border rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-4">2. Template Article Publié</h2>
        <div className="border rounded overflow-hidden">
          <ArticlePublishedTemplate
            username="John Doe"
            articleTitle="Introduction à Next.js 15 : Les Nouvelles Fonctionnalités"
            articleUrl="https://techanswers.com/articles/introduction-nextjs-15"
            summary="Découvrez les améliorations majeures apportées par Next.js 15 et comment elles peuvent transformer votre développement web."
          />
        </div>
      </div>

      {/* Template Comment Reply */}
      <div className="border rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-4">3. Template Réponse Commentaire</h2>
        <div className="border rounded overflow-hidden">
          <CommentReplyTemplate
            username="John Doe"
            commentUrl="https://techanswers.com/articles/introduction-nextjs-15#comments"
            articleTitle="Introduction à Next.js 15 : Les Nouvelles Fonctionnalités"
            replyAuthor="Jane Smith"
            replyContent="Excellent article ! J'ai particulièrement apprécié la section sur les nouvelles optimisations de performance."
            timestamp="Il y a 2 heures"
          />
        </div>
      </div>

      {/* Template Security Alert */}
      <div className="border rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-4">4. Template Alerte de Sécurité</h2>
        <div className="border rounded overflow-hidden">
          <SecurityAlertTemplate
            username="John Doe"
            alertType="LOGIN_ATTEMPT"
            message="Une tentative de connexion a été détectée depuis un nouvel appareil."
            details="Connexion depuis l'adresse IP 192.168.1.100 à Paris, France. Si ce n'était pas vous, changez immédiatement votre mot de passe."
            timestamp="Il y a 5 minutes"
            securityUrl="https://techanswers.com/profile/security"
          />
        </div>
      </div>

      <div className="text-center text-gray-600 mt-8">
        <p>Ces templates sont optimisés pour l&apos;envoi par email et incluent :</p>
        <ul className="list-disc list-inside mt-2 space-y-1">
          <li>Design responsive et moderne</li>
          <li>Gradients et couleurs cohérentes</li>
          <li>Icônes et emojis appropriés</li>
          <li>Structure claire et lisible</li>
          <li>Support des variables dynamiques</li>
        </ul>
      </div>
    </div>
  );
} 