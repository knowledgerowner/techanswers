"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  FileText, 
  Bell, 
  User,
  Tag,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Star,
  MoreHorizontal,
  Filter,
  DollarSign
} from "lucide-react";



interface User {
  id: string;
  username: string;
  email: string;
  isAdmin: boolean;
  isSuperAdmin: boolean;
}

interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  imageUrl?: string;
  isPublished: boolean;
  isMarketing: boolean;
  isPremium: boolean;
  isBilled: boolean;
  premiumPrice?: number;
  billedPrice?: number;
  isAuto: boolean;
  seoTitle?: string;
  seoDesc?: string;
  seoKeywords?: string;
  seoImg?: string;
  categoryIds: string[];
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    username: string;
    email: string;
  };
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  articleCount: number;
}

export default function ArticlesPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    category: "all"
  });
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (user) {
      loadArticles();
      loadCategories();
    }
  }, [user, pagination.page, filters]); // eslint-disable-line react-hooks/exhaustive-deps

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/auth/me");
      if (response.ok) {
        const userData = await response.json();
        if (userData.isAdmin || userData.isSuperAdmin) {
          setUser(userData);
        } else {
          router.push("/admin/login");
        }
      } else {
        router.push("/admin/login");
      }
    } catch (error) {
      console.error("Erreur lors de la vérification de l'authentification:", error);
      router.push("/admin/login");
    } finally {
      setLoading(false);
    }
  };

  const loadArticles = async () => {
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        search: filters.search,
        status: filters.status,
        category: filters.category
      });

      const response = await fetch(`/api/admin/articles?${params}`);
      if (response.ok) {
        const data = await response.json();
        setArticles(data.articles);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des articles:", error);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await fetch("/api/admin/categories");
      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des catégories:", error);
    }
  };

  const handleDeleteArticle = async (articleId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet article ?")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/articles/${articleId}`, {
        method: "DELETE"
      });

      if (response.ok) {
        loadArticles();
      } else {
        alert("Erreur lors de la suppression de l'article");
      }
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur lors de la suppression de l'article");
    }
  };

  const handleTogglePublish = async (articleId: string, isPublished: boolean) => {
    try {
      const response = await fetch(`/api/admin/articles/${articleId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ isPublished: !isPublished })
      });

      if (response.ok) {
        loadArticles();
      } else {
        alert("Erreur lors de la modification du statut");
      }
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur lors de la modification du statut");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const getCategoryNames = (categoryIds: string[]) => {
    return categoryIds
      .map(id => categories.find(cat => cat.id === id)?.name)
      .filter(Boolean)
      .join(", ");
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

      {/* Main Content */}
      <div className="flex-1 flex flex-col">

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto p-6">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold">Articles</h1>
                <p className="text-muted-foreground">
                  Gérez vos articles et contenus
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => router.push("/admin/dashboard/articles/published")}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  Publiés
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => router.push("/admin/dashboard/articles/drafts")}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Brouillons
                </Button>
              <Button onClick={() => router.push("/admin/dashboard/articles/new")}>
                <Plus className="mr-2 h-4 w-4" />
                Nouvel article
              </Button>
              </div>
            </div>

            {/* Filtres */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filtres
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Recherche</label>
                    <Input
                      placeholder="Rechercher dans les articles..."
                      value={filters.search}
                      onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Statut</label>
                                         <Select value={filters.status} onValueChange={(value: string) => setFilters({ ...filters, status: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous</SelectItem>
                        <SelectItem value="published">Publiés</SelectItem>
                        <SelectItem value="draft">Brouillons</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Catégorie</label>
                                         <Select value={filters.category} onValueChange={(value: string) => setFilters({ ...filters, category: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Toutes les catégories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Toutes les catégories</SelectItem>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name} ({category.articleCount})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                {/* Bouton de test des notifications */}
                <div className="mt-4 pt-4 border-t">
                  <div className="flex items-center gap-2">
                    <Bell className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-muted-foreground">Test des notifications</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">
                    Testez le système de notifications pour les utilisateurs abonnés aux catégories sélectionnées
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={async () => {
                      const selectedCategory = filters.category;
                      if (selectedCategory === 'all') {
                        alert('Veuillez sélectionner une catégorie spécifique pour tester les notifications');
                        return;
                      }
                      
                      try {
                        const response = await fetch('/api/test/article-notification', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ categoryIds: [selectedCategory] })
                        });
                        
                        if (response.ok) {
                          const result = await response.json();
                          alert(`Test terminé !\n\nAbonnements trouvés: ${result.subscriptionsFound}\nUtilisateurs notifiés: ${result.users.length}\n\nVérifiez la console pour plus de détails.`);
                          console.log('🔍 [TEST] Résultat complet:', result);
                        } else {
                          const error = await response.json();
                          alert(`Erreur: ${error.error}`);
                        }
                      } catch (error) {
                        console.error('Erreur lors du test:', error);
                        alert('Erreur lors du test des notifications');
                      }
                    }}
                    disabled={filters.category === 'all'}
                  >
                    <Bell className="mr-2 h-4 w-4" />
                    Tester les notifications
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Table des articles */}
            <Card>
              <CardHeader>
                <CardTitle>Liste des articles</CardTitle>
                <CardDescription>
                  {pagination.total} article{pagination.total > 1 ? 's' : ''} au total
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Titre</TableHead>
                      <TableHead>Auteur</TableHead>
                      <TableHead>Catégories</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {articles.map((article) => (
                      <TableRow key={article.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{article.title}</div>
                            <div className="text-sm text-muted-foreground">{article.slug}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback className="text-xs">
                                {article.user.username.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm">{article.user.username}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {getCategoryNames(article.categoryIds).split(", ").map((category, index) => (
                              <Badge key={index} className="text-xs bg-gray-100 text-gray-800 hover:bg-gray-100">
                                {category}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {article.isPublished ? (
                              <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                                <Eye className="mr-1 h-3 w-3" />
                                Publié
                              </Badge>
                            ) : (
                              <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
                                <EyeOff className="mr-1 h-3 w-3" />
                                Brouillon
                              </Badge>
                            )}
                            {article.isMarketing && (
                              <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                                <Star className="mr-1 h-3 w-3" />
                                Marketing
                              </Badge>
                            )}
                            {article.isPremium && (
                              <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">
                                <DollarSign className="mr-1 h-3 w-3" />
                                Premium
                              </Badge>
                            )}
                            {article.isBilled && (
                              <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                                <Tag className="mr-1 h-3 w-3" />
                                Backlink
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-muted-foreground">
                            {formatDate(article.createdAt)}
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
                              <DropdownMenuItem onClick={() => router.push(`/admin/dashboard/articles/${article.id}`)}>
                                <Eye className="mr-2 h-4 w-4" />
                                Voir
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => router.push(`/admin/dashboard/articles/${article.id}/edit`)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Modifier
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleTogglePublish(article.id, article.isPublished)}>
                                {article.isPublished ? (
                                  <>
                                    <EyeOff className="mr-2 h-4 w-4" />
                                    Dépublier
                                  </>
                                ) : (
                                  <>
                                    <Eye className="mr-2 h-4 w-4" />
                                    Publier
                                  </>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onClick={() => handleDeleteArticle(article.id)}
                                className="text-red-600"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Supprimer
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