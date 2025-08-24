import { prisma } from './prisma';

// Map pour stocker les timers actifs
const activeTimers = new Map<string, NodeJS.Timeout>();

/**
 * Programme la suppression automatique d'une notification après 2 semaines
 */
export function scheduleNotificationCleanup(notificationId: string, createdAt: Date) {
  // Calculer le délai en millisecondes (2 semaines = 14 jours)
  const twoWeeksInMs = 14 * 24 * 60 * 60 * 1000;
  const delay = createdAt.getTime() + twoWeeksInMs - Date.now();
  
  // Si le délai est négatif, supprimer immédiatement
  if (delay <= 0) {
    deleteExpiredNotification(notificationId);
    return;
  }

  // Annuler le timer existant s'il y en a un
  if (activeTimers.has(notificationId)) {
    clearTimeout(activeTimers.get(notificationId)!);
  }

  // Créer un nouveau timer
  const timer = setTimeout(async () => {
    await deleteExpiredNotification(notificationId);
    activeTimers.delete(notificationId);
  }, delay);

  // Stocker le timer
  activeTimers.set(notificationId, timer);

  console.log(`⏰ [NOTIFICATION CLEANUP] Timer programmé pour la notification ${notificationId} dans ${Math.round(delay / (1000 * 60 * 60 * 24))} jours`);
}

/**
 * Supprime une notification expirée de la base de données
 */
async function deleteExpiredNotification(notificationId: string) {
  try {
    await prisma.notification.delete({
      where: { id: notificationId }
    });
    console.log(`🗑️ [NOTIFICATION CLEANUP] Notification ${notificationId} supprimée automatiquement`);
  } catch (error) {
    console.error(`❌ [NOTIFICATION CLEANUP] Erreur lors de la suppression de la notification ${notificationId}:`, error);
  }
}

/**
 * Annule un timer de nettoyage
 */
export function cancelNotificationCleanup(notificationId: string) {
  if (activeTimers.has(notificationId)) {
    clearTimeout(activeTimers.get(notificationId)!);
    activeTimers.delete(notificationId);
    console.log(`❌ [NOTIFICATION CLEANUP] Timer annulé pour la notification ${notificationId}`);
  }
}

/**
 * Nettoie tous les timers actifs (utile pour les tests)
 */
export function cleanupAllNotificationTimers() {
  activeTimers.forEach((timer, notificationId) => {
    clearTimeout(timer);
    console.log(`🧹 [NOTIFICATION CLEANUP] Timer nettoyé pour la notification ${notificationId}`);
  });
  activeTimers.clear();
}

/**
 * Retourne le nombre de timers actifs
 */
export function getActiveNotificationTimersCount() {
  return activeTimers.size;
} 