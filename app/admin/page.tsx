"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";

export default function AdminPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        // Utilisateur non connecté -> rediriger vers la page de connexion admin
        router.push("/admin/login");
      } else if (!user.isAdmin && !user.isSuperAdmin) {
        // Utilisateur connecté mais pas admin ni superadmin -> rediriger vers l'accueil
        router.push("/");
      } else {
        // Utilisateur admin ou superadmin -> rediriger vers le dashboard
        router.push("/admin/dashboard");
      }
    }
  }, [user, isLoading, router]);

  // Afficher un loader pendant la vérification
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-muted-foreground">Redirection...</p>
      </div>
    </div>
  );
} 