"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";

interface Contact {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  createdAt: string;
  user?: {
    username: string;
  };
  replies: Reply[];
}

interface Reply {
  id: string;
  content: string;
  createdAt: string;
  user: {
    username: string;
  };
}

export default function ContactsPage() {
  const { user, isLoading: authLoading, logout } = useAuth();
  const router = useRouter();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [sendingReply, setSendingReply] = useState(false);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push("/admin/login");
      } else if (!user.isAdmin && !user.isSuperAdmin) {
        router.push("/");
      } else {
        fetchContacts();
      }
    }
  }, [user, authLoading, router]);

  const fetchContacts = async () => {
    try {
      const response = await fetch("/api/admin/contacts");
      if (response.ok) {
        const data = await response.json();
        setContacts(data.contacts);
      } else {
        console.error("Erreur lors du chargement des contacts");
      }
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (contactId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/contacts/${contactId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setContacts(prev => 
          prev.map(contact => 
            contact.id === contactId 
              ? { ...contact, status: newStatus as Contact['status'] }
              : contact
          )
        );
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut:", error);
    }
  };

  const handleReply = async () => {
    if (!selectedContact || !replyContent.trim()) return;

    setSendingReply(true);
    try {
      const response = await fetch(`/api/admin/contacts/${selectedContact.id}/reply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: replyContent }),
      });

      if (response.ok) {
        const newReply = await response.json();
        setContacts(prev => 
          prev.map(contact => 
            contact.id === selectedContact.id 
              ? { ...contact, replies: [...contact.replies, newReply.reply] }
              : contact
          )
        );
        setReplyContent("");
        setSelectedContact(null);
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi de la réponse:", error);
    } finally {
      setSendingReply(false);
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "PENDING": return "En attente";
      case "IN_PROGRESS": return "En cours";
      case "RESOLVED": return "Résolu";
      case "CLOSED": return "Fermé";
      default: return status;
    }
  };

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = 
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.subject.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || contact.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold">Gestion des contacts</h1>
              <p className="text-muted-foreground">Gérez les demandes de contact des utilisateurs</p>
            </div>
            <Button variant="outline" onClick={logout}>
              Déconnexion
            </Button>
          </div>

      {/* Filtres */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium mb-2 block">Rechercher</label>
              <Input
                placeholder="Nom, email ou sujet..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Statut</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="PENDING">En attente</SelectItem>
                  <SelectItem value="IN_PROGRESS">En cours</SelectItem>
                  <SelectItem value="RESOLVED">Résolu</SelectItem>
                  <SelectItem value="CLOSED">Fermé</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tableau des contacts */}
      <Card>
        <CardHeader>
          <CardTitle>
            Contacts ({filteredContacts.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Utilisateur</TableHead>
                <TableHead>Sujet</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Réponses</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredContacts.map((contact) => (
                <TableRow key={contact.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{contact.name}</p>
                      {contact.user && (
                        <p className="text-sm text-muted-foreground">
                          @{contact.user.username}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-xs">
                      <p className="font-medium">{contact.subject}</p>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {contact.message}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>{contact.email}</TableCell>
                  <TableCell>
                    {new Date(contact.createdAt).toLocaleDateString('fr-FR')}
                  </TableCell>
                  <TableCell>
                    <Select
                      value={contact.status}
                      onValueChange={(value) => handleStatusChange(contact.id, value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PENDING">En attente</SelectItem>
                        <SelectItem value="IN_PROGRESS">En cours</SelectItem>
                        <SelectItem value="RESOLVED">Résolu</SelectItem>
                        <SelectItem value="CLOSED">Fermé</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {contact.replies.length} réponse{contact.replies.length > 1 ? 's' : ''}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Sheet>
                      <SheetTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setSelectedContact(contact)}
                        >
                          Voir détails
                        </Button>
                      </SheetTrigger>
                      <SheetContent className="w-full max-w-2xl h-screen overflow-y-auto p-6">
                        <SheetHeader className="mb-6">
                          <SheetTitle>Détails du contact</SheetTitle>
                        </SheetHeader>
                        <div className="space-y-6">
                          <div className="bg-card border rounded-lg p-4">
                            <h3 className="font-semibold mb-3 text-lg">Informations</h3>
                            <div className="grid gap-3 text-sm">
                              <div className="flex justify-between">
                                <span className="font-medium text-muted-foreground">Nom:</span>
                                <span>{contact.name}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="font-medium text-muted-foreground">Email:</span>
                                <span>{contact.email}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="font-medium text-muted-foreground">Sujet:</span>
                                <span>{contact.subject}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="font-medium text-muted-foreground">Date:</span>
                                <span>{new Date(contact.createdAt).toLocaleString('fr-FR')}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="font-medium text-muted-foreground">Statut:</span>
                                <Badge variant="outline">{getStatusText(contact.status)}</Badge>
                              </div>
                            </div>
                          </div>
                          
                          <div className="bg-card border rounded-lg p-4">
                            <h3 className="font-semibold mb-3 text-lg">Message</h3>
                            <div className="bg-muted p-4 rounded-lg">
                              <p className="whitespace-pre-wrap text-sm leading-relaxed">{contact.message}</p>
                            </div>
                          </div>

                          {contact.replies.length > 0 && (
                            <div className="bg-card border rounded-lg p-4">
                              <h3 className="font-semibold mb-3 text-lg">Réponses ({contact.replies.length})</h3>
                              <div className="space-y-4">
                                {contact.replies.map((reply) => (
                                  <div key={reply.id} className="bg-muted p-4 rounded-lg border-l-4 border-primary">
                                    <div className="flex justify-between items-start mb-3">
                                      <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                                          <span className="text-primary-foreground text-xs font-medium">
                                            {reply.user.username.charAt(0).toUpperCase()}
                                          </span>
                                        </div>
                                        <p className="font-medium text-sm">{reply.user.username}</p>
                                      </div>
                                      <p className="text-xs text-muted-foreground">
                                        {new Date(reply.createdAt).toLocaleString('fr-FR')}
                                      </p>
                                    </div>
                                    <p className="whitespace-pre-wrap text-sm leading-relaxed">{reply.content}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          <div className="bg-card border rounded-lg p-4">
                            <h3 className="font-semibold mb-3 text-lg">Répondre</h3>
                            <Textarea
                              placeholder="Votre réponse..."
                              value={replyContent}
                              onChange={(e) => setReplyContent(e.target.value)}
                              rows={5}
                              className="mb-4"
                            />
                            <Button 
                              onClick={handleReply}
                              disabled={sendingReply || !replyContent.trim()}
                              className="w-full"
                            >
                              {sendingReply ? "Envoi..." : "Envoyer la réponse"}
                            </Button>
                          </div>
                        </div>
                      </SheetContent>
                    </Sheet>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {filteredContacts.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Aucun contact trouvé</p>
            </div>
          )}
        </CardContent>
      </Card>
        </div>
      </div>
    </div>
  );
} 