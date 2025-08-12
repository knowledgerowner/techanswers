"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AdminSidebar } from "@/components/admin-sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  BarChart3, 
  FileText, 
  Users, 
  Mail, 
  Settings, 
  CreditCard, 
  Bell, 
  Search,
  Menu,
  X,
  LogOut,
  User,
  Shield,
  TrendingUp,
  Calendar,
  Tag,
  Newspaper
} from "lucide-react";

interface User {
  id: string;
  username: string;
  email: string;
  isAdmin: boolean;
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

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
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <AdminSidebar className="hidden lg:flex" />

      {/* Mobile Sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
        <div className="fixed left-0 top-0 h-full w-3/4 border-r bg-background">
          <AdminSidebar className="w-full" />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex h-[60px] items-center gap-4 border-b bg-background px-6">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-4 w-4" />
          </Button>

          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="search"
                placeholder="Rechercher..."
                className="w-full rounded-md border border-input bg-background px-8 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <Bell className="h-4 w-4" />
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/avatars/01.png" alt={user.username} />
                    <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.username}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profil</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Paramètres</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Déconnexion</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto p-6">
            <div className="mb-8">
              <h1 className="text-3xl font-bold">Vue d'ensemble</h1>
              <p className="text-muted-foreground">
                Bienvenue dans votre tableau de bord d'administration
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-card border rounded-lg p-6">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-500" />
                  <span className="text-sm font-medium text-muted-foreground">Articles</span>
                </div>
                <div className="mt-2 text-2xl font-bold">24</div>
                <div className="text-xs text-muted-foreground">+12% ce mois</div>
              </div>

              <div className="bg-card border rounded-lg p-6">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-green-500" />
                  <span className="text-sm font-medium text-muted-foreground">Utilisateurs</span>
                </div>
                <div className="mt-2 text-2xl font-bold">1,234</div>
                <div className="text-xs text-muted-foreground">+8% ce mois</div>
              </div>

              <div className="bg-card border rounded-lg p-6">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-orange-500" />
                  <span className="text-sm font-medium text-muted-foreground">Vues</span>
                </div>
                <div className="mt-2 text-2xl font-bold">45,678</div>
                <div className="text-xs text-muted-foreground">+23% ce mois</div>
              </div>

              <div className="bg-card border rounded-lg p-6">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-purple-500" />
                  <span className="text-sm font-medium text-muted-foreground">Revenus</span>
                </div>
                <div className="mt-2 text-2xl font-bold">€2,456</div>
                <div className="text-xs text-muted-foreground">+15% ce mois</div>
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
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Nouvel article publié</p>
                      <p className="text-xs text-muted-foreground">Il y a 2 heures</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Nouveau commentaire</p>
                      <p className="text-xs text-muted-foreground">Il y a 4 heures</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Nouveau paiement</p>
                      <p className="text-xs text-muted-foreground">Il y a 6 heures</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-card border rounded-lg p-6">
                <h3 className="font-semibold mb-4">Sécurité</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Tentatives d'intrusion</span>
                    <span className="text-sm font-medium text-red-500">3</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">IPs bloquées</span>
                    <span className="text-sm font-medium text-orange-500">1</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Dernière connexion</span>
                    <span className="text-sm font-medium text-green-500">Maintenant</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
} 