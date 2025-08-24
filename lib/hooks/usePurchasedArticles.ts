'use client';

import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';

export function usePurchasedArticles() {
  const [purchasedArticles, setPurchasedArticles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setPurchasedArticles([]);
      setLoading(false);
      return;
    }

    const fetchPurchasedArticles = async () => {
      try {
        console.log('🔍 usePurchasedArticles - Fetching from /api/auth/me...');
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const userData = await response.json();
          console.log('🔍 usePurchasedArticles - User data received:', userData);
          console.log('🔍 usePurchasedArticles - hasPurchased field:', userData.hasPurchased);
          setPurchasedArticles(userData.hasPurchased || []);
        } else {
          console.error('🔍 usePurchasedArticles - API error:', response.status);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des articles achetés:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPurchasedArticles();
  }, [user]);

  const hasPurchased = (articleId: string) => {
    return purchasedArticles.includes(articleId);
  };

  return {
    purchasedArticles,
    hasPurchased,
    loading
  };
} 