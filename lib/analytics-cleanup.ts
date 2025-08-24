import { prisma } from './prisma';
import { getAnalyticsData } from './analytics';
import { generateAnalyticsPDF } from './pdf-generator';

// Timer pour le nettoyage automatique des analytics
let cleanupTimer: NodeJS.Timeout | null = null;
let isCleanupRunning = false; // Flag pour éviter les nettoyages simultanés

/**
 * Nettoie les anciennes données d'analytics (91+ jours)
 * Génère un PDF de sauvegarde avant suppression
 */
export async function cleanupOldAnalytics(): Promise<void> {
  // Vérifier si un nettoyage est déjà en cours
  if (isCleanupRunning) {
    console.log('⚠️ [ANALYTICS CLEANUP] Nettoyage déjà en cours, ignoré');
    return;
  }
  
  try {
    isCleanupRunning = true;
    console.log('🧹 [ANALYTICS CLEANUP] Début du nettoyage des anciennes données...');
    
    // Calculer la date limite (91 jours)
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 91);
    
    console.log(`📅 [ANALYTICS CLEANUP] Suppression des données antérieures à: ${cutoffDate.toISOString()}`);
    
    // Supprimer les anciennes données
    console.log('🗑️ [ANALYTICS CLEANUP] Suppression des anciennes données...');
    
    // Supprimer les anciennes PageViews
    const deletedPageViews = await prisma.pageView.deleteMany({
      where: {
        createdAt: {
          lt: cutoffDate
        }
      }
    });
    
    // Supprimer les anciennes ArticleViews
    const deletedArticleViews = await prisma.articleView.deleteMany({
      where: {
        createdAt: {
          lt: cutoffDate
        }
      }
    });
    
    // Supprimer les anciennes UserSessions
    const deletedUserSessions = await prisma.userSession.deleteMany({
      where: {
        createdAt: {
          lt: cutoffDate
        }
      }
    });
    
    console.log(`✅ [ANALYTICS CLEANUP] Nettoyage terminé:`);
    console.log(`   - PageViews supprimées: ${deletedPageViews.count}`);
    console.log(`   - ArticleViews supprimées: ${deletedArticleViews.count}`);
    console.log(`   - UserSessions supprimées: ${deletedUserSessions.count}`);
    
  } catch (error) {
    console.error('❌ [ANALYTICS CLEANUP] Erreur lors du nettoyage:', error);
    throw error;
  } finally {
    // Libérer le flag de nettoyage
    isCleanupRunning = false;
    console.log('🔓 [ANALYTICS CLEANUP] Flag de nettoyage libéré');
  }
}

/**
 * Sauvegarde le PDF des analytics
 * Crée un fichier téléchargeable dans le dossier public
 */
async function saveAnalyticsPDF(filename: string, pdfBuffer: Buffer): Promise<void> {
  try {
    const fs = await import('fs');
    const path = await import('path');
    
    // Créer le dossier backups s'il n'existe pas
    const backupDir = path.join(process.cwd(), 'public', 'backups');
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }
    
    // Sauvegarder le PDF dans public/backups/
    const filePath = path.join(backupDir, filename);
    fs.writeFileSync(filePath, pdfBuffer);
    
    console.log(`💾 [ANALYTICS CLEANUP] PDF sauvegardé: ${filePath}`);
    console.log(`📥 [ANALYTICS CLEANUP] PDF accessible à: /backups/${filename}`);
    
  } catch (error) {
    console.error('❌ [ANALYTICS CLEANUP] Erreur lors de la sauvegarde du PDF:', error);
  }
}

/**
 * Démarre le nettoyage automatique des analytics
 * Nettoie tous les 91 jours
 */
export function startAnalyticsCleanup(): void {
  // Ne pas nettoyer immédiatement au démarrage pour éviter les boucles
  // Attendre que l'application soit complètement initialisée
  
  // Programmer le nettoyage tous les 91 jours
  const NINETY_ONE_DAYS = 91 * 24 * 60 * 60 * 1000;
  
  // Démarrer le premier nettoyage dans 1 heure pour éviter les conflits au démarrage
  setTimeout(() => {
    console.log('⏰ [ANALYTICS CLEANUP] Premier nettoyage automatique après démarrage');
    cleanupOldAnalytics().catch(console.error);
  }, 60 * 60 * 1000); // 1 heure
  
  cleanupTimer = setInterval(() => {
    console.log('⏰ [ANALYTICS CLEANUP] Déclenchement du nettoyage automatique');
    cleanupOldAnalytics().catch(console.error);
  }, NINETY_ONE_DAYS);
  
  console.log('⏰ [ANALYTICS CLEANUP] Nettoyage automatique programmé tous les 91 jours (premier dans 1h)');
}

/**
 * Arrête le nettoyage automatique des analytics
 */
export function stopAnalyticsCleanup(): void {
  if (cleanupTimer) {
    clearInterval(cleanupTimer);
    cleanupTimer = null;
    console.log('❌ [ANALYTICS CLEANUP] Nettoyage automatique arrêté');
  }
}

/**
 * Nettoie manuellement les anciennes données
 */
export async function manualAnalyticsCleanup(): Promise<void> {
  console.log('🧹 [ANALYTICS CLEANUP] Nettoyage manuel déclenché');
  await cleanupOldAnalytics();
}

/**
 * Nettoie MANUELLEMENT TOUTES les données d'analytics (nettoyage complet)
 * Génère un PDF de sauvegarde avant suppression
 */
export async function cleanupAllAnalytics(): Promise<void> {
  try {
    console.log('🧹 [ANALYTICS CLEANUP] Début du nettoyage COMPLET des analytics...');
    
    // ÉTAPE 1: Générer un PDF de sauvegarde AVANT suppression
    console.log('📊 [ANALYTICS CLEANUP] Génération du PDF de sauvegarde...');
    const analyticsData = await getAnalyticsData(365); // Récupérer le maximum de données
    
    if (analyticsData.pageViews > 0) {
      const pdfBuffer = await generateAnalyticsPDF(analyticsData, 'Sauvegarde complète avant nettoyage total');
      
      // Sauvegarder le PDF
      const filename = `analytics-backup-${new Date().toISOString().split('T')[0]}.pdf`;
      console.log(`💾 [ANALYTICS CLEANUP] PDF généré: ${filename}`);
      
      await saveAnalyticsPDF(filename, pdfBuffer);
    }
    
    // ÉTAPE 2: Supprimer TOUTES les PageViews APRÈS génération du PDF
    console.log('🗑️ [ANALYTICS CLEANUP] Suppression de TOUTES les PageViews...');
    const deletedPageViews = await prisma.pageView.deleteMany({});
    
    console.log(`✅ [ANALYTICS CLEANUP] Nettoyage COMPLET terminé:`);
    console.log(`   - PageViews supprimées: ${deletedPageViews.count}`);
    
  } catch (error) {
    console.error('❌ [ANALYTICS CLEANUP] Erreur lors du nettoyage complet:', error);
    throw error;
  }
}

/**
 * Initialise le système de nettoyage automatique
 * À appeler au démarrage de l'application
 */
export function initializeAnalyticsCleanup(): void {
  // DÉSACTIVÉ TEMPORAIREMENT pour éviter la boucle infinie
  // startAnalyticsCleanup();
  
  console.log('🚀 [ANALYTICS CLEANUP] Système de nettoyage initialisé (automatique désactivé)');
}

/**
 * Nettoie les données au démarrage et programme le nettoyage automatique
 * Cette fonction est appelée automatiquement lors de l'import du module
 */
if (typeof window === 'undefined') {
  // Côté serveur uniquement
  initializeAnalyticsCleanup();
} 