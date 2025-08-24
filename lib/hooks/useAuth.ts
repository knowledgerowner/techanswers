"use client";

import { useState, useEffect, useCallback } from 'react';

interface User {
  id: string;
  username: string;
  email: string;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  createdAt: string;
  
  // Nouvelles propriétés pour les fonctionnalités avancées
  firstName?: string;
  lastName?: string;
  bio?: string;
  avatarUrl?: string;
  website?: string;
  location?: string;
  company?: string;
  jobTitle?: string;
  
  // Sécurité et vérification
  isEmailVerified?: boolean;
  emailVerificationToken?: string;
  emailVerificationExpires?: string;
  passwordResetToken?: string;
  passwordResetExpires?: string;
  twoFactorEnabled?: boolean;
  twoFactorSecret?: string;
  twoFactorBackupCodes?: string[];
  lastLoginAt?: string;
  loginAttempts?: number;
  lockedUntil?: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    try {
      const response = await fetch("/api/auth/me", {
        credentials: 'include'
      });
      
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Erreur lors de la vérification d'authentification:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, password: string, isAdmin = false) => {
    try {
      const endpoint = isAdmin ? "/api/auth/admin/login" : "/api/auth/login";
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Erreur lors de la connexion:", error);
      return false;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch("/api/auth/logout", { 
        method: "POST",
        credentials: 'include'
      });
      setUser(null);
      // Forcer un rechargement pour synchroniser tous les composants
      window.location.href = "/";
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    }
  }, []);

  // Vérifier l'authentification au chargement et quand la page redevient visible
  useEffect(() => {
    checkAuth();
    
    // Vérifier l'authentification quand la page redevient visible
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        checkAuth();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [checkAuth]);

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    checkAuth
  };
}
