"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Quote, 
  Code, 
  Link, 
  Image as ImageIcon,
  AlertTriangle,
  Info,
  CheckCircle,
  XCircle
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";



interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

// Composants personnalisés pour les styles spéciaux
const CustomComponents = {
  // WARNING
  warning: ({ children }: { children: React.ReactNode }) => (
    <div className="my-4 p-4 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
      <div className="flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
        <div className="text-yellow-800 dark:text-yellow-200">
          {children}
        </div>
      </div>
    </div>
  ),
  
  // INFO
  info: ({ children }: { children: React.ReactNode }) => (
    <div className="my-4 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
      <div className="flex items-start gap-3">
        <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
        <div className="text-blue-800 dark:text-blue-200">
          {children}
        </div>
      </div>
    </div>
  ),
  
  // SUCCESS
  success: ({ children }: { children: React.ReactNode }) => (
    <div className="my-4 p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
      <div className="flex items-start gap-3">
        <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
        <div className="text-green-800 dark:text-green-200">
          {children}
        </div>
      </div>
    </div>
  ),
  
  // ERROR
  error: ({ children }: { children: React.ReactNode }) => (
    <div className="my-4 p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
      <div className="flex items-start gap-3">
        <XCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
        <div className="text-red-800 dark:text-red-200">
          {children}
        </div>
      </div>
    </div>
  ),
};

export function MarkdownEditor({ value, onChange, placeholder }: MarkdownEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [activeTab, setActiveTab] = useState("edit");

  // Fonction pour insérer du texte à la position du curseur
  const insertText = (text: string) => {
    if (!textareaRef.current) return;
    
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newValue = value.substring(0, start) + text + value.substring(end);
    
    onChange(newValue);
    
    // Remettre le curseur à la bonne position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + text.length, start + text.length);
    }, 0);
  };

  // Fonction pour insérer un style spécial
  const insertSpecialStyle = (style: string) => {
    const text = `\n<${style.toUpperCase()}>\nVotre contenu ici...\n</${style.toUpperCase()}>\n`;
    insertText(text);
  };

  // Fonction pour gérer l'upload d'image
  const handleImageUpload = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const formData = new FormData();
      formData.append('image', file);

      try {
        const response = await fetch('/api/admin/upload-image', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          const imageMarkdown = `![${file.name}](${data.imageUrl})`;
          insertText(imageMarkdown);
        } else {
          alert('Erreur lors de l\'upload de l\'image');
        }
      } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur lors de l\'upload de l\'image');
      }
    };

    input.click();
  };

  // Fonction pour traiter le markdown avec les styles spéciaux
  const processMarkdown = (markdown: string) => {
    // Remplacer les balises personnalisées par des composants React
    let processed = markdown;
    
    // WARNING
    processed = processed.replace(
      /<WARNING>([\s\S]*?)<\/WARNING>/g,
      (match, content) => `<warning>${content.trim()}</warning>`
    );
    
    // INFO
    processed = processed.replace(
      /<INFO>([\s\S]*?)<\/INFO>/g,
      (match, content) => `<info>${content.trim()}</info>`
    );
    
    // SUCCESS
    processed = processed.replace(
      /<SUCCESS>([\s\S]*?)<\/SUCCESS>/g,
      (match, content) => `<success>${content.trim()}</success>`
    );
    
    // ERROR
    processed = processed.replace(
      /<ERROR>([\s\S]*?)<\/ERROR>/g,
      (match, content) => `<error>${content.trim()}</error>`
    );
    
    return processed;
  };

  return (
    <Card>
      <CardContent className="p-0">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="edit">Éditer</TabsTrigger>
            <TabsTrigger value="preview">Aperçu</TabsTrigger>
            <TabsTrigger value="both">Côte à côte</TabsTrigger>
          </TabsList>
          
          <TabsContent value="edit" className="p-4">
            {/* Barre d'outils */}
            <div className="flex flex-wrap gap-2 mb-4 p-2 border-b">
              <Button
                variant="outline"
                size="sm"
                onClick={() => insertText("**texte en gras**")}
              >
                <Bold className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => insertText("*texte en italique*")}
              >
                <Italic className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => insertText("- élément de liste")}
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => insertText("1. élément numéroté")}
              >
                <ListOrdered className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => insertText("> citation")}
              >
                <Quote className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => insertText("`code`")}
              >
                <Code className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => insertText("[texte](url)")}
              >
                <Link className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleImageUpload}
              >
                <ImageIcon className="h-4 w-4" />
              </Button>
              
              {/* Styles spéciaux */}
              <div className="border-l pl-2 ml-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => insertSpecialStyle("warning")}
                  className="bg-yellow-50 border-yellow-200 text-yellow-800 hover:bg-yellow-100"
                >
                  <AlertTriangle className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => insertSpecialStyle("info")}
                  className="bg-blue-50 border-blue-200 text-blue-800 hover:bg-blue-100"
                >
                  <Info className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => insertSpecialStyle("success")}
                  className="bg-green-50 border-green-200 text-green-800 hover:bg-green-100"
                >
                  <CheckCircle className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => insertSpecialStyle("error")}
                  className="bg-red-50 border-red-200 text-red-800 hover:bg-red-100"
                >
                  <XCircle className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* Zone de texte */}
            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder || "Commencez à écrire votre article..."}
              className="w-full h-96 p-4 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-background text-foreground"
            />
          </TabsContent>
          
          <TabsContent value="preview" className="p-4">
            <div className="prose dark:prose-invert max-w-none">
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                components={CustomComponents as any}
              >
                {processMarkdown(value)}
              </ReactMarkdown>
            </div>
          </TabsContent>
          
          <TabsContent value="both" className="p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Éditeur</h3>
                <textarea
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                  placeholder={placeholder || "Commencez à écrire votre article..."}
                  className="w-full h-96 p-4 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-background text-foreground"
                />
              </div>
              <div>
                <h3 className="text-sm font-medium mb-2">Aperçu</h3>
                <div className="h-96 overflow-auto border rounded-md p-4 prose dark:prose-invert max-w-none">
                                   <ReactMarkdown 
                   remarkPlugins={[remarkGfm]}
                   components={CustomComponents as any}
                 >
                   {processMarkdown(value)}
                 </ReactMarkdown>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
} 