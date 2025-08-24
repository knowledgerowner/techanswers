"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  BarChart3, 
  FileText, 
  Users, 
  Mail, 
  CreditCard, 
  Shield,
  TrendingUp,
  Tag,
  Newspaper,
  ChevronDown
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/lib/hooks/useAuth";

interface SidebarItem {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  items?: { title: string; href: string; disabled?: boolean }[];
  requiresSuperAdmin?: boolean;
}

interface AdminSidebarProps {
  className?: string;
}

export function AdminSidebar({ className }: AdminSidebarProps) {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const { user } = useAuth();

  const sidebarItems: SidebarItem[] = [
    {
      title: "Vue d'ensemble",
      icon: BarChart3,
      href: "/admin/dashboard",
      items: []
    },
    {
      title: "Articles",
      icon: FileText,
      href: "/admin/dashboard/articles",
      items: [
        { title: "Tous les articles", href: "/admin/dashboard/articles" },
        { title: "Articles publiés", href: "/admin/dashboard/articles/published" },
        { title: "Brouillons", href: "/admin/dashboard/articles/drafts" },
        { title: "Créer un article", href: "/admin/dashboard/articles/new" }
      ]
    },
    {
      title: "Catégories",
      icon: Tag,
      href: "/admin/dashboard/categories",
      items: [
        { title: "Gérer les catégories", href: "/admin/dashboard/categories" },
        { title: "Ajouter une catégorie", href: "/admin/dashboard/categories/new" }
      ]
    },
    {
      title: "Utilisateurs",
      icon: Users,
      href: "/admin/dashboard/users",
      requiresSuperAdmin: true,
      items: [
        { title: "Tous les utilisateurs", href: "/admin/dashboard/users" },
        { title: "Administrateurs", href: "/admin/dashboard/admins" }
      ]
    },
    {
      title: "Contacts",
      icon: Mail,
      href: "/admin/dashboard/contacts",
      items: [
        { title: "Demandes de contact", href: "/admin/dashboard/contacts" },
        { title: "Newsletter", href: "/admin/dashboard/newsletter", disabled: true }
      ]
    },
    {
      title: "Analytics",
      icon: TrendingUp,
      href: "/admin/dashboard/analytics",
      requiresSuperAdmin: true,
      items: [
        { title: "Vue d'ensemble", href: "/admin/dashboard/analytics" },
      ]
    },
    {
      title: "Paiements",
      icon: CreditCard,
      href: "/admin/dashboard/payments",
      requiresSuperAdmin: true,
      items: [
        { title: "Transactions", href: "/admin/dashboard/payments" },
        { title: "Rapports", href: "/admin/dashboard/payments/reports", disabled: true }
      ]
    },
    {
      title: "Sécurité",
      icon: Shield,
      href: "/admin/dashboard/security",
      items: [
        { title: "Tentatives de bruteforce", href: "/admin/dashboard/security/bruteforce" },
        { title: "Logs de sécurité", href: "/admin/dashboard/security/logs", disabled: true }
      ]
    }
  ];

  // Filtrer les éléments selon les permissions
  const filteredItems = sidebarItems.filter(item => {
    if (item.requiresSuperAdmin) {
      return user && (user as any).isSuperAdmin; // eslint-disable-line @typescript-eslint/no-explicit-any
    }
    return true;
  });

  const toggleExpanded = (title: string) => {
    setExpandedItems(prev => 
      prev.includes(title) 
        ? prev.filter(item => item !== title)
        : [...prev, title]
    );
  };

  const isActive = (href: string) => pathname === href;
  const isExpanded = (title: string) => expandedItems.includes(title);

  return (
    <div className={cn("flex h-full w-64 flex-col border-r bg-background", className)}>
      <div className="flex h-14 items-center border-b px-4">
        <Link href="/admin/dashboard" className="flex items-center space-x-2">
          <Newspaper className="h-6 w-6" />
          <span className="font-semibold">Admin Panel</span>
        </Link>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          {filteredItems.map((item) => (
            <div key={item.title}>
              <Button
                variant={isActive(item.href) ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  isActive(item.href) && "bg-secondary"
                )}
                onClick={() => {
                  if (item.items && item.items.length > 0) {
                    toggleExpanded(item.title);
                  } else {
                    window.location.href = item.href;
                  }
                }}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.title}
                {item.items && item.items.length > 0 && (
                  <ChevronDown 
                    className={cn(
                      "ml-auto h-4 w-4 transition-transform",
                      isExpanded(item.title) && "rotate-180"
                    )} 
                  />
                )}
              </Button>
              
              {item.items && item.items.length > 0 && isExpanded(item.title) && (
                <div className="ml-6 mt-2 space-y-1">
                  {item.items.map((subItem) => (
                    <div key={subItem.href}>
                      {subItem.disabled ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled
                          className="w-full justify-start text-sm opacity-50 cursor-not-allowed"
                        >
                          {subItem.title}
                        </Button>
                      ) : (
                        <Link href={subItem.href}>
                          <Button
                            variant={isActive(subItem.href) ? "secondary" : "ghost"}
                            size="sm"
                            className={cn(
                              "w-full justify-start text-sm",
                              isActive(subItem.href) && "bg-secondary"
                            )}
                          >
                            {subItem.title}
                          </Button>
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
} 