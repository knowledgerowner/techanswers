"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Sheet, 
  SheetContent, 
  SheetDescription, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from "@/components/ui/sheet";
import { Menu, User, LogOut, Settings, ChevronDown, CreditCard, Bell, Shield } from "lucide-react";
import { useAuth } from "@/lib/hooks/useAuth";
import Image from "next/image";
import PersistentNotificationBell from "./persistent-notification-bell";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isLoading, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Image src="/Logo.png" alt="TechAnswers" width={64} height={64} className="rounded-lg bg-transparent overflow-hidden"/>
              </div>
              <span className="text-xl font-bold">TechAnswers</span>
            </Link>
          </div>

          {/* Navigation Desktop */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
              Accueil
            </Link>
            <Link href="/articles" className="text-sm font-medium transition-colors hover:text-primary">
              Articles
            </Link>
            <Link href="/categories" className="text-sm font-medium transition-colors hover:text-primary">
              Catégories
            </Link>
            <Link href="/about" className="text-sm font-medium transition-colors hover:text-primary">
              À propos
            </Link>
            <Link href="/partners" className="text-sm font-medium transition-colors hover:text-primary">
              Partenaires
            </Link>
            <Link href="/contact" className="text-sm font-medium transition-colors hover:text-primary">
              Contact
            </Link>
          </div>

          {/* Actions Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {!isLoading && (
              <>
                {user ? (
                  <div className="flex items-center space-x-4">
                    {user.isAdmin && (
                      <Link href="/admin/dashboard">
                        <Badge className="bg-red-500 text-white hover:bg-red-600">
                          Admin
                        </Badge>
                      </Link>
                    )}
                    {user.isSuperAdmin && (
                      <Link href="/admin/dashboard">
                        <Badge className="bg-red-500 text-white hover:bg-red-600">
                          Super Admin
                        </Badge>
                      </Link>
                    )}
                    
                    {/* Notification Bell pour les notifications persistantes */}
                    <PersistentNotificationBell />
                    
                    {/* Menu utilisateur */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="flex items-center space-x-2">
                          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                            {user.username.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-sm font-medium">{user.username}</span>
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56" align="end">
                        <DropdownMenuLabel>Mon Compte</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        
                        <DropdownMenuItem asChild>
                          <Link href="/profile" className="flex items-center">
                            <User className="mr-2 h-4 w-4" />
                            Profil
                          </Link>
                        </DropdownMenuItem>
                        
                        <DropdownMenuItem asChild>
                          <Link href="/profile/settings" className="flex items-center">
                            <Settings className="mr-2 h-4 w-4" />
                            Paramètres
                          </Link>
                        </DropdownMenuItem>
                        
                        <DropdownMenuItem asChild>
                          <Link href="/profile/billing" className="flex items-center">
                            <CreditCard className="mr-2 h-4 w-4" />
                            Facturation
                          </Link>
                        </DropdownMenuItem>
                        
                        <DropdownMenuItem asChild>
                          <Link href="/profile/notifications" className="flex items-center">
                            <Bell className="mr-2 h-4 w-4" />
                            Notifications
                          </Link>
                        </DropdownMenuItem>
                        
                        <DropdownMenuItem asChild>
                          <Link href="/profile/security" className="flex items-center">
                            <Shield className="mr-2 h-4 w-4" />
                            Sécurité
                          </Link>
                        </DropdownMenuItem>
                        
                        <DropdownMenuSeparator />
                        
                        <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
                          <LogOut className="mr-2 h-4 w-4" />
                          Déconnexion
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Link href="/login">
                      <Button variant="ghost" size="sm">
                        Connexion
                      </Button>
                    </Link>
                    <Link href="/register">
                      <Button size="sm">
                        Inscription
                      </Button>
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Menu Mobile */}
          <div className="md:hidden">
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                  <SheetDescription>
                    Navigation principale du site
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-6 space-y-4">
                  <Link 
                    href="/" 
                    className="block text-sm font-medium transition-colors hover:text-primary"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Accueil
                  </Link>
                  <Link 
                    href="/articles" 
                    className="block text-sm font-medium transition-colors hover:text-primary"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Articles
                  </Link>
                  <Link 
                    href="/categories" 
                    className="block text-sm font-medium transition-colors hover:text-primary"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Catégories
                  </Link>
                  <Link 
                    href="/about" 
                    className="block text-sm font-medium transition-colors hover:text-primary"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    À propos
                  </Link>
                  <Link 
                    href="/partners" 
                    className="block text-sm font-medium transition-colors hover:text-primary"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Partenaires
                  </Link>
                  <Link 
                    href="/contact" 
                    className="block text-sm font-medium transition-colors hover:text-primary"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Contact
                  </Link>
                  <Link 
                    href="/profile" 
                    className="block text-sm font-medium transition-colors hover:text-primary"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Mon Profil
                  </Link>
                  
                  <div className="pt-4 border-t">
                    {!isLoading && (
                      <>
                        {user ? (
                          <div className="space-y-2">
                            {user.isAdmin && (
                              <Link href="/admin/dashboard" onClick={() => setIsMenuOpen(false)}>
                                <Badge className="bg-red-500 text-white hover:bg-red-600">
                                  Admin Dashboard
                                </Badge>
                              </Link>
                            )}
                            
                            {/* Notifications dans le menu mobile */}
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-muted-foreground">
                                Notifications
                              </span>
                              <PersistentNotificationBell />
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-muted-foreground">
                                {user.username}
                              </span>
                              <Button variant="ghost" size="sm" onClick={handleLogout}>
                                <LogOut className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                              <Button variant="ghost" className="w-full justify-start">
                                <User className="mr-2 h-4 w-4" />
                                Connexion
                              </Button>
                            </Link>
                            <Link href="/register" onClick={() => setIsMenuOpen(false)}>
                              <Button className="w-full justify-start">
                                Inscription
                              </Button>
                            </Link>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
} 