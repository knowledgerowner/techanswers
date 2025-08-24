"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { CustomMarkdownEditor } from "@/components/custom-markdown-editor";
import { useAutoSave } from "@/lib/hooks/useAutoSave";

import { 
  ArrowLeft,
  Save,
  Image as ImageIcon,
  Upload,
  X,
  Clock,
} from "lucide-react";
import { updateArticleSEO } from '@/lib/seo-utils';
import Image from "next/image";

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

export default function NewArticlePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [imageUrl, setImageUrl] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    isPublished: false,
    isMarketing: false,
    isPremium: false,
    isBilled: false,
    premiumPrice: 0,
    billedPrice: 0,
    seoTitle: "",
    seoDesc: "",
    seoKeywords: "",
    seoImg: "",
    categoryIds: [] as string[]
  });

  // Hook d'auto-sauvegarde
  const autoSave = useAutoSave(formData, {
    key: 'new-article-draft',
    delay: 3000, // Sauvegarde après 3 secondes d'inactivité
    enabled: true
  });

  // Restaurer les données sauvegardées au démarrage
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem('new-article-draft');
      if (saved) {
        const savedData = JSON.parse(saved);
        setFormData(prev => ({ ...prev, ...savedData }));
        if (savedData.imageUrl) {
          setImageUrl(savedData.imageUrl);
        }
        console.log('📱 [NEW ARTICLE] Données restaurées depuis l\'auto-sauvegarde:', savedData);
      }
    } catch (error) {
      console.error('Erreur lors de la restauration des données:', error);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Avertissement avant de quitter la page
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (autoSave.hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = 'Vous avez des modifications non sauvegardées. Êtes-vous sûr de vouloir quitter ?';
        return e.returnValue;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [autoSave.hasUnsavedChanges]);

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

  useEffect(() => {
    if (user) {
      loadCategories();
    }
  }, [user]);

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
        setFormData(prev => ({ ...prev, imageUrl: data.imageUrl }));
      } else {
        alert('Erreur lors de l\'upload de l\'image');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de l\'upload de l\'image');
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
    autoSave.markAsChanged();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch("/api/admin/articles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          imageUrl: imageUrl,
          seoImg: imageUrl // L'image SEO sera la même que l'image principale
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // Marquer comme sauvegardé et nettoyer le sessionStorage
        autoSave.markAsSaved();
        router.push(`/admin/dashboard/articles/${data.article.id}`);
      } else {
        const error = await response.json();
        alert(error.error || "Erreur lors de la création de l'article");
      }
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur lors de la création de l'article");
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

  return (
    <div className="flex h-screen bg-background">

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex h-[60px] items-center justify-between border-b bg-background px-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/admin/dashboard/articles")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour aux articles
          </Button>
          
          {/* Indicateur d'auto-sauvegarde */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {autoSave.isSaving && (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                <span>Sauvegarde...</span>
              </div>
            )}
            {autoSave.lastSaved && !autoSave.isSaving && (
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>Dernière sauvegarde: {autoSave.lastSaved.toLocaleTimeString()}</span>
              </div>
            )}
            {autoSave.hasUnsavedChanges && (
              <Badge variant="outline" className="text-orange-600 border-orange-600">
                Modifications non sauvegardées
              </Badge>
            )}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto admin-main-container">
          <div className="container mx-auto p-6 admin-page-content">
            <div className="mb-8">
              <h1 className="text-3xl font-bold">Nouvel article</h1>
              <p className="text-muted-foreground">
                Créez un nouvel article pour votre blog
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Informations de base */}
              <Card>
                <CardHeader>
                  <CardTitle>Informations de base</CardTitle>
                  <CardDescription>
                    Titre, slug et contenu principal de l&apos;article
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="title">Titre *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      placeholder="Titre de l'article"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="slug">Slug *</Label>
                    <Input
                      id="slug"
                      value={formData.slug}
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, slug: e.target.value }));
                        autoSave.markAsChanged();
                      }}
                      placeholder="slug-de-larticle"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="excerpt">Extrait</Label>
                    <Textarea
                      id="excerpt"
                      value={formData.excerpt}
                      onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                      placeholder="Court résumé de l'article"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label>Contenu *</Label>
                    <CustomMarkdownEditor
                      value={formData.content}
                      onChange={(value) => {
                        setFormData(prev => ({ ...prev, content: value }));
                        autoSave.markAsChanged();
                      }}
                      placeholder="Contenu de l'article en markdown..."
                      height={500}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Image et catégories */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Image principale</CardTitle>
                    <CardDescription>
                      Image d&apos;en-tête de l&apos;article
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {imageUrl ? (
                      <div className="relative">
                        <Image
                          src={imageUrl}
                          alt="Image de l'article"
                          className="w-full h-48 object-cover rounded-lg"
                          width={500}
                          height={500}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="absolute top-2 right-2 bg-red-500 text-white hover:bg-red-600"
                          onClick={() => setImageUrl("")}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div 
                        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer"
                        onClick={() => document.getElementById('image-upload')?.click()}
                        onDragOver={(e) => {
                          e.preventDefault();
                          e.currentTarget.classList.add('border-primary');
                        }}
                        onDragLeave={(e) => {
                          e.preventDefault();
                          e.currentTarget.classList.remove('border-primary');
                        }}
                        onDrop={(e) => {
                          e.preventDefault();
                          e.currentTarget.classList.remove('border-primary');
                          const file = e.dataTransfer.files[0];
                          if (file && file.type.startsWith('image/')) {
                            handleImageUpload(file);
                          }
                        }}
                      >
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="mt-4">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleImageUpload(file);
                            }}
                            className="hidden"
                            id="image-upload"
                          />
                          <Button type="button" variant="outline">
                            <ImageIcon className="mr-2 h-4 w-4" />
                            Choisir une image ou glisser-déposer
                          </Button>
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">
                          Formats acceptés: JPG, PNG, GIF, WebP
                        </p>
                      </div>
                    )}
                    {uploadingImage && (
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                        <p className="text-sm text-muted-foreground mt-2">Upload en cours...</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Catégories</CardTitle>
                    <CardDescription>
                      Sélectionnez les catégories de l&apos;article
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      {categories.map((category) => (
                        <div key={category.id} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={category.id}
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
                          <Label htmlFor={category.id} className="text-sm">
                            {category.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Options de publication */}
              <Card>
                <CardHeader>
                  <CardTitle>Options de publication</CardTitle>
                  <CardDescription>
                    Configurez le statut et les options de l&apos;article
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        <Label>Marketing</Label>
                        <p className="text-sm text-muted-foreground">
                          Article mis en avant
                        </p>
                      </div>
                      <Switch
                        checked={formData.isMarketing}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isMarketing: checked }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Premium</Label>
                        <p className="text-sm text-muted-foreground">
                          Article payant
                        </p>
                      </div>
                      <Switch
                        checked={formData.isPremium}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isPremium: checked }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Backlink payant</Label>
                        <p className="text-sm text-muted-foreground">
                          Article sponsorisé (Getfluence)
                        </p>
                      </div>
                      <Switch
                        checked={formData.isBilled}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isBilled: checked }))}
                      />
                    </div>
                  </div>

                  {(formData.isPremium || formData.isBilled) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {formData.isPremium && (
                        <div>
                          <Label htmlFor="premiumPrice">Prix premium (€)</Label>
                          <Input
                            id="premiumPrice"
                            type="number"
                            step="0.01"
                            min="0"
                            value={formData.premiumPrice}
                            onChange={(e) => setFormData(prev => ({ ...prev, premiumPrice: parseFloat(e.target.value) || 0 }))}
                            placeholder="0.00"
                          />
                        </div>
                      )}
                      {formData.isBilled && (
                        <div>
                          <Label htmlFor="billedPrice">Prix backlink (€)</Label>
                          <Input
                            id="billedPrice"
                            type="number"
                            step="0.01"
                            min="0"
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
              <div className="flex justify-between items-center">
                {/* Bouton de sauvegarde manuelle */}
                <Button
                  type="button"
                  variant="outline"
                  onClick={autoSave.saveNow}
                  disabled={autoSave.isSaving}
                  className="flex items-center gap-2"
                >
                  {autoSave.isSaving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                      Sauvegarde...
                    </>
                  ) : (
                    <>
                      <Clock className="h-4 w-4" />
                      Sauvegarder maintenant
                    </>
                  )}
                </Button>

                {/* Boutons principaux */}
                <div className="flex space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push("/admin/dashboard/articles")}
                  >
                    Annuler
                  </Button>
                  <Button type="submit" disabled={saving}>
                    {saving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Création...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Créer l&apos;article
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
} 