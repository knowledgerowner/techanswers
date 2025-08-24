import { prisma } from './prisma';

// Map pour stocker les timers actifs
const activeTimers = new Map<string, NodeJS.Timeout>();

/**
 * Programme la suppression automatique d'un code 2FA après 10 minutes
 */
export function scheduleCodeCleanup(codeId: string, expiresAt: Date) {
  // Calculer le délai en millisecondes
  const delay = expiresAt.getTime() - Date.now();
  
  // Si le délai est négatif, supprimer immédiatement
  if (delay <= 0) {
    deleteExpiredCode(codeId);
    return;
  }

  // Annuler le timer existant s'il y en a un
  if (activeTimers.has(codeId)) {
    clearTimeout(activeTimers.get(codeId)!);
  }

  // Créer un nouveau timer
  const timer = setTimeout(async () => {
    await deleteExpiredCode(codeId);
    activeTimers.delete(codeId);
  }, delay);

  // Stocker le timer
  activeTimers.set(codeId, timer);

  console.log(`⏰ [2FA CLEANUP] Timer programmé pour le code ${codeId} dans ${Math.round(delay / 1000)} secondes`);
}

/**
 * Supprime un code expiré de la base de données
 */
async function deleteExpiredCode(codeId: string) {
  try {
    await prisma.twoFactorCode.delete({
      where: { id: codeId }
    });
    console.log(`🗑️ [2FA CLEANUP] Code ${codeId} supprimé automatiquement`);
  } catch (error) {
    console.error(`❌ [2FA CLEANUP] Erreur lors de la suppression du code ${codeId}:`, error);
  }
}

/**
 * Annule un timer de nettoyage
 */
export function cancelCodeCleanup(codeId: string) {
  if (activeTimers.has(codeId)) {
    clearTimeout(activeTimers.get(codeId)!);
    activeTimers.delete(codeId);
    console.log(`❌ [2FA CLEANUP] Timer annulé pour le code ${codeId}`);
  }
}

/**
 * Nettoie tous les timers actifs (utile pour les tests)
 */
export function cleanupAllTimers() {
  activeTimers.forEach((timer, codeId) => {
    clearTimeout(timer);
    console.log(`🧹 [2FA CLEANUP] Timer nettoyé pour le code ${codeId}`);
  });
  activeTimers.clear();
}

/**
 * Retourne le nombre de timers actifs
 */
export function getActiveTimersCount() {
  return activeTimers.size;
} 