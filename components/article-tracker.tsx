"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

interface ArticleTrackerProps {
  articleId: string;
  sessionId?: string;
}

export function ArticleTracker({ articleId, sessionId }: ArticleTrackerProps) {
  const pathname = usePathname();
  const startTimeRef = useRef<number>(Date.now());
  const sessionIdRef = useRef<string | undefined>(sessionId);
  const hasTrackedRef = useRef(false);

  // Tracker la vue d'article au chargement
  useEffect(() => {
    if (!hasTrackedRef.current) {
      trackArticleView();
      hasTrackedRef.current = true;
    }
  }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  // Tracker le temps passé sur l'article et la profondeur de scroll
  useEffect(() => {
    let scrollDepth = 0;
    let timeOnPage = 0;
    let readProgress = 0;

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      scrollDepth = Math.round((scrollTop / docHeight) * 100);
      
      // Calculer le progrès de lecture basé sur la position du scroll
      readProgress = Math.min(100, Math.round((scrollTop / docHeight) * 100));
    };

    const handleBeforeUnload = () => {
      timeOnPage = Math.floor((Date.now() - startTimeRef.current) / 1000);
      updateArticleMetrics(timeOnPage, scrollDepth, readProgress);
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        timeOnPage = Math.floor((Date.now() - startTimeRef.current) / 1000);
        updateArticleMetrics(timeOnPage, scrollDepth, readProgress);
      } else {
        startTimeRef.current = Date.now();
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      
      // Mettre à jour les métriques avant de quitter
      timeOnPage = Math.floor((Date.now() - startTimeRef.current) / 1000);
      updateArticleMetrics(timeOnPage, scrollDepth, readProgress);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const trackArticleView = async () => {
    try {
      const response = await fetch('/api/analytics/track-article', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          articleId,
          sessionId: sessionIdRef.current,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        sessionIdRef.current = data.sessionId;
      }
    } catch (error) {
      console.error('Erreur lors du tracking de la vue d\'article:', error);
    }
  };

  const updateArticleMetrics = async (timeOnPage: number, scrollDepth: number, readProgress: number) => {
    if (!sessionIdRef.current) return;

    try {
      await fetch('/api/analytics/update-article-metrics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: sessionIdRef.current,
          articleId,
          timeOnPage,
          scrollDepth,
          readProgress,
        }),
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour des métriques d\'article:', error);
    }
  };

  return null; // Ce composant ne rend rien visuellement
} 