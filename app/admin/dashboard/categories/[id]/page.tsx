"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Menu,
  ArrowLeft,
  Save,
  X,
  Tag,
  AlertCircle,
  Loader2,
  Image as ImageIcon
} from "lucide-react";
import { useAuth } from "@/lib/hooks/useAuth";
import Image from "next/image";

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  seoTitle?: string;
  seoDesc?: string;
  seoKeywords?: string;
  seoImg?: string;
  articleCount: number;
}

export default function EditCategoryPage() {
  const [, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [error, setError] = useState("");
  const [category, setCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    seoTitle: "",
    seoDesc: "",
    seoKeywords: "",
    seoImg: ""
  });
  const [, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const router = useRouter();
  const params = useParams();
  const categoryId = params.id as string;
  const { user, isLoading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && (!user || (!user.isAdmin && !user.isSuperAdmin))) {
      router.push("/admin/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user && (user.isAdmin || user.isSuperAdmin) && categoryId) {
      loadCategory();
    }
  }, [user, categoryId]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadCategory = async () => {
    try {
      const response = await fetch(`/api/admin/categories/${categoryId}`);
      if (response.ok) {
        const data = await response.json();
        setCategory(data.category);
        setFormData({
          name: data.category.name,
          slug: data.category.slug,
          description: data.category.description || "",
          seoTitle: data.category.seoTitle || "",
          seoDesc: data.category.seoDesc || "",
          seoKeywords: data.category.seoKeywords || "",
          seoImg: data.category.seoImg || ""
        });
        setImagePreview(data.category.seoImg || "");
      } else {
        setError("Catégorie non trouvée");
      }
    } catch (error) {
      console.error("Erreur lors du chargement de la catégorie:", error);
      setError("Erreur lors du chargement de la catégorie");
    } finally {
      setIsLoadingData(false);
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  const handleImageUpload = async (file: File) => {
    setUploadingImage(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('/api/admin/upload-image', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Upload réussi:', data);
        setFormData(prev => ({ 
          ...prev, 
          seoImg: data.imageUrl || "",
          seoTitle: prev.seoTitle || prev.name || "",
          seoDesc: prev.seoDesc || prev.description || ""
        }));
        setImagePreview(data.imageUrl);
        setImageFile(null);
      } else {
        const error = await response.json();
        console.error('Erreur upload:', error);
        setError(error.error || 'Erreur lors de l\'upload de l\'image');
      }
    } catch (error) {
      console.error("Erreur lors de l'upload de l'image:", error);
      setError('Erreur lors de l\'upload de l\'image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      handleImageUpload(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setImageFile(file);
      handleImageUpload(file);
    }
  };

  const handleNameChange = (name: string) => {
    setFormData({
      ...formData,
      name,
      slug: generateSlug(name)
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/admin/categories/${categoryId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        router.push("/admin/dashboard/categories");
      } else {
        setError(data.error || "Erreur lors de la modification de la catégorie");
      }
    } catch (err) {
      console.error("Erreur lors de la modification de la catégorie:", err);
      setError("Erreur lors de la modification de la catégorie");
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading || isLoadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!user || (!user.isAdmin && !user.isSuperAdmin)) {
    return null;
  }

  if (error && !category) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-4" />
          <p className="text-red-600">{error}</p>
          <Button 
            onClick={() => router.push("/admin/dashboard/categories")}
            className="mt-4"
          >
            Retour aux catégories
          </Button>
        </div>
      </div>
    );
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

          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/admin/dashboard/categories")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour
            </Button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto p-6">
            <div className="max-w-2xl mx-auto">
              <div className="flex items-center gap-2 mb-6">
                <Tag className="h-6 w-6 text-blue-500" />
                <h1 className="text-3xl font-bold">Modifier la catégorie</h1>
              </div>

                             {category && (
                 <div className="mb-6">
                   <Badge variant="outline">
                     {category.articleCount} article{category.articleCount > 1 ? 's' : ''} dans cette catégorie
                   </Badge>
                 </div>
               )}

              <Card>
                <CardHeader>
                  <CardTitle>Informations de la catégorie</CardTitle>
                  <CardDescription>
                    Modifiez les informations de la catégorie
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Nom */}
                    <div className="space-y-2">
                      <Label htmlFor="name">Nom de la catégorie *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleNameChange(e.target.value)}
                        placeholder="Ex: Développement Web"
                        required
                      />
                    </div>

                    {/* Slug */}
                    <div className="space-y-2">
                      <Label htmlFor="slug">Slug *</Label>
                      <Input
                        id="slug"
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        placeholder="Ex: developpement-web"
                        required
                      />
                      <p className="text-sm text-muted-foreground">
                        Le slug sera utilisé dans l&apos;URL de la catégorie
                      </p>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Description de la catégorie (optionnel)"
                        rows={4}
                      />
                    </div>

                    {/* SEO */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Optimisation SEO</CardTitle>
                        <CardDescription>
                          Métadonnées pour le référencement
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <Label htmlFor="seoTitle">Titre SEO</Label>
                          <Input
                            id="seoTitle"
                            value={formData.seoTitle || ""}
                            onChange={(e) => setFormData(prev => ({ ...prev, seoTitle: e.target.value }))}
                            placeholder="Titre optimisé pour les moteurs de recherche"
                          />
                        </div>

                        <div>
                          <Label htmlFor="seoDesc">Description SEO</Label>
                          <Textarea
                            id="seoDesc"
                            value={formData.seoDesc || ""}
                            onChange={(e) => setFormData(prev => ({ ...prev, seoDesc: e.target.value }))}
                            placeholder="Description pour les moteurs de recherche"
                            rows={3}
                          />
                        </div>

                        <div>
                          <Label htmlFor="seoKeywords">Mots-clés SEO</Label>
                          <Input
                            id="seoKeywords"
                            value={formData.seoKeywords || ""}
                            onChange={(e) => setFormData(prev => ({ ...prev, seoKeywords: e.target.value }))}
                            placeholder="mot-clé1, mot-clé2, mot-clé3"
                          />
                        </div>

                        <div>
                          <Label htmlFor="seoImg">Image SEO (Open Graph & Réseaux sociaux)</Label>
                          <div className="space-y-4">
                            {/* Zone de drop pour l'image */}
                            <div
                              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                                uploadingImage
                                  ? 'border-blue-300 bg-blue-50 dark:bg-blue-950/20'
                                  : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500'
                              }`}
                              onDragOver={handleDragOver}
                              onDrop={handleDrop}
                              onClick={() => document.getElementById('image-upload-edit')?.click()}
                            >
                              {uploadingImage ? (
                                <div className="space-y-2">
                                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                                  <p className="text-sm text-blue-600 dark:text-blue-400">Upload en cours...</p>
                                </div>
                              ) : imagePreview ? (
                                <div className="space-y-2">
                                  <Image
                                    src={imagePreview}
                                    alt="Aperçu"
                                    className="w-32 h-32 object-cover rounded-lg mx-auto"
                                    width={500}
                                    height={500}
                                    onError={(e) => {
                                      console.error('Erreur chargement image:', e);
                                      setImagePreview("");
                                    }}
                                  />
                                  <p className="text-sm text-green-600 dark:text-green-400">✅ Image uploadée avec succès</p>
                                  <p className="text-xs text-gray-500 dark:text-gray-500">
                                    L&apos;URL sera automatiquement utilisée pour Open Graph et les réseaux sociaux
                                  </p>
                                  <p className="text-xs text-blue-600 dark:text-blue-400">
                                    URL: {imagePreview.substring(0, 50)}...
                                  </p>
                                </div>
                              ) : (
                                <div className="space-y-2">
                                  <ImageIcon className="h-8 w-8 text-gray-400 mx-auto" />
                                  <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Glissez-déposez une image ou cliquez pour sélectionner
                                  </p>
                                  <p className="text-xs text-gray-500 dark:text-gray-500">
                                    PNG, JPG, GIF jusqu&apos;à 10MB - Utilisée pour Open Graph et réseaux sociaux
                                  </p>
                                </div>
                              )}
                            </div>

                            {/* Input caché pour la sélection de fichier */}
                            <input
                              id="image-upload-edit"
                              type="file"
                              accept="image/*"
                              onChange={handleImageChange}
                              className="hidden"
                            />

                            {/* URL de l'image (cachée mais nécessaire pour le formulaire) */}
                            <input
                              type="hidden"
                              value={formData.seoImg || ""}
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Erreur */}
                    {error && (
                      <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-md">
                        <AlertCircle className="h-4 w-4 text-red-500" />
                        <span className="text-sm text-red-600 dark:text-red-400">{error}</span>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3 pt-4">
                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="flex-1"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Modification...
                          </>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            Modifier la catégorie
                          </>
                        )}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.push("/admin/dashboard/categories")}
                        disabled={isLoading}
                      >
                        <X className="mr-2 h-4 w-4" />
                        Annuler
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
} 