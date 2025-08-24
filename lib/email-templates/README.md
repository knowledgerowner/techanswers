# 📧 Templates d'Email - TechAnswers

Ce dossier contient tous les templates d'email utilisés par l'application TechAnswers.

## 🎯 Templates Disponibles

### 1. WelcomeTemplate
**Fichier :** `welcome.tsx`
**Usage :** Email de bienvenue pour les nouveaux utilisateurs

**Props :**
- `username: string` - Nom de l'utilisateur
- `email: string` - Adresse email de l'utilisateur
- `activationLink?: string` - Lien d'activation du compte (optionnel)

**Exemple :**
```tsx
<WelcomeTemplate
  username="John Doe"
  email="john.doe@example.com"
  activationLink="https://techanswers.com/activate/abc123"
/>
```

### 2. ArticlePublishedTemplate
**Fichier :** `article-published.tsx`
**Usage :** Notification de publication d'un nouvel article

**Props :**
- `username: string` - Nom de l'utilisateur
- `articleTitle: string` - Titre de l'article
- `articleUrl: string` - URL de l'article
- `summary?: string` - Résumé de l'article (optionnel)

**Exemple :**
```tsx
<ArticlePublishedTemplate
  username="John Doe"
  articleTitle="Introduction à Next.js 15"
  articleUrl="https://techanswers.com/articles/nextjs-15"
  summary="Découvrez les nouvelles fonctionnalités..."
/>
```

### 3. CommentReplyTemplate
**Fichier :** `comment-reply.tsx`
**Usage :** Notification de réponse à un commentaire

**Props :**
- `username: string` - Nom de l'utilisateur qui reçoit la notification
- `commentUrl: string` - URL de la discussion des commentaires
- `articleTitle: string` - Titre de l'article
- `replyAuthor: string` - Nom de l'auteur de la réponse
- `replyContent: string` - Contenu de la réponse
- `timestamp: string` - Horodatage de la réponse

**Exemple :**
```tsx
<CommentReplyTemplate
  username="John Doe"
  commentUrl="https://techanswers.com/articles/nextjs-15#comments"
  articleTitle="Introduction à Next.js 15"
  replyAuthor="Jane Smith"
  replyContent="Excellent article !"
  timestamp="Il y a 2 heures"
/>
```

### 4. SecurityAlertTemplate
**Fichier :** `security-alert.tsx`
**Usage :** Alertes de sécurité (connexions, 2FA, etc.)

**Props :**
- `username: string` - Nom de l'utilisateur
- `alertType: 'LOGIN_ATTEMPT' | 'PASSWORD_CHANGE' | '2FA_ENABLED' | '2FA_DISABLED' | 'SUSPICIOUS_ACTIVITY'` - Type d'alerte
- `message: string` - Message principal de l'alerte
- `details?: string` - Détails supplémentaires (optionnel)
- `timestamp: string` - Horodatage de l'alerte
- `securityUrl?: string` - URL de la page de sécurité (optionnel)

**Exemple :**
```tsx
<SecurityAlertTemplate
  username="John Doe"
  alertType="LOGIN_ATTEMPT"
  message="Tentative de connexion depuis un nouvel appareil"
  details="Connexion depuis Paris, France"
  timestamp="Il y a 5 minutes"
  securityUrl="https://techanswers.com/profile/security"
/>
```

## 🎨 Caractéristiques des Templates

### Design
- **Style moderne** avec gradients et couleurs cohérentes
- **Responsive** pour tous les clients email
- **Icônes et emojis** pour une meilleure lisibilité
- **Typographie** optimisée pour l'email

### Structure
- **Header** avec logo et titre
- **Contenu principal** avec les informations spécifiques
- **Footer** avec informations légales
- **Boutons d'action** clairs et visibles

### Couleurs
- **Fond principal :** Gradient noir/gris foncé
- **Header :** Gradient noir/gris très foncé
- **Accents :** Bleus, verts et oranges selon le contexte
- **Texte :** Blanc et gris clair pour la lisibilité

## 🚀 Utilisation

### Import
```tsx
import { 
  WelcomeTemplate, 
  ArticlePublishedTemplate,
  CommentReplyTemplate,
  SecurityAlertTemplate 
} from '@/lib/email-templates';
```

### Démonstration
Utilisez le composant `EmailTemplatesDemo` pour prévisualiser tous les templates :

```tsx
import { EmailTemplatesDemo } from '@/lib/email-templates';

// Dans votre composant
<EmailTemplatesDemo />
```

## 🔧 Personnalisation

### Ajouter un nouveau template
1. Créez un nouveau fichier `.tsx` dans ce dossier
2. Définissez l'interface des props
3. Créez le composant avec le style cohérent
4. Ajoutez l'export dans `index.ts`
5. Mettez à jour la documentation

### Modifier un template existant
- Respectez la structure et les couleurs existantes
- Testez avec différents contenus
- Vérifiez la compatibilité email

## 📱 Compatibilité Email

Les templates sont optimisés pour :
- **Gmail** (Web et Mobile)
- **Outlook** (Web et Desktop)
- **Apple Mail**
- **Thunderbird**
- **Clients mobiles** (iOS, Android)

## 🧪 Tests

Pour tester les templates :
1. Utilisez `EmailTemplatesDemo` pour la prévisualisation
2. Testez avec différents contenus et longueurs
3. Vérifiez la compatibilité cross-client
4. Testez l'envoi réel via l'API

## 📝 Notes

- Tous les templates utilisent des styles inline pour la compatibilité email
- Les images et liens externes doivent être absolus
- Testez toujours avant la mise en production
- Respectez les bonnes pratiques d'accessibilité 