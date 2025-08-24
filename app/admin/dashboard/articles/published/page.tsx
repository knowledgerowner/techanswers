'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  MoreHorizontal,
  User,
  Tag,
  Star,
  DollarSign,
  FileText,
  ArrowLeft,
  ExternalLink
} from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';

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
}

export default function PublishedPage() {
  const router = useRouter();
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  });

  useEffect(() => {
    fetchPublished();
    fetchCategories();
  }, [pagination.page, searchTerm, selectedCategory]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchPublished = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        search: searchTerm,
        category: selectedCategory !== 'all' ? selectedCategory : '',
        status: 'published' // Seulement les articles publiés
      });

      const response = await fetch(`/api/admin/articles?${params}`);
      if (response.ok) {
        const data = await response.json();
        setArticles(data.articles);
        setPagination(prev => ({
          ...prev,
          total: data.pagination.total,
          pages: data.pagination.pages
        }));
      } else {
        toast.error('Erreur lors du chargement des articles publiés');
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors du chargement des articles publiés');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/admin/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des catégories:', error);
    }
  };

  const handleTogglePublish = async (articleId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/articles/${articleId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isPublished: !currentStatus,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setArticles(prev => 
          prev.map(article => 
            article.id === articleId 
              ? { ...article, isPublished: data.article.isPublished }
              : article
          )
        );
        
        if (!data.article.isPublished) {
          toast.success('Article dépublié avec succès');
          // Retirer l'article de la liste des articles publiés
          setArticles(prev => prev.filter(article => article.id !== articleId));
        } else {
          toast.success('Article publié avec succès');
        }
      } else {
        toast.error('Erreur lors de la mise à jour');
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const handleDeleteArticle = async (articleId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/articles/${articleId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Article supprimé avec succès');
        setArticles(prev => prev.filter(article => article.id !== articleId));
      } else {
        toast.error('Erreur lors de la suppression');
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  const getCategoryNames = (categoryIds: string[]) => {
    if (!categoryIds || !categories.length) return [];
    return categories
      .filter(cat => categoryIds.includes(cat.id))
      .map(cat => cat.name);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.user.username.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || 
                           article.categoryIds.includes(selectedCategory);
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={() => router.push('/admin/dashboard/articles')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour aux articles
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Articles publiés</h1>
            <p className="text-gray-600">Gérez vos articles en ligne</p>
          </div>
        </div>
        <Button onClick={() => router.push('/admin/dashboard/articles/new')}>
          <Plus className="mr-2 h-4 w-4" />
          Nouvel article
        </Button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total publiés</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pagination.total}</div>
            <p className="text-xs text-muted-foreground">
              Articles en ligne
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Premium</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {articles.filter(a => a.isPremium).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Articles premium
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Payants</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {articles.filter(a => a.isBilled).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Articles payants
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Marketing</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {articles.filter(a => a.isMarketing).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Articles marketing
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filtres */}
      <Card>
        <CardHeader>
          <CardTitle>Filtres et recherche</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Rechercher par titre, extrait ou auteur..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full md:w-48">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Toutes les catégories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table des articles publiés */}
      <Card>
        <CardHeader>
          <CardTitle>Articles publiés ({filteredArticles.length})</CardTitle>
          <CardDescription>
            Articles actuellement en ligne et visibles par les utilisateurs
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              <span className="ml-2">Chargement des articles...</span>
            </div>
          ) : filteredArticles.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun article publié</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || selectedCategory !== 'all' 
                  ? 'Aucun article publié ne correspond à vos critères de recherche.'
                  : 'Vous n\'avez pas encore d\'articles publiés.'
                }
              </p>
              {!searchTerm && selectedCategory === 'all' && (
                <div className="mt-6">
                  <Button onClick={() => router.push('/admin/dashboard/articles/new')}>
                    <Plus className="mr-2 h-4 w-4" />
                    Créer un article
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Titre</TableHead>
                    <TableHead>Auteur</TableHead>
                    <TableHead>Catégories</TableHead>
                    <TableHead>Options</TableHead>
                    <TableHead>Date de publication</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredArticles.map((article) => (
                    <TableRow key={article.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          {article.imageUrl && (
                            <Image
                              src={article.imageUrl}
                              alt={article.title}
                              className="w-10 h-10 object-cover rounded"
                              width={500}
                              height={500}
                            />
                          )}
                          <div>
                            <div className="font-medium">{article.title}</div>
                            {article.excerpt && (
                              <div className="text-sm text-gray-500 truncate max-w-xs">
                                {article.excerpt}
                              </div>
                            )}
                            <div className="text-xs text-gray-400 font-mono">
                              {article.slug}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">{article.user.username}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {getCategoryNames(article.categoryIds).map((name, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              <Tag className="mr-1 h-3 w-3" />
                              {name}
                            </Badge>
                          ))}
                          {getCategoryNames(article.categoryIds).length === 0 && (
                            <span className="text-xs text-gray-500">Aucune catégorie</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
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
                          {formatDate(article.updatedAt)}
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
                            <DropdownMenuItem onClick={() => window.open(`/articles/${article.slug}`, '_blank')}>
                              <ExternalLink className="mr-2 h-4 w-4" />
                              Voir en ligne
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => router.push(`/admin/dashboard/articles/${article.id}`)}>
                              <Eye className="mr-2 h-4 w-4" />
                              Voir détails
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => router.push(`/admin/dashboard/articles/${article.id}/edit`)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Modifier
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleTogglePublish(article.id, article.isPublished)}>
                              <EyeOff className="mr-2 h-4 w-4" />
                              Dépublier
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
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 