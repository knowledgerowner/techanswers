"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
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
  Tag,
  Plus,
  Edit,
  Trash2,
  MoreHorizontal,
  Filter,
} from "lucide-react";
import { useAuth } from "@/lib/hooks/useAuth";

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  articleCount: number;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  });
  const [filters, setFilters] = useState({
    search: ""
  });
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && (!user || (!user.isAdmin && !user.isSuperAdmin))) {
      router.push("/admin/login");
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user && (user.isAdmin || user.isSuperAdmin)) {
      loadCategories();
    }
  }, [user, pagination.page, filters]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadCategories = async () => {
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        search: filters.search
      });

      const response = await fetch(`/api/admin/categories?${params}`);
      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des catégories:", error);
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette catégorie ?")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/categories/${categoryId}`, {
        method: "DELETE"
      });

      if (response.ok) {
        loadCategories();
      } else {
        const data = await response.json();
        alert(data.error || "Erreur lors de la suppression de la catégorie");
      }
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur lors de la suppression de la catégorie");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!user || (!user.isAdmin && !user.isSuperAdmin)) {
    return null;
  }

  return (
    <div className="flex h-screen bg-background">

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
       

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto p-6">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold">Catégories</h1>
                <p className="text-muted-foreground">
                  Gérez les catégories de vos articles
                </p>
              </div>
              <Button onClick={() => router.push("/admin/dashboard/categories/new")}>
                <Plus className="mr-2 h-4 w-4" />
                Nouvelle catégorie
              </Button>
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Recherche</label>
                    <Input
                      placeholder="Rechercher dans les catégories..."
                      value={filters.search}
                      onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Table des catégories */}
            <Card>
              <CardHeader>
                <CardTitle>Liste des catégories</CardTitle>
                <CardDescription>
                  {pagination.total} catégorie{pagination.total > 1 ? 's' : ''} au total
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nom</TableHead>
                      <TableHead>Slug</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Articles</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {categories.map((category) => (
                      <TableRow key={category.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Tag className="h-4 w-4 text-blue-500" />
                            <span className="font-medium">{category.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <code className="text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                            {category.slug}
                          </code>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-muted-foreground max-w-xs truncate">
                            {category.description || "Aucune description"}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                            {category.articleCount} article{category.articleCount > 1 ? 's' : ''}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => router.push(`/admin/dashboard/categories/${category.id}`)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Modifier
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onClick={() => handleDeleteCategory(category.id)}
                                className="text-red-600"
                                disabled={category.articleCount > 0}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Supprimer
                                {category.articleCount > 0 && (
                                  <span className="ml-2 text-xs">(contient des articles)</span>
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