"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function AdminLoginPage() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockTimeLeft, setBlockTimeLeft] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const router = useRouter();

  // Vérifier si l'utilisateur est déjà connecté au chargement
  useEffect(() => {
    checkAuthStatus();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const checkAuthStatus = async () => {
    try {
      const response = await fetch("/api/auth/me");
      if (response.ok) {
        const userData = await response.json();
        if (userData.isAdmin || userData.isSuperAdmin) {
          router.push("/admin/dashboard");
        }
      }
    } catch (error) {
      console.error("Erreur lors de la vérification de l'authentification:", error);
      // L'utilisateur n'est pas connecté, continuer
    }
  };

  // Timer pour le décompte du blocage
  useEffect(() => {
    if (blockTimeLeft > 0) {
      const timer = setTimeout(() => {
        setBlockTimeLeft(blockTimeLeft - 1);
        if (blockTimeLeft - 1 === 0) {
          setIsBlocked(false);
          setAttempts(0);
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [blockTimeLeft]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        router.push("/admin/dashboard");
        router.refresh();
      } else {
        setError(data.error || "Erreur de connexion");
        
        // Si l'utilisateur est bloqué, mettre à jour l'état
        if (response.status === 429) {
          setIsBlocked(true);
          setBlockTimeLeft(data.remainingTime || 300);
          setAttempts(data.attempts || 0);
        } else if (response.status === 401 || response.status === 403) {
          // Incrémenter le compteur de tentatives
          setAttempts(prev => prev + 1);
        }
      }
    } catch (err) {
      console.error("Erreur lors de la connexion:", err);
      setError("Erreur de connexion");
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground">Administration</h1>
          <p className="mt-2 text-muted-foreground">
            Accès sécurisé au panel d&apos;administration
          </p>
        </div>

        <div className="bg-card border rounded-lg p-6 space-y-6">
          {isBlocked ? (
            <div className="text-center space-y-4">
              <div className="text-red-500 text-lg font-semibold">
                🚨 Accès temporairement bloqué
              </div>
              <div className="text-muted-foreground">
                Trop de tentatives de connexion échouées.
                <br />
                Réessayez dans : <span className="font-mono text-foreground">{formatTime(blockTimeLeft)}</span>
              </div>
              <div className="text-sm text-muted-foreground">
                Pour des raisons de sécurité, votre fingerprint et IP ont été temporairement bloqués.
              </div>
              <div className="bg-yellow-50 dark:bg-yellow-950/20 p-3 rounded-md">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  <strong>Note :</strong> Le blocage persiste même après actualisation de la page.
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-foreground mb-2">
                  Nom d&apos;utilisateur
                </label>
                <Input
                  id="username"
                  type="text"
                  required
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  placeholder="admin"
                  className="w-full"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                  Mot de passe
                </label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full"
                />
              </div>

              {error && (
                <div className="text-red-500 text-sm bg-red-50 dark:bg-red-950/20 p-3 rounded-md">
                  {error}
                  {attempts > 0 && (
                    <div className="mt-2 text-xs">
                      Tentatives échouées : {attempts}/3
                    </div>
                  )}
                </div>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Connexion..." : "Se connecter"}
              </Button>
            </form>
          )}
        </div>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground">
              ← Retour au site
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
} 