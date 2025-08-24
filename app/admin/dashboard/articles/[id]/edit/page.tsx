'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { CustomMarkdownEditor } from '@/components/custom-markdown-editor';

import { 
  ArrowLeft,
  Save,
  Eye,
  Upload,
  X,
} from 'lucide-react';
import { toast } from 'sonner';
import { updateArticleSEO } from '@/lib/seo-utils';
import Image from 'next/image';

interface User {
  id: string; 
  username: string;
  email: string;
  isAdmin: boolean;
  isSuperAdmin: boolean;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
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

export default function EditArticlePage() {
  const params = useParams();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [article, setArticle] = useState<Article | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    isPublished: false,
    isMarketing: false,
    isPremium: false,
    isBilled: false,
    premiumPrice: 0,
    billedPrice: 0,
    isAuto: false,
    seoTitle: '',
    seoDesc: '',
    seoKeywords: '',
    seoImg: '',
    categoryIds: [] as string[]
  });

  useEffect(() => {
    checkAuth();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (user && params.id) {
      loadArticle();
      loadCategories();
    }
  }, [user, params.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadArticle = async () => {
    try {
      const { id } = await params;
      const response = await fetch(`/api/admin/articles/${id}`);
      if (response.ok) {
        const data = await response.json();
        const articleData = data.article;
        setArticle(articleData);
        setImageUrl(articleData.imageUrl || '');
        
        // Remplir le formulaire avec les données existantes
        setFormData({
          title: articleData.title || '',
          slug: articleData.slug || '',
          content: articleData.content || '',
          excerpt: articleData.excerpt || '',
          isPublished: articleData.isPublished || false,
          isMarketing: articleData.isMarketing || false,
          isPremium: articleData.isPremium || false,
          isBilled: articleData.isBilled || false,
          premiumPrice: articleData.premiumPrice || 0,
          billedPrice: articleData.billedPrice || 0,
          isAuto: articleData.isAuto || false,
          seoTitle: articleData.seoTitle || '',
          seoDesc: articleData.seoDesc || '',
          seoKeywords: articleData.seoKeywords || '',
          seoImg: articleData.seoImg || '',
          categoryIds: articleData.categoryIds || []
        });
      } else {
        toast.error('Erreur lors du chargement de l\'article');
        router.push('/admin/dashboard/articles');
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors du chargement de l\'article');
      router.push('/admin/dashboard/articles');
    }
  };

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const userData = await response.json();
        if (userData.isAdmin || userData.isSuperAdmin) {
          setUser(userData);
        } else {
          router.push('/admin/login');
        }
      } else {
        router.push('/admin/login');
      }
    } catch (error) {
      console.error('Erreur:', error);
      router.push('/admin/login');
    } finally {
      setLoading(false);
    }
  };



  const loadCategories = async () => {
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

  // Mettre à jour automatiquement les métadonnées SEO à chaque changement
  useEffect(() => {
    if (formData.title && formData.content) {
      const updatedFormData = updateArticleSEO({
        ...formData,
        imageUrl
      });
      
      // Mettre à jour les champs SEO automatiquement
      setFormData(prev => ({
        ...prev,
        seoTitle: updatedFormData.seoTitle,
        seoDesc: updatedFormData.seoDesc,
        seoKeywords: updatedFormData.seoKeywords,
        seoImg: updatedFormData.seoImg
      }));
    }
  }, [formData.title, formData.content, formData.excerpt, imageUrl]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleImageUpload = async (file: File) => {
    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('/api/admin/upload-image', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setImageUrl(data.imageUrl);
      } else {
        toast.error('Erreur lors de l\'upload de l\'image');
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de l\'upload de l\'image');
    } finally {
      setUploadingImage(false);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[éèê]/g, 'e')
      .replace(/[àâ]/g, 'a')
      .replace(/[ùû]/g, 'u')
      .replace(/[ôö]/g, 'o')
      .replace(/[îï]/g, 'i')
      .replace(/[ç]/g, 'c')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({ 
      ...prev, 
      title,
      slug: generateSlug(title)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { id } = await params;
      const response = await fetch(`/api/admin/articles/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          imageUrl: imageUrl,
          seoImg: imageUrl // L'image SEO sera la même que l'image principale
        }),
      });

      if (response.ok) {
        toast.success('Article mis à jour avec succès');
        router.push(`/admin/dashboard/articles/${id}`);
      } else {
        const error = await response.json();
        toast.error(error.error || 'Erreur lors de la mise à jour de l\'article');
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de la mise à jour de l\'article');
    } finally {
      setSaving(false);
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

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
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
    <div className="admin-page-content">
      <div className="admin-main-container">
        <main className="p-8 admin-layout-container">
          {/* En-tête */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={async () => {
                  const { id } = await params;
                  router.push(`/admin/dashboard/articles/${id}`);
                }}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour à l&apos;article
              </Button>
              <div>
                <h1 className="text-3xl font-bold">Modifier l&apos;article</h1>
                <p className="text-muted-foreground">
                  Modifiez les détails de votre article
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={async () => {
                  const { id } = await params;
                  router.push(`/admin/dashboard/articles/${id}`);
                }}
              >
                <Eye className="mr-2 h-4 w-4" />
                Voir l&apos;article
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={saving}
              >
                <Save className="mr-2 h-4 w-4" />
                {saving ? 'Sauvegarde...' : 'Sauvegarder'}
              </Button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Informations de base */}
            <Card>
              <CardHeader>
                <CardTitle>Informations de base</CardTitle>
                <CardDescription>
                  Titre, contenu et informations principales de l&apos;article
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Titre *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      placeholder="Titre de l'article"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="slug">Slug</Label>
                    <Input
                      id="slug"
                      value={formData.slug}
                      onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                      placeholder="url-de-larticle"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="excerpt">Extrait</Label>
                  <Textarea
                    id="excerpt"
                    value={formData.excerpt}
                    onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                    placeholder="Résumé court de l'article"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Contenu *</Label>
                  <CustomMarkdownEditor
                    value={formData.content}
                    onChange={(content: string) => setFormData(prev => ({ ...prev, content }))}
                    placeholder="Contenu de l'article en Markdown..."
                    height={500}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Image */}
            <Card>
              <CardHeader>
                <CardTitle>Image principale</CardTitle>
                <CardDescription>
                  Image d&apos;en-tête de l&apos;article
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {imageUrl && (
                  <div className="relative inline-block">
                    <Image
                      src={imageUrl}
                      alt="Image de l'article"
                      className="w-32 h-32 object-cover rounded-lg"
                      width={500}
                      height={500}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="absolute -top-2 -right-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => setImageUrl('')}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
                
                <div className="flex items-center space-x-4">
                  <input
                    type="file"
                    id="image-upload"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleImageUpload(file);
                      }
                    }}
                    className="hidden"
                  />
                  <label htmlFor="image-upload">
                    <Button
                      type="button"
                      variant="outline"
                      disabled={uploadingImage}
                      className="cursor-pointer"
                    >
                      {uploadingImage ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
                          Upload...
                        </>
                      ) : (
                        <>
                          <Upload className="mr-2 h-4 w-4" />
                          {imageUrl ? 'Changer l\'image' : 'Ajouter une image'}
                        </>
                      )}
                    </Button>
                  </label>
                </div>
              </CardContent>
            </Card>

            {/* Catégories */}
            <Card>
              <CardHeader>
                <CardTitle>Catégories</CardTitle>
                <CardDescription>
                  Sélectionnez les catégories de l&apos;article
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                  {categories.map((category) => (
                    <div key={category.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`category-${category.id}`}
                        checked={formData.categoryIds.includes(category.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData(prev => ({
                              ...prev,
                              categoryIds: [...prev.categoryIds, category.id]
                            }));
                          } else {
                            setFormData(prev => ({
                              ...prev,
                              categoryIds: prev.categoryIds.filter(id => id !== category.id)
                            }));
                          }
                        }}
                        className="rounded"
                      />
                      <Label htmlFor={`category-${category.id}`} className="text-sm">
                        {category.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Options de publication */}
            <Card>
              <CardHeader>
                <CardTitle>Options de publication</CardTitle>
                <CardDescription>
                  Configurez les paramètres de publication de l&apos;article
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Publié</Label>
                      <p className="text-sm text-muted-foreground">
                        Rendre l&apos;article visible publiquement
                      </p>
                    </div>
                    <Switch
                      checked={formData.isPublished}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isPublished: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Article marketing</Label>
                      <p className="text-sm text-muted-foreground">
                        Marquer comme article de marketing
                      </p>
                    </div>
                    <Switch
                      checked={formData.isMarketing}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isMarketing: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Contenu premium</Label>
                      <p className="text-sm text-muted-foreground">
                        Article réservé aux abonnés premium
                      </p>
                    </div>
                    <Switch
                      checked={formData.isPremium}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isPremium: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Article payant</Label>
                      <p className="text-sm text-muted-foreground">
                        Article à acheter séparément
                      </p>
                    </div>
                    <Switch
                      checked={formData.isBilled}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isBilled: checked }))}
                    />
                  </div>


                </div>

                {/* Prix */}
                {(formData.isPremium || formData.isBilled) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {formData.isPremium && (
                      <div className="space-y-2">
                        <Label htmlFor="premiumPrice">Prix premium (€)</Label>
                        <Input
                          id="premiumPrice"
                          type="number"
                          min="0"
                          step="0.01"
                          value={formData.premiumPrice}
                          onChange={(e) => setFormData(prev => ({ ...prev, premiumPrice: parseFloat(e.target.value) || 0 }))}
                          placeholder="0.00"
                        />
                      </div>
                    )}
                    {formData.isBilled && (
                      <div className="space-y-2">
                        <Label htmlFor="billedPrice">Prix payant (€)</Label>
                        <Input
                          id="billedPrice"
                          type="number"
                          min="0"
                          step="0.01"
                          value={formData.billedPrice}
                          onChange={(e) => setFormData(prev => ({ ...prev, billedPrice: parseFloat(e.target.value) || 0 }))}
                          placeholder="0.00"
                        />
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            

            {/* Actions */}
            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push(`/admin/dashboard/articles/${params.id}`)}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={saving}
              >
                <Save className="mr-2 h-4 w-4" />
                {saving ? 'Sauvegarde...' : 'Sauvegarder les modifications'}
              </Button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
} 