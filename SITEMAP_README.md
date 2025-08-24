# 📍 Système de Sitemap - TechAnswers

Ce projet utilise un système de sitemap complet et automatique pour optimiser le référencement SEO.

## 🗂️ Structure des Sitemaps

### 1. **Sitemap Principal** (`/sitemap.xml`)
- **Généré par** : `app/sitemap.ts`
- **Contenu** : Pages statiques principales
- **URL** : `https://techanswers.fr/sitemap.xml`

### 2. **Sitemap des Catégories** (`/categories/sitemap.xml`)
- **Généré par** : `app/categories/sitemap.ts`
- **Contenu** : Toutes les catégories avec priorité basée sur le nombre d'articles
- **URL** : `https://techanswers.fr/categories/sitemap.xml`

### 3. **Sitemap des Articles** (`/articles/sitemap.xml`)
- **Généré par** : `app/articles/sitemap.ts`
- **Contenu** : Tous les articles publiés avec priorité basée sur le type
- **URL** : `https://techanswers.fr/articles/sitemap.xml`

### 4. **Index des Sitemaps** (`/sitemap_index.xml`)
- **Fichier statique** : `public/sitemap_index.xml`
- **Contenu** : Liste de tous les sitemaps disponibles
- **URL** : `https://techanswers.fr/sitemap_index.xml`

## 🤖 Fichier Robots.txt

- **Généré par** : `app/robots.ts`
- **URL** : `https://techanswers.fr/robots.txt`
- **Règles** : Autorise l'indexation des pages publiques, bloque l'accès aux zones admin

## 🚀 Utilisation

### **Génération Automatique**
Les sitemaps sont générés automatiquement par Next.js lors de :
- Build de production
- Développement local
- Déploiement

### **Mise à Jour Manuelle**
Pour mettre à jour l'index des sitemaps :

```bash
npm run sitemap:update
```

### **Cron Job (Recommandé)**
Ajoutez ceci à votre crontab pour une mise à jour quotidienne :

```bash
# Mise à jour quotidienne à 2h du matin
0 2 * * * cd /path/to/your/project && npm run sitemap:update
```

## ⚙️ Configuration

### **Variables d'Environnement**
```env
NEXT_PUBLIC_SITE_URL=https://techanswers.fr
```

### **Priorités SEO**
- **Page d'accueil** : 1.0
- **Articles marketing** : 0.9
- **Articles premium** : 0.8
- **Catégories** : 0.3-0.8 (selon le nombre d'articles)
- **Articles normaux** : 0.7
- **Pages statiques** : 0.5-0.8

## 📊 Validation

### **Google Search Console**
1. Ajoutez votre site à Google Search Console
2. Soumettez le sitemap principal : `https://techanswers.fr/sitemap.xml`
3. Google découvrira automatiquement tous les autres sitemaps

### **Outils de Validation**
- [Google Sitemap Validator](https://www.google.com/webmasters/tools/)
- [XML Sitemap Validator](https://www.xml-sitemaps.com/validate-xml-sitemap.html)

## 🔧 Maintenance

### **Vérification des Sitemaps**
```bash
# Vérifier le sitemap principal
curl https://techanswers.fr/sitemap.xml

# Vérifier l'index
curl https://techanswers.fr/sitemap_index.xml
```

### **Nettoyage**
Les sitemaps sont automatiquement nettoyés et mis à jour. Aucune action manuelle n'est requise.

## 📈 Avantages SEO

1. **Indexation rapide** : Les nouveaux articles sont découverts rapidement
2. **Priorisation intelligente** : Les pages importantes ont une priorité élevée
3. **Structure claire** : Organisation logique pour les moteurs de recherche
4. **Mise à jour automatique** : Pas de maintenance manuelle requise
5. **Conformité** : Respect des standards XML et sitemap

## 🚨 Dépannage

### **Sitemap non accessible**
- Vérifiez que le build s'est bien passé
- Vérifiez les logs de déploiement
- Testez en local avec `npm run dev`

### **Erreurs de génération**
- Vérifiez la connexion à la base de données
- Vérifiez les permissions des fichiers
- Consultez les logs d'erreur

### **Données manquantes**
- Vérifiez que les articles sont bien publiés
- Vérifiez que les catégories existent
- Vérifiez les requêtes Prisma

---

**Note** : Ce système est optimisé pour Next.js 15+ et utilise les nouvelles API de métadonnées. 