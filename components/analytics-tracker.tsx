"use client";

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

interface AnalyticsTrackerProps {
  title?: string;
  sessionId?: string;
}

export function AnalyticsTracker({ title, sessionId }: AnalyticsTrackerProps) {
  const pathname = usePathname();
  const startTimeRef = useRef<number>(Date.now());
  const sessionIdRef = useRef<string | undefined>(sessionId);
  const hasTrackedRef = useRef(false);
  const hasCountedRef = useRef(false); // Pour éviter de compter plusieurs fois la même page

  // Initialiser le sessionId depuis localStorage ou props
  useEffect(() => {
    const storedSessionId = localStorage.getItem('analytics_session_id');
    if (storedSessionId) {
      sessionIdRef.current = storedSessionId;
      console.log('🔄 AnalyticsTracker - SessionId récupéré depuis localStorage:', storedSessionId);
    } else if (sessionId) {
      sessionIdRef.current = sessionId;
      localStorage.setItem('analytics_session_id', sessionId);
      console.log('🔄 AnalyticsTracker - SessionId sauvegardé dans localStorage:', sessionId);
    }
  }, [sessionId]);

  // Tracker la vue de page au chargement
  useEffect(() => {
    console.log('🔄 AnalyticsTracker - pathname changé:', pathname);
    console.log('🔄 AnalyticsTracker - hasTrackedRef.current:', hasTrackedRef.current);
    console.log('🔄 AnalyticsTracker - sessionIdRef.current:', sessionIdRef.current);
    
    // Réinitialiser le temps de départ pour la nouvelle page
    startTimeRef.current = Date.now();
    console.log('🔄 AnalyticsTracker - Temps réinitialisé pour:', pathname);
    
    if (!hasTrackedRef.current) {
      // Exclure les pages admin du tracking
      if (!pathname.startsWith('/admin')) {
        console.log('✅ AnalyticsTracker - Tracking de la page:', pathname);
        trackPageView();
        hasTrackedRef.current = true;
        hasCountedRef.current = false; // Reset le flag de comptage
      } else {
        console.log('🚫 AnalyticsTracker - Page admin exclue du tracking:', pathname);
      }
    } else {
      console.log('⏭️ AnalyticsTracker - Page déjà trackée, skip:', pathname);
    }
  }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  // Reset le flag quand on change de page
  useEffect(() => {
    console.log('🔄 AnalyticsTracker - Reset du flag pour nouvelle page:', pathname);
    hasTrackedRef.current = false;
    hasCountedRef.current = false;
  }, [pathname]);

  // Tracker le temps passé sur la page et la profondeur de scroll
  useEffect(() => {
    let scrollDepth = 0;
    let timeOnPage = 0;
    const intervalId = setInterval(() => {
      updateMetrics();
      updatePageMetrics(timeOnPage, scrollDepth);
    }, 30000); // 30 secondes

    // Réinitialiser le temps de départ
    startTimeRef.current = Date.now();
    console.log('🔄 AnalyticsTracker - Métriques réinitialisées pour:', pathname);

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      scrollDepth = Math.round((scrollTop / docHeight) * 100);
    };

    const updateMetrics = () => {
      timeOnPage = Math.floor((Date.now() - startTimeRef.current) / 1000);
      console.log('⏱️ Temps passé sur la page:', timeOnPage, 'secondes, Scroll:', scrollDepth, '%');
      
      // Compter la visite seulement après 10 secondes
      if (timeOnPage >= 10 && !hasCountedRef.current) {
        console.log('✅ Comptage de la visite après 10 secondes sur:', pathname);
        countPageView();
        hasCountedRef.current = true;
      }
    };

    const handleBeforeUnload = () => {
      updateMetrics();
      updatePageMetrics(timeOnPage, scrollDepth);
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        updateMetrics();
        updatePageMetrics(timeOnPage, scrollDepth);
      } else {
        startTimeRef.current = Date.now();
        console.log('🔄 AnalyticsTracker - Temps réinitialisé après retour de visibilité');
      }
    };

    // Mettre à jour les métriques toutes les 30 secondes
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      
      // Mettre à jour les métriques avant de quitter
      updateMetrics();
      updatePageMetrics(timeOnPage, scrollDepth);
    };
  }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  const trackPageView = async () => {
    try {
      console.log('🔍 Tracking page view:', pathname, 'avec sessionId:', sessionIdRef.current);
      
      const response = await fetch('/api/analytics/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          page: pathname,
          title: title || document.title,
          sessionId: sessionIdRef.current,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const newSessionId = data.sessionId;
        
        // Mettre à jour le sessionId seulement s'il a changé
        if (newSessionId && newSessionId !== sessionIdRef.current) {
          sessionIdRef.current = newSessionId;
          localStorage.setItem('analytics_session_id', newSessionId);
          console.log('✅ Nouveau sessionId sauvegardé:', newSessionId);
        }
        
        console.log('✅ Page tracked successfully:', pathname);
      } else {
        console.error('❌ Failed to track page:', pathname);
      }
    } catch (error) {
      console.error('Erreur lors du tracking de la vue:', error);
    }
  };

  const countPageView = async () => {
    try {
      // Vérifier que ce n'est pas une page admin avant de compter
      if (pathname.startsWith('/admin')) {
        console.log('🚫 Comptage exclu pour page admin:', pathname);
        return;
      }
      
      console.log('🔍 Counting page view (10s+):', pathname, 'avec sessionId:', sessionIdRef.current);
      
      const response = await fetch('/api/analytics/count-view', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          page: pathname,
          sessionId: sessionIdRef.current,
        }),
      });

      if (response.ok) {
        console.log('✅ Page view counted successfully:', pathname);
      } else {
        console.error('❌ Failed to count page view:', pathname);
      }
    } catch (error) {
      console.error('Erreur lors du comptage de la vue:', error);
    }
  };

  const updatePageMetrics = async (timeOnPage: number, scrollDepth: number) => {
    if (!sessionIdRef.current) return;

    try {
      await fetch('/api/analytics/update-metrics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: sessionIdRef.current,
          page: pathname,
          timeOnPage,
          scrollDepth,
        }),
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour des métriques:', error);
    }
  };

  return null; // Ce composant ne rend rien visuellement
} 