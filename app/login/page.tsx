"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Shield, CheckCircle, RefreshCw } from "lucide-react";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying2FA, setIsVerifying2FA] = useState(false);
  const [isResendingCode, setIsResendingCode] = useState(false);
  const [error, setError] = useState("");
  const [requiresTwoFactor, setRequiresTwoFactor] = useState(false);
  const [twoFactorData, setTwoFactorData] = useState<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        if (data.requiresTwoFactor) {
          // 2FA requise
          setRequiresTwoFactor(true);
          setTwoFactorData(data);
          setError("");
        } else {
          // Connexion directe réussie
          window.location.href = "/";
        }
      } else {
        setError(data.error || "Email ou mot de passe incorrect");
      }
    } catch (err) {
      console.error('Erreur lors de la connexion:', err);
      setError("Erreur de connexion");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTwoFactorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying2FA(true);
    setError("");

    try {
      const response = await fetch('/api/auth/2fa/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: twoFactorData.userId,
          code: twoFactorCode
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Connexion 2FA réussie
        window.location.href = "/";
      } else {
        setError(data.error || "Code de vérification incorrect");
      }
    } catch (err) {
      console.error('Erreur lors de la vérification 2FA:', err);
      setError("Erreur de vérification");
    } finally {
      setIsVerifying2FA(false);
    }
  };

  const handleResendCode = async () => {
    try {
      setIsResendingCode(true);
      setError(""); // Effacer les erreurs précédentes
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok && data.requiresTwoFactor) {
        setTwoFactorData(data);
        setError("");
        // Afficher un message de succès temporaire
        const successMessage = document.createElement('div');
        successMessage.className = 'text-green-600 text-sm bg-green-50 dark:bg-green-950/20 p-3 rounded-md mb-4';
        successMessage.textContent = '✅ Nouveau code envoyé à votre email';
        
        // Insérer le message avant le formulaire
        const form = document.querySelector('form');
        if (form) {
          form.parentNode?.insertBefore(successMessage, form);
          
          // Supprimer le message après 3 secondes
          setTimeout(() => {
            successMessage.remove();
          }, 3000);
        }
      } else {
        setError(data.error || "Erreur lors de l'envoi du code");
      }
    } catch (err) {
      console.error('Erreur lors de l\'envoi du code:', err);
      setError("Erreur lors de l'envoi du code");
    } finally {
      setIsResendingCode(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground">Connexion</h1>
          <p className="mt-2 text-muted-foreground">
            Connectez-vous à votre compte
          </p>
        </div>

        <div className="bg-card border rounded-lg p-6 space-y-6">
          {!requiresTwoFactor ? (
            // Formulaire de connexion initial
            <form onSubmit={handleSubmit} className="space-y-4">
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
                {isLoading ? "Connexion..." : "Se connecter"}
              </Button>

              <div className="text-center">
                <Link 
                  href="/forgot-password" 
                  className="text-sm text-muted-foreground hover:text-primary hover:underline"
                >
                  Mot de passe oublié ?
                </Link>
              </div>
            </form>
          ) : (
            // Formulaire de vérification 2FA
            <div className="space-y-6">
              <div className="text-center">
                <Shield className="h-12 w-12 mx-auto mb-4 text-blue-500" />
                <h2 className="text-xl font-semibold">Vérification requise</h2>
                <p className="text-sm text-muted-foreground mt-2">
                  Un code de vérification a été envoyé à <strong>{twoFactorData?.email}</strong>
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  ⏰ Le code expire dans 10 minutes
                </p>
              </div>

              <form onSubmit={handleTwoFactorSubmit} className="space-y-4">
                <div>
                  <label htmlFor="twoFactorCode" className="block text-sm font-medium text-foreground mb-2">
                    Code de vérification
                  </label>
                  <Input
                    id="twoFactorCode"
                    type="text"
                    required
                    value={twoFactorCode}
                    onChange={(e) => setTwoFactorCode(e.target.value)}
                    placeholder="000000"
                    maxLength={6}
                    className="w-full text-center text-lg tracking-widest"
                  />
                </div>

                {error && (
                  <div className="text-red-500 text-sm bg-red-50 dark:bg-red-950/20 p-3 rounded-md">
                    {error}
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    type="submit"
                    className="flex-1"
                    disabled={isVerifying2FA || twoFactorCode.length !== 6}
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    {isVerifying2FA ? "Vérification..." : "Vérifier"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleResendCode}
                    disabled={isResendingCode}
                    className="px-4"
                  >
                    <RefreshCw className={`h-4 w-4 ${isResendingCode ? 'animate-spin' : ''}`} />
                    {isResendingCode ? '' : 'Renvoyer'}
                  </Button>
                </div>
              </form>

              <div className="text-center">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setRequiresTwoFactor(false);
                    setTwoFactorCode("");
                    setError("");
                  }}
                  className="text-sm"
                >
                  ← Retour à la connexion
                </Button>
              </div>
            </div>
          )}

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Pas encore de compte ?{" "}
              <Link href="/register" className="text-primary hover:underline">
                Créer un compte
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 