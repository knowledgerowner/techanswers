import { useState, useEffect, useCallback } from 'react';

interface AutoSaveOptions {
  key: string;
  delay?: number; // Délai en ms avant sauvegarde automatique
  enabled?: boolean; // Activer/désactiver l'auto-sauvegarde
}

interface AutoSaveState {
  lastSaved: Date | null;
  hasUnsavedChanges: boolean;
  isSaving: boolean;
}

export function useAutoSave<T extends Record<string, any>>( // eslint-disable-line @typescript-eslint/no-explicit-any
  data: T,
  options: AutoSaveOptions
) {
  const { key, delay = 2000, enabled = true } = options;
  
  const [state, setState] = useState<AutoSaveState>({
    lastSaved: null,
    hasUnsavedChanges: false,
    isSaving: false
  });

  // Charger les données sauvegardées au démarrage
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(key);
      if (saved) {
        const parsedData = JSON.parse(saved);
        console.log(`📱 [AUTO-SAVE] Données trouvées dans le sessionStorage: ${key}`, parsedData);
      }
    } catch (error) {
      console.error('Erreur lors de la lecture des données sauvegardées:', error);
    }
  }, [key]);

  // Sauvegarder automatiquement après un délai
  useEffect(() => {
    if (!enabled) return;

    const timeoutId = setTimeout(() => {
      if (Object.keys(data).length > 0) {
        console.log(`⏰ [AUTO-SAVE] Déclenchement de la sauvegarde automatique pour ${key}`);
        saveToStorage(data);
      }
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [data, delay, enabled, key]); // eslint-disable-line react-hooks/exhaustive-deps

  // Fonction de sauvegarde
  const saveToStorage = useCallback((dataToSave: T) => {
    try {
      setState(prev => ({ ...prev, isSaving: true }));
      
      sessionStorage.setItem(key, JSON.stringify(dataToSave));
      
      setState(prev => ({
        ...prev,
        lastSaved: new Date(),
        hasUnsavedChanges: false,
        isSaving: false
      }));
      
      console.log(`💾 [AUTO-SAVE] Données sauvegardées: ${key}`, dataToSave);
      
      // Émettre un événement de sauvegarde
      window.dispatchEvent(new CustomEvent('dataSaved', { 
        detail: { key, data: dataToSave } 
      }));
      
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      setState(prev => ({ ...prev, isSaving: false }));
    }
  }, [key]);

  // Fonction de sauvegarde manuelle
  const saveNow = useCallback(() => {
    saveToStorage(data);
  }, [data, saveToStorage]);

  // Fonction de nettoyage
  const clearStorage = useCallback(() => {
    try {
      sessionStorage.removeItem(key);
      setState({
        lastSaved: null,
        hasUnsavedChanges: false,
        isSaving: false
      });
      console.log(`🗑️ [AUTO-SAVE] Données supprimées: ${key}`);
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  }, [key]);

  // Marquer qu'il y a des changements non sauvegardés
  const markAsChanged = useCallback(() => {
    setState(prev => ({ ...prev, hasUnsavedChanges: true }));
  }, []);

  // Marquer comme sauvegardé (après soumission réussie)
  const markAsSaved = useCallback(() => {
    setState(prev => ({ 
      ...prev, 
      hasUnsavedChanges: false,
      lastSaved: new Date() 
    }));
    // Nettoyer le sessionStorage après sauvegarde réussie
    clearStorage();
  }, [clearStorage]);

  return {
    ...state,
    saveNow,
    clearStorage,
    markAsChanged,
    markAsSaved
  };
} 