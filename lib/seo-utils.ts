/**
 * Extrait les mots en gras du contenu markdown
 * @param content - Le contenu markdown de l'article
 * @returns Array des mots en gras (sans les **)
 */
export function extractBoldKeywords(content: string): string[] {
  const boldPattern = /\*\*([^*]+)\*\*/g;
  const keywords: string[] = [];
  let match;

  while ((match = boldPattern.exec(content)) !== null) {
    const keyword = match[1].trim();
    if (keyword.length > 0 && !keywords.includes(keyword)) {
      keywords.push(keyword);
    }
  }

  return keywords;
}

/**
 * Génère automatiquement les métadonnées SEO pour un article
 * @param title - Le titre de l'article
 * @param excerpt - L'extrait de l'article
 * @param content - Le contenu markdown de l'article
 * @param imageUrl - L'URL de l'image de l'article
 * @returns Objet avec les métadonnées SEO générées
 */
export function generateArticleSEO(
  title: string,
  excerpt: string | null,
  content: string,
  imageUrl: string | null
) {
  // Mots-clés de base pour tous les articles
  const baseKeywords = [
    "Articles Tech",
    "TechAnswers", 
    "Blog Informatique",
    "Blog Dev Web",
    "Blog SysAdmin & DevOps"
  ];

  // Extraire les mots-clés spécifiques du contenu (mots en gras)
  const contentKeywords = extractBoldKeywords(content);

  // Combiner les mots-clés de base avec ceux du contenu
  const allKeywords = [...baseKeywords, ...contentKeywords];

  // Générer le titre SEO (titre de l'article par défaut)
  const seoTitle = title;

  // Générer la description SEO (extrait de l'article par défaut)
  const seoDesc = excerpt || `Découvrez ${title} - Article technique sur TechAnswers`;

  // Générer les mots-clés SEO
  const seoKeywords = allKeywords.join(', ');

  // L'image SEO sera la même que l'image de l'article
  const seoImg = imageUrl;

  return {
    seoTitle,
    seoDesc,
    seoKeywords,
    seoImg
  };
}

/**
 * Met à jour automatiquement les métadonnées SEO d'un article
 * @param formData - Les données du formulaire d'article
 * @returns Les données mises à jour avec les métadonnées SEO
 */
export function updateArticleSEO<T extends {
  title: string;
  excerpt: string | null;
  content: string;
  imageUrl?: string | null;
  seoTitle?: string;
  seoDesc?: string;
  seoKeywords?: string;
  seoImg?: string | null;
}>(formData: T): T {
  // Générer les métadonnées SEO automatiquement
  const seoData = generateArticleSEO(
    formData.title,
    formData.excerpt,
    formData.content,
    formData.imageUrl || null
  );

  // Retourner les données mises à jour
  return {
    ...formData,
    seoTitle: seoData.seoTitle,
    seoDesc: seoData.seoDesc,
    seoKeywords: seoData.seoKeywords,
    seoImg: seoData.seoImg
  };
} 