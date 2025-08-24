'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  Star, 
  DollarSign, 
  Calendar,
  User,
  Tag,
  ExternalLink,
  Copy,
  Check
} from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';

interface Article {
  id: string;
  title: string;
  content: string;
  slug: string;
  imageUrl?: string;
  excerpt?: string;
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

export default function ArticleViewPage() {
  const params = useParams();
  const router = useRouter();
  const [article, setArticle] = useState<Article | null>(null);
  const [categories, setCategories] = useState<any[]>([]); // eslint-disable-line @typescript-eslint/no-explicit-any
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchArticle();
      fetchCategories();
    }
  }, [params.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchArticle = async () => {
    try {
      const response = await fetch(`/api/admin/articles/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setArticle(data.article);
      } else {
        toast.error('Erreur lors du chargement de l\'article');
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors du chargement de l\'article');
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

  const handleDelete = async () => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/articles/${params.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Article supprimé avec succès');
        router.push('/admin/dashboard/articles');
      } else {
        toast.error('Erreur lors de la suppression');
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  const handleTogglePublish = async () => {
    if (!article) return;

    try {
      const response = await fetch(`/api/admin/articles/${params.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...article,
          isPublished: !article.isPublished,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setArticle(data.article);
        toast.success(
          data.article.isPublished 
            ? 'Article publié avec succès' 
            : 'Article dépublié avec succès'
        );
      } else {
        toast.error('Erreur lors de la mise à jour');
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('Lien copié dans le presse-papiers');
  };

  const getCategoryNames = () => {
    if (!article?.categoryIds || !categories.length) return [];
    return categories
      .filter(cat => article.categoryIds.includes(cat.id))
      .map(cat => cat.name);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Article non trouvé</h2>
          <p className="text-gray-600 mt-2">L&apos;article que vous recherchez n&apos;existe pas.</p>
          <Button 
            onClick={() => router.push('/admin/dashboard/articles')}
            className="mt-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour aux articles
          </Button>
        </div>
      </div>
    );
  }

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
            Retour
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-white">Vue de l&apos;article</h1>
            <p className="text-white">Gérez et visualisez les détails de l&apos;article</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={() => router.push(`/admin/dashboard/articles/${params.id}/edit`)}
          >
            <Edit className="mr-2 h-4 w-4" />
            Modifier
          </Button>
                     <Button
             variant={article.isPublished ? "outline" : "default"}
             onClick={handleTogglePublish}
           >
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
          </Button>
                     <Button
             variant="outline"
             onClick={handleDelete}
             className="text-red-600 hover:text-red-700 hover:bg-red-50"
           >
            <Trash2 className="mr-2 h-4 w-4" />
            Supprimer
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Aperçu</TabsTrigger>
          <TabsTrigger value="content">Contenu</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
          <TabsTrigger value="settings">Paramètres</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Informations générales */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Informations générales</span>
                                 <div className="flex items-center space-x-2">
                   <Badge variant={article.isPublished ? "default" : "outline"}>
                     {article.isPublished ? "Publié" : "Brouillon"}
                   </Badge>
                   {article.isPremium && (
                     <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                       <Star className="mr-1 h-3 w-3" />
                       Premium
                     </Badge>
                   )}
                   {article.isBilled && (
                     <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                       <DollarSign className="mr-1 h-3 w-3" />
                       Payant
                     </Badge>
                   )}
                 </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-300">Titre</label>
                  <p className="text-lg font-semibold text-white">{article.title}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-300">Slug</label>
                  <div className="flex items-center space-x-2">
                    <p className="text-sm text-gray-400 font-mono">{article.slug}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(`${window.location.origin}/articles/${article.slug}`)}
                    >
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-300">Auteur</label>
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <p className="text-white">{article.user.username}</p>
                    <span className="text-gray-400">({article.user.email})</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-300">Catégories</label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {getCategoryNames().map((name, index) => (
                      <Badge key={index} variant="outline">
                        <Tag className="mr-1 h-3 w-3" />
                        {name}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-300">Créé le</label>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <p className="text-white">
                      {new Date(article.createdAt).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-300">Modifié le</label>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <p className="text-white">
                      {new Date(article.updatedAt).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>
              </div>

              {article.excerpt && (
                <div>
                  <label className="text-sm font-medium text-gray-300">Extrait</label>
                  <p className="text-white mt-1">{article.excerpt}</p>
                </div>
              )}

              {article.imageUrl && (
                <div>
                  <label className="text-sm font-medium text-gray-300">Image</label>
                  <div className="mt-2">
                    <Image
                      src={article.imageUrl}
                      alt={article.title}
                      className="w-32 h-32 object-cover rounded-lg"
                      width={500}
                      height={500}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Liens rapides */}
          <Card>
            <CardHeader>
              <CardTitle>Liens rapides</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  onClick={() => window.open(`/articles/${article.slug}`, '_blank')}
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Voir l&apos;article
                </Button>
                <Button
                  variant="outline"
                  onClick={() => copyToClipboard(`${window.location.origin}/articles/${article.slug}`)}
                >
                  {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
                  Copier le lien
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contenu de l&apos;article</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <div 
                  className="text-white prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: article.content }}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seo" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres SEO</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-300">Titre SEO</label>
                <p className="text-white mt-1">{article.seoTitle || 'Non défini'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-300">Description SEO</label>
                <p className="text-white mt-1">{article.seoDesc || 'Non définie'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-300">Mots-clés SEO</label>
                <p className="text-white mt-1">{article.seoKeywords || 'Non définis'}</p>
              </div>
                              {article.seoImg && (
                  <div>
                    <label className="text-sm font-medium text-gray-300">Image SEO</label>
                  <div className="mt-2">
                    <Image
                      src={article.seoImg}
                      alt="SEO"
                      className="w-32 h-32 object-cover rounded-lg"
                      width={500}
                      height={500}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres de l&apos;article</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium text-white">Marketing</p>
                    <p className="text-sm text-gray-400">Article de marketing</p>
                  </div>
                                     <Badge variant={article.isMarketing ? "default" : "outline"}>
                     {article.isMarketing ? "Oui" : "Non"}
                   </Badge>
                 </div>
                 <div className="flex items-center justify-between p-3 border rounded-lg">
                                     <div>
                    <p className="font-medium text-white">Premium</p>
                    <p className="text-sm text-gray-400">Contenu premium</p>
                  </div>
                   <Badge variant={article.isPremium ? "default" : "outline"}>
                     {article.isPremium ? "Oui" : "Non"}
                   </Badge>
                 </div>
                 <div className="flex items-center justify-between p-3 border rounded-lg">
                                     <div>
                    <p className="font-medium text-white">Payant</p>
                    <p className="text-sm text-gray-400">Article payant</p>
                  </div>
                   <Badge variant={article.isBilled ? "default" : "outline"}>
                     {article.isBilled ? "Oui" : "Non"}
                   </Badge>
                 </div>
                 <div className="flex items-center justify-between p-3 border rounded-lg">
                                     <div>
                    <p className="font-medium text-white">Auto</p>
                    <p className="text-sm text-gray-400">Génération automatique</p>
                  </div>
                   <Badge variant={article.isAuto ? "default" : "outline"}>
                     {article.isAuto ? "Oui" : "Non"}
                   </Badge>
                </div>
              </div>

              {article.isPremium && article.premiumPrice && (
                <div className="p-3 border rounded-lg">
                  <p className="font-medium text-white">Prix premium</p>
                  <p className="text-2xl font-bold text-green-400">
                    {article.premiumPrice}€
                  </p>
                </div>
              )}

              {article.isBilled && article.billedPrice && (
                <div className="p-3 border rounded-lg">
                  <p className="font-medium text-white">Prix payant</p>
                  <p className="text-2xl font-bold text-green-400">
                    {article.billedPrice}€
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 