'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  User, 
  Settings, 
  CreditCard, 
  Bell, 
  Shield, 
  ChevronLeft,
  Menu,
} from 'lucide-react';
import { useAuth } from '@/lib/hooks/useAuth';

interface SidebarItem {
  title: string;
  label?: string;
  icon: React.ComponentType<{ className?: string }>;
  variant: 'default' | 'ghost';
  href: string;
}

const sidebarItems: SidebarItem[] = [
  {
    title: 'Profil',
    label: 'Gérez votre profil public',
    icon: User,
    variant: 'default',
    href: '/profile',
  },
  {
    title: 'Paramètres',
    label: 'Modifiez vos informations',
    icon: Settings,
    variant: 'ghost',
    href: '/profile/settings',
  },
  {
    title: 'Facturation',
    label: 'Articles achetés et factures',
    icon: CreditCard,
    variant: 'ghost',
    href: '/profile/billing',
  },
  {
    title: 'Notifications',
    label: 'Préférences de notifications',
    icon: Bell,
    variant: 'ghost',
    href: '/profile/notifications',
  },
  {
    title: 'Sécurité',
    label: '2FA et sécurité du compte',
    icon: Shield,
    variant: 'ghost',
    href: '/profile/security',
  },
];

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Accès refusé</h1>
          <p className="text-muted-foreground mb-4">
            Vous devez être connecté pour accéder à cette page.
          </p>
          <Link href="/login">
            <Button>Se connecter</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-96 bg-card border-r transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex h-full flex-col px-2">


          {/* User Info */}
          <div className="border-b p-6">
            <div className="flex items-center space-x-3 w-fit mx-auto">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                {user.username.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-medium">{user.username}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Navigation Sidebar */}
          <ScrollArea className="flex-1 px-3 py-4">
            <nav className="space-y-1">
              {sidebarItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                      isActive 
                        ? "bg-accent text-accent-foreground" 
                        : "text-muted-foreground"
                    )}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon className="h-4 w-4" />
                    <div className="flex-1">
                      <span>{item.title}</span>
                      {item.label && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {item.label}
                        </p>
                      )}
                    </div>
                  </Link>
                );
              })}
            </nav>
          </ScrollArea>

          {/* Footer Sidebar */}
          <div className="border-t p-4">
            <Link href="/">
              <Button variant="ghost" className="w-full justify-start">
                <ChevronLeft className="mr-2 h-4 w-4" />
                Retour au site
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Header */}
        <div className="lg:hidden border-b bg-card px-4 py-3">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-semibold">Profil</h1>
            <div className="w-10" /> {/* Spacer pour centrer le titre */}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6">
          {children}
        </div>
      </div>
    </div>
  );
} 