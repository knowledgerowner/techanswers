"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Menu,
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  Shield,
  User,
  Mail,
  Calendar,
  Filter,
  MoreHorizontal,
  Crown,
  AlertTriangle,
} from "lucide-react";
import { useAuth } from "@/lib/hooks/useAuth";

interface Admin {
  id: string;
  username: string;
  email: string;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  createdAt: Date;
  articleCount: number;
  commentCount: number;
  lastLogin?: Date;
}

export default function AdminsPage() {
  const [, setSidebarOpen] = useState(false);
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  });
  const [filters, setFilters] = useState({
    search: ""
  });
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && (!user || !(user as any).isSuperAdmin)) { // eslint-disable-line @typescript-eslint/no-explicit-any
      router.push("/admin/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    // Attendre que l'authentification soit complètement chargée
    if (!authLoading && user && (user as any).isSuperAdmin) { // eslint-disable-line @typescript-eslint/no-explicit-any
      loadAdmins();
    }
  }, [user, authLoading, pagination.page, filters]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadAdmins = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        search: filters.search,
        role: "admin" // Filtrer uniquement les admins
      });

      const response = await fetch(`/api/admin/users?${params}`);
      if (response.ok) {
        const data = await response.json();
        setAdmins(data.users);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des administrateurs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRevokeAdmin = async (adminId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir révoquer les droits administrateur de cet utilisateur ?")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/users/${adminId}/toggle-admin`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isAdmin: false }),
      });

      if (response.ok) {
        loadAdmins();
      } else {
        const data = await response.json();
        alert(data.error || "Erreur lors de la révocation des droits");
      }
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur lors de la révocation des droits");
    }
  };

  const handleDeleteAdmin = async (adminId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet administrateur ? Cette action est irréversible.")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/users/${adminId}`, {
        method: "DELETE"
      });

      if (response.ok) {
        loadAdmins();
      } else {
        const data = await response.json();
        alert(data.error || "Erreur lors de la suppression de l'administrateur");
      }
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur lors de la suppression de l'administrateur");
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!user || !(user as any).isSuperAdmin) { // eslint-disable-line @typescript-eslint/no-explicit-any
    return null;
  }

  return (
    <div className="flex h-screen bg-background">

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
              <Mail className="h-4 w-4" />
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
                  <Shield className="mr-2 h-4 w-4" />
                  <span>Paramètres</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto p-6">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold">Administrateurs</h1>
                <p className="text-muted-foreground">
                  Gérez les administrateurs de votre plateforme
                </p>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => router.push("/admin/dashboard/users")}
                >
                  <User className="mr-2 h-4 w-4" />
                  Tous les utilisateurs
                </Button>
                <Button onClick={() => router.push("/admin/dashboard/users/new")}>
                  <Plus className="mr-2 h-4 w-4" />
                  Nouvel administrateur
                </Button>
              </div>
            </div>

            {/* Avertissement */}
            <Card className="mb-6 border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950/20">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  <div>
                    <h3 className="font-semibold text-orange-800 dark:text-orange-200">
                      Gestion des administrateurs
                    </h3>
                    <p className="text-sm text-orange-700 dark:text-orange-300">
                      Les administrateurs ont accès à toutes les fonctionnalités du panel d&apos;administration. 
                      Soyez prudent lors de la gestion des droits d&apos;accès.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Filtres */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filtres
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Recherche</label>
                    <Input
                      placeholder="Rechercher par nom ou email..."
                      value={filters.search}
                      onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Table des administrateurs */}
            <Card>
              <CardHeader>
                <CardTitle>Liste des administrateurs</CardTitle>
                <CardDescription>
                  {pagination.total} administrateur{pagination.total > 1 ? 's' : ''} au total
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Administrateur</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Activité</TableHead>
                      <TableHead>Date de promotion</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {admins.map((admin) => (
                      <TableRow key={admin.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={`/avatars/${admin.username.charAt(0).toLowerCase()}.png`} />
                              <AvatarFallback>{admin.username.charAt(0).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{admin.username}</div>
                              <div className="text-sm text-muted-foreground">ID: {admin.id}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            {admin.email}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {admin.isSuperAdmin ? (
                              <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
                                <Crown className="mr-1 h-3 w-3" />
                                Super Admin
                              </Badge>
                            ) : (
                              <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">
                                <Shield className="mr-1 h-3 w-3" />
                                Admin
                              </Badge>
                            )}
                            {admin.id === user.id && (
                              <Badge variant="outline" className="text-xs">
                                Vous
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{admin.articleCount} article{admin.articleCount > 1 ? 's' : ''}</div>
                            <div>{admin.commentCount} commentaire{admin.commentCount > 1 ? 's' : ''}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            {new Date(admin.createdAt).toLocaleDateString('fr-FR')}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => router.push(`/admin/dashboard/users/${admin.id}`)}>
                                <Eye className="mr-2 h-4 w-4" />
                                Voir le profil
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => router.push(`/admin/dashboard/users/${admin.id}/edit`)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Modifier
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onClick={() => handleRevokeAdmin(admin.id)}
                                className="text-orange-600"
                                disabled={admin.id === user.id}
                              >
                                <Shield className="mr-2 h-4 w-4" />
                                Révoquer admin
                                {admin.id === user.id && (
                                  <span className="ml-2 text-xs">(vous-même)</span>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onClick={() => handleDeleteAdmin(admin.id)}
                                className="text-red-600"
                                disabled={admin.id === user.id}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Supprimer
                                {admin.id === user.id && (
                                  <span className="ml-2 text-xs">(vous-même)</span>
                                )}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {/* Pagination */}
                {pagination.pages > 1 && (
                  <div className="flex items-center justify-between mt-4">
                    <div className="text-sm text-muted-foreground">
                      Page {pagination.page} sur {pagination.pages}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={pagination.page === 1}
                        onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                      >
                        Précédent
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={pagination.page === pagination.pages}
                        onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                      >
                        Suivant
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
} 