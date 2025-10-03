'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileText, Shield, CreditCard } from 'lucide-react';

const legalPages = [
  {
    title: 'Mentions légales',
    href: '/legal/terms',
    icon: FileText,
    description: 'Informations légales et coordonnées'
  },
  {
    title: 'Politique de confidentialité',
    href: '/legal/privacy',
    icon: Shield,
    description: 'Protection de vos données personnelles'
  },
  {
    title: 'Conditions générales de vente',
    href: '/legal/cgv',
    icon: CreditCard,
    description: 'Conditions d\'achat et de vente'
  }
];

interface LegalLayoutProps {
  children: React.ReactNode;
}

export default function LegalLayout({ children }: LegalLayoutProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header avec bouton retour */}
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour au site
            </Button>
          </Link>
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl font-bold mb-4">Informations légales</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Consultez nos documents légaux et nos politiques de confidentialité
            </p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-4">
          {/* Navigation sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardContent className="p-4">
                <h2 className="font-semibold mb-4 text-sm uppercase tracking-wide text-muted-foreground">
                  Navigation
                </h2>
                <nav className="space-y-2">
                  {legalPages.map((page) => {
                    const isActive = pathname === page.href;
                    const Icon = page.icon;
                    return (
                      <Link
                        key={page.href}
                        href={page.href}
                        className={cn(
                          "flex items-start space-x-3 rounded-lg p-3 text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
                          isActive 
                            ? "bg-accent text-accent-foreground" 
                            : "text-muted-foreground"
                        )}
                      >
                        <Icon className="h-4 w-4 mt-0.5 shrink-0" />
                        <div className="min-w-0">
                          <div className="font-medium">{page.title}</div>
                          <div className="text-xs text-muted-foreground mt-1 leading-relaxed">
                            {page.description}
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Contenu principal */}
          <div className="lg:col-span-3">
            <Card>
              <CardContent className="p-6 sm:p-8">
                {children}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer avec liens rapides */}
        <div className="mt-12 pt-8 border-t">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Des questions ? Contactez-nous
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/contact">
                <Button variant="outline" size="sm">
                  Nous contacter
                </Button>
              </Link>
              <Link href="mailto:legal@techanswers.fr">
                <Button variant="outline" size="sm">
                  legal@techanswers.fr
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
