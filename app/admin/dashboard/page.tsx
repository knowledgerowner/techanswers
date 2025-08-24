"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  Users, 
  Mail, 
  Shield, 
  TrendingUp,
  Tag,
} from "lucide-react";

interface Stats {
  articles: number;
  users: number;
  contacts: number;
  bruteforceAttempts: number;
  blockedIPs: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({
    articles: 0,
    users: 0,
    contacts: 0,
    bruteforceAttempts: 0,
    blockedIPs: 0
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await fetch("/api/admin/dashboard/stats");
      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des statistiques:", error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Vue d&apos;ensemble</h1>
        <p className="text-muted-foreground">
          Bienvenue dans votre tableau de bord de l&apos;administration
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-card border rounded-lg p-6">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-500" />
            <span className="text-sm font-medium text-muted-foreground">Articles</span>
          </div>
          <div className="mt-2 text-2xl font-bold">{stats.articles}</div>
          <div className="text-xs text-muted-foreground">Articles publiés</div>
        </div>

        <div className="bg-card border rounded-lg p-6">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-green-500" />
            <span className="text-sm font-medium text-muted-foreground">Utilisateurs</span>
          </div>
          <div className="mt-2 text-2xl font-bold">{stats.users}</div>
          <div className="text-xs text-muted-foreground">Utilisateurs inscrits</div>
        </div>

        <div className="bg-card border rounded-lg p-6">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-orange-500" />
            <span className="text-sm font-medium text-muted-foreground">Vues</span>
          </div>
          <div className="mt-2 text-2xl font-bold">{stats.contacts}</div>
          <div className="text-xs text-muted-foreground">Messages reçus</div>
        </div>

        <div className="bg-card border rounded-lg p-6">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-purple-500" />
            <span className="text-sm font-medium text-muted-foreground">Sécurité</span>
          </div>
          <div className="mt-2 text-2xl font-bold">{stats.blockedIPs}</div>
          <div className="text-xs text-muted-foreground">IPs bloquées</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-card border rounded-lg p-6">
          <h3 className="font-semibold mb-4">Actions rapides</h3>
          <div className="space-y-3">
            <Button className="w-full justify-start" variant="outline">
              <FileText className="mr-2 h-4 w-4" />
              Créer un article
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Tag className="mr-2 h-4 w-4" />
              Ajouter une catégorie
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Mail className="mr-2 h-4 w-4" />
              Voir les messages
            </Button>
          </div>
        </div>

        <div className="bg-card border rounded-lg p-6">
          <h3 className="font-semibold mb-4">Activité récente</h3>
          <div className="space-y-3">
            <div className="text-center py-8">
              <p className="text-sm text-muted-foreground">Aucune activité récente</p>
              <p className="text-xs text-muted-foreground mt-1">Les activités apparaîtront ici</p>
            </div>
          </div>
        </div>

        <div className="bg-card border rounded-lg p-6">
          <h3 className="font-semibold mb-4">Sécurité</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Tentatives d&apos;intrusion</span>
              <span className="text-sm font-medium text-red-500">{stats.bruteforceAttempts}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">IPs bloquées</span>
              <span className="text-sm font-medium text-orange-500">{stats.blockedIPs}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Messages reçus</span>
              <span className="text-sm font-medium text-green-500">{stats.contacts}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 