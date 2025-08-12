"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface User {
  id: string;
  username: string;
  email: string;
  isAdmin: boolean;
}

interface BruteforceStats {
  totalAttempts: number;
  totalFailedLogins: number;
  currentlyBlocked: number;
}

interface BruteforceAttempt {
  id: string;
  ip: string;
  userAgent: string;
  attempts: number;
  lastAttempt: string;
  isBlocked: boolean;
  blockedUntil: string | null;
  browser: string | null;
  os: string | null;
  createdAt: string;
}

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [bruteforceStats, setBruteforceStats] = useState<BruteforceStats | null>(null);
  const [recentAttempts, setRecentAttempts] = useState<BruteforceAttempt[]>([]);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (user) {
      loadBruteforceData();
    }
  }, [user]);

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/auth/me");
      if (response.ok) {
        const userData = await response.json();
        if (userData.isAdmin) {
          setUser(userData);
        } else {
          router.push("/admin/login");
        }
      } else {
        router.push("/admin/login");
      }
    } catch (error) {
      router.push("/admin/login");
    } finally {
      setLoading(false);
    }
  };

  const loadBruteforceData = async () => {
    try {
      const response = await fetch("/api/admin/bruteforce-attempts?limit=5");
      if (response.ok) {
        const data = await response.json();
        setBruteforceStats(data.stats);
        setRecentAttempts(data.attempts);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des données de sécurité:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/admin/login");
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Panel d'Administration</h1>
            <p className="text-muted-foreground">Bienvenue, {user.username}</p>
          </div>
          <Button onClick={handleLogout} variant="outline">
            Déconnexion
          </Button>
        </div>

        {/* Section Sécurité */}
        {bruteforceStats && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Sécurité</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-card border rounded-lg p-4">
                <div className="text-2xl font-bold text-red-500">{bruteforceStats.totalAttempts}</div>
                <div className="text-sm text-muted-foreground">Tentatives d'intrusion (24h)</div>
              </div>
              <div className="bg-card border rounded-lg p-4">
                <div className="text-2xl font-bold text-orange-500">{bruteforceStats.totalFailedLogins}</div>
                <div className="text-sm text-muted-foreground">Échecs de connexion (24h)</div>
              </div>
              <div className="bg-card border rounded-lg p-4">
                <div className="text-2xl font-bold text-green-500">{bruteforceStats.currentlyBlocked}</div>
                <div className="text-sm text-muted-foreground">IPs actuellement bloquées</div>
              </div>
            </div>

            {recentAttempts.length > 0 && (
              <div className="bg-card border rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Tentatives récentes</h3>
                <div className="space-y-3">
                  {recentAttempts.map((attempt) => (
                    <div key={attempt.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-sm">{attempt.ip}</span>
                          {attempt.isBlocked && (
                            <Badge className="bg-red-500 text-white">Bloqué</Badge>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {attempt.browser} • {attempt.os} • {attempt.attempts} tentatives
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(attempt.lastAttempt).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <Button variant="outline" size="sm">
                    Voir toutes les tentatives
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Section Articles */}
          <div className="bg-card border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Articles</h2>
            <p className="text-muted-foreground mb-4">
              Gérez vos articles et contenus
            </p>
            <Button className="w-full">Gérer les Articles</Button>
          </div>

          {/* Section Utilisateurs */}
          <div className="bg-card border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Utilisateurs</h2>
            <p className="text-muted-foreground mb-4">
              Gérez les utilisateurs et permissions
            </p>
            <Button className="w-full">Gérer les Utilisateurs</Button>
          </div>

          {/* Section Analytics */}
          <div className="bg-card border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Analytics</h2>
            <p className="text-muted-foreground mb-4">
              Consultez les statistiques du site
            </p>
            <Button className="w-full">Voir les Analytics</Button>
          </div>

          {/* Section Contact */}
          <div className="bg-card border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Messages</h2>
            <p className="text-muted-foreground mb-4">
              Gérez les messages de contact
            </p>
            <Button className="w-full">Voir les Messages</Button>
          </div>

          {/* Section Catégories */}
          <div className="bg-card border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Catégories</h2>
            <p className="text-muted-foreground mb-4">
              Gérez les catégories d'articles
            </p>
            <Button className="w-full">Gérer les Catégories</Button>
          </div>

          {/* Section Paramètres */}
          <div className="bg-card border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Paramètres</h2>
            <p className="text-muted-foreground mb-4">
              Configurez votre site
            </p>
            <Button className="w-full">Paramètres</Button>
          </div>
        </div>
      </div>
    </div>
  );
} 