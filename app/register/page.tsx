"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        router.push("/login?message=Compte créé avec succès");
      } else {
        setError(data.error || "Erreur lors de l'inscription");
      }
    } catch (err) { 
      console.error('Erreur lors de l\'inscription:', err);
      setError("Erreur lors de l'inscription");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground">Créer un compte</h1>
          <p className="mt-2 text-muted-foreground">
            Rejoignez notre communauté
          </p>
        </div>

        <div className="bg-card border rounded-lg p-6 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-foreground mb-2">
                Nom d&apos;utilisateur
              </label>
              <Input
                id="username"
                type="text"
                required
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                placeholder="votre_username"
                className="w-full"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                Email
              </label>
              <Input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="votre@email.com"
                className="w-full"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                Mot de passe
              </label>
              <Input
                id="password"
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                className="w-full"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground mb-2">
                Confirmer le mot de passe
              </label>
              <Input
                id="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                placeholder="••••••••"
                className="w-full"
              />
            </div>

            {error && (
              <div className="text-red-500 text-sm bg-red-50 dark:bg-red-950/20 p-3 rounded-md">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Création..." : "Créer le compte"}
            </Button>
          </form>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Déjà un compte ?{" "}
              <Link href="/login" className="text-primary hover:underline">
                Se connecter
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 