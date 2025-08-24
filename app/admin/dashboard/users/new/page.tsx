"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  Menu,
  ArrowLeft,
  Save,
  X,
  User,
  AlertCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import { useAuth } from "@/lib/hooks/useAuth";

export default function NewUserPage() {
  const [, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    isAdmin: false
  });
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && (!user || !(user as any).isSuperAdmin)) { // eslint-disable-line @typescript-eslint/no-explicit-any
      router.push("/admin/login");
    }
  }, [user, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          isAdmin: formData.isAdmin
        }),
      });

      const data = await response.json();

      if (response.ok) {
        router.push("/admin/dashboard/users");
      } else {
        setError(data.error || "Erreur lors de la création de l'utilisateur");
      }
    } catch (err) {
      console.error('Erreur lors de la création de l\'utilisateur:', err);
      setError("Erreur lors de la création de l'utilisateur");
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) {
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

          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/admin/dashboard/users")}
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
                <User className="h-6 w-6 text-blue-500" />
                <h1 className="text-3xl font-bold">Nouvel utilisateur</h1>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Informations de l&apos;utilisateur</CardTitle>
                  <CardDescription>
                    Créez un nouvel utilisateur pour votre plateforme
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Nom d'utilisateur */}
                    <div className="space-y-2">
                      <Label htmlFor="username">Nom d&apos;utilisateur *</Label>
                      <Input
                        id="username"
                        type="text"
                        required
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        placeholder="johndoe"
                      />
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="john@example.com"
                      />
                    </div>

                    {/* Mot de passe */}
                    <div className="space-y-2">
                      <Label htmlFor="password">Mot de passe *</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          required
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          placeholder="••••••••"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Le mot de passe doit contenir au moins 6 caractères
                      </p>
                    </div>

                    {/* Confirmation du mot de passe */}
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirmer le mot de passe *</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        required
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        placeholder="••••••••"
                      />
                    </div>

                    {/* Statut administrateur */}
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="isAdmin">Droits administrateur</Label>
                        <p className="text-sm text-muted-foreground">
                          Accorder les privilèges d&apos;administrateur à cet utilisateur
                        </p>
                      </div>
                      <Switch
                        id="isAdmin"
                        checked={formData.isAdmin}
                        onCheckedChange={(checked) => setFormData({ ...formData, isAdmin: checked })}
                      />
                    </div>

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
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Création...
                          </>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            Créer l&apos;utilisateur
                          </>
                        )}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.push("/admin/dashboard/users")}
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