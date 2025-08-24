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
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const userData = await response.json();
          setPurchasedArticles(userData.hasPurchased || []);
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