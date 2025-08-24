import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Construit l'URL de base de l'application de manière robuste
 * @param request - La requête Next.js (optionnel)
 * @returns L'URL de base avec le protocole
 */
export function getBaseUrl(request?: Request): string {
  // Priorité 1: Variables d'environnement
  if (process.env.NEXTAUTH_URL) {
    return process.env.NEXTAUTH_URL;
  }
  
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }
  
  // Priorité 2: Headers de la requête
  if (request) {
    const host = request.headers.get('host');
    const protocol = request.headers.get('x-forwarded-proto') || 'http';
    if (host) {
      return `${protocol}://${host}`;
    }
  }
  
  // Priorité 3: Fallback pour le développement
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3000';
  }
  
  // Priorité 4: Fallback générique
  return 'https://yourdomain.com';
}
