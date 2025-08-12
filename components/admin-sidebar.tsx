"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  BarChart3, 
  FileText, 
  Users, 
  Mail, 
  Settings, 
  CreditCard, 
  Shield,
  TrendingUp,
  Tag,
  Newspaper,
  ChevronDown
} from "lucide-react";
import { useState } from "react";

interface SidebarItem {
  title: string;
  icon: any;
  href: string;
  items?: { title: string; href: string }[];
}

interface AdminSidebarProps {
  className?: string;
}

export function AdminSidebar({ className }: AdminSidebarProps) {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

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
        { title: "Créer un article", href: "/admin/dashboard/articles/new" },
        { title: "Brouillons", href: "/admin/dashboard/articles/drafts" }
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
      items: [
        { title: "Tous les utilisateurs", href: "/admin/dashboard/users" },
        { title: "Administrateurs", href: "/admin/dashboard/users/admins" }
      ]
    },
    {
      title: "Messages",
      icon: Mail,
      href: "/admin/dashboard/messages",
      items: [
        { title: "Demandes de contact", href: "/admin/dashboard/messages" },
        { title: "Newsletter", href: "/admin/dashboard/newsletter" }
      ]
    },
    {
      title: "Analytics",
      icon: TrendingUp,
      href: "/admin/dashboard/analytics",
      items: [
        { title: "Vue d'ensemble", href: "/admin/dashboard/analytics" },
        { title: "Pages visitées", href: "/admin/dashboard/analytics/pages" },
        { title: "Utilisateurs", href: "/admin/dashboard/analytics/users" }
      ]
    },
    {
      title: "Paiements",
      icon: CreditCard,
      href: "/admin/dashboard/payments",
      items: [
        { title: "Transactions", href: "/admin/dashboard/payments" },
        { title: "Rapports", href: "/admin/dashboard/payments/reports" }
      ]
    },
    {
      title: "Sécurité",
      icon: Shield,
      href: "/admin/dashboard/security",
      items: [
        { title: "Tentatives d'intrusion", href: "/admin/dashboard/security/bruteforce" },
        { title: "Logs", href: "/admin/dashboard/security/logs" }
      ]
    },
    {
      title: "Paramètres",
      icon: Settings,
      href: "/admin/dashboard/settings",
      items: [
        { title: "Général", href: "/admin/dashboard/settings" },
        { title: "Email", href: "/admin/dashboard/settings/email" },
        { title: "Paiements", href: "/admin/dashboard/settings/payments" }
      ]
    }
  ];

  const toggleExpanded = (title: string) => {
    setExpandedItems(prev => 
      prev.includes(title) 
        ? prev.filter(item => item !== title)
        : [...prev, title]
    );
  };

  const isActive = (href: string) => {
    if (href === "/admin/dashboard") {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  const isExpanded = (title: string) => {
    return expandedItems.includes(title);
  };

  return (
    <div className={cn("flex h-full w-64 flex-col border-r bg-background", className)}>
      <div className="flex h-16 items-center border-b px-6">
        <div className="flex items-center gap-2 font-semibold">
          <Shield className="h-6 w-6" />
          <span>Admin Panel</span>
        </div>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-4">
          <nav className="space-y-2">
            {sidebarItems.map((item) => (
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
                      <Link
                        key={subItem.href}
                        href={subItem.href}
                        className={cn(
                          "block rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
                          isActive(subItem.href) && "bg-accent text-accent-foreground"
                        )}
                      >
                        {subItem.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>
      </ScrollArea>
    </div>
  );
} 