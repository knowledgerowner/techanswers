"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Bell } from "lucide-react";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    notificationConsent: false,
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
          notificationConsent: formData.notificationConsent,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        router.push("/login?message=Compte créé avec succès");
      } else {
        setError(data.error || "Erreur lors de l'inscription");
      }
    } catch (error) {
      console.error("Erreur:", error);
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
            Rejoignez notre communauté tech
          </p>
        </div>

        <div className="bg-card border rounded-lg p-6 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="text-red-500 text-sm bg-red-50 dark:bg-red-950/20 p-3 rounded-md">
                {error}
              </div>
            )}

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

            {/* Consentement aux notifications */}
            <div className="space-y-3 p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-center space-x-3">
                <input
                  id="notificationConsent"
                  type="checkbox"
                  checked={formData.notificationConsent}
                  onChange={(e) =>
                    setFormData({ ...formData, notificationConsent: e.target.checked })
                  }
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <div className="flex items-center space-x-2">
                  <Bell className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <label htmlFor="notificationConsent" className="text-sm font-medium cursor-pointer">
                    Notifications
                  </label>
                </div>
              </div>
              <div className="ml-7 space-y-2">
                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                  Je consens à recevoir des notifications par email pour :
                </p>
                <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1 ml-3">
                  <li className="flex items-center space-x-2">
                    <Mail className="w-3 h-3" />
                    <span>Nouveaux articles publiés</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Mail className="w-3 h-3" />
                    <span>Réponses à mes commentaires</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Mail className="w-3 h-3" />
                    <span>Alertes de sécurité importantes</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Mail className="w-3 h-3" />
                    <span>Newsletter et actualités du site</span>
                  </li>
                </ul>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                  Vous pourrez modifier ces préférences à tout moment dans votre profil.
                </p>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? "Création en cours..." : "Créer le compte"}
            </Button>

            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Vous avez déjà un compte ?{" "}
                <Link href="/login" className="text-blue-600 hover:text-blue-500 dark:text-blue-400 font-medium">
                  Se connecter
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 