"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { markdownToHtmlSync } from "@/lib/markdown";
import { 
  Bold, 
  Italic, 
  Link, 
  Image as ImageIcon, 
  List, 
  ListOrdered, 
  Quote, 
  Code,
  Eye,
  EyeOff,
  Maximize2,
  Minimize2
} from "lucide-react";

interface CustomMarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  height?: number;
}

export function CustomMarkdownEditor({ 
  value, 
  onChange, 
  placeholder = "Commencez à écrire votre article...", 
  height = 400 
}: CustomMarkdownEditorProps) {
  const [previewHtml, setPreviewHtml] = useState<string>('');
  const [showPreview, setShowPreview] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  // Convertir le markdown pour le preview
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      try {
        if (value.trim()) {
          const html = markdownToHtmlSync(value);
          setPreviewHtml(html);
        } else {
          setPreviewHtml('<p class="text-muted-foreground">Aperçu du contenu...</p>');
        }
      } catch (error) {
        console.error('Erreur lors de la conversion markdown:', error);
        setPreviewHtml('<p class="text-red-500">Erreur dans le markdown</p>');
      }
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [value]);

  // Fonction pour insérer du texte à la position du curseur
  const insertTextAtCursor = useCallback((before: string, after: string = '', placeholder: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const textToInsert = selectedText || placeholder;
    const newText = before + textToInsert + after;
    
    const newValue = value.substring(0, start) + newText + value.substring(end);
    onChange(newValue);

    // Remettre le focus et la sélection
    setTimeout(() => {
      textarea.focus();
      if (selectedText) {
        textarea.setSelectionRange(start + before.length, start + before.length + textToInsert.length);
      } else {
        textarea.setSelectionRange(start + before.length, start + before.length + placeholder.length);
      }
    }, 0);
  }, [value, onChange]);

  // Upload d'image
  const handleImageUpload = useCallback(async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('/api/admin/upload-image', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        insertTextAtCursor(`![${file.name}](${data.imageUrl})`);
      } else {
        alert('Erreur lors de l\'upload de l\'image');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de l\'upload de l\'image');
    }
  }, [insertTextAtCursor]);

  // Sélecteur de fichier
  const triggerImageUpload = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) handleImageUpload(file);
    };
    input.click();
  }, [handleImageUpload]);

  // Raccourcis clavier
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'b':
          e.preventDefault();
          insertTextAtCursor('**', '**', 'texte en gras');
          break;
        case 'i':
          e.preventDefault();
          insertTextAtCursor('*', '*', 'texte en italique');
          break;
        case 'l':
          e.preventDefault();
          insertTextAtCursor('[', '](url)', 'texte du lien');
          break;
        case 'k':
          e.preventDefault();
          triggerImageUpload();
          break;
        case 'j':
          e.preventDefault();
          // Ctrl+J pour code inline
          insertTextAtCursor('`', '`', 'code');
          break;
        case 'm':
          e.preventDefault();
          // Ctrl+M pour bloc de code
          insertTextAtCursor('```', '```', 'votre code ici');
          break;
        case 'Enter':
          if (e.shiftKey) {
            e.preventDefault();
            insertTextAtCursor('\n\n---\n\n');
          }
          break;
      }
    }

    // Tab pour indentation dans les listes
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = textareaRef.current;
      if (textarea) {
        const cursorPos = textarea.selectionStart;
        const lineStart = value.lastIndexOf('\n', cursorPos - 1) + 1;
        const currentLine = value.substring(lineStart, cursorPos);
        
        // Si on est sur une ligne de liste, ajouter l'indentation
        if (currentLine.match(/^\s*[-*+]\s/) || currentLine.match(/^\s*\d+\.\s/)) {
          insertTextAtCursor('  '); // 2 espaces pour l'indentation
        } else {
          insertTextAtCursor('  '); // Indentation normale
        }
      }
    }
  }, [insertTextAtCursor, triggerImageUpload]); // eslint-disable-line react-hooks/exhaustive-deps

  // Actions de la barre d'outils
  const actions = {
    bold: () => insertTextAtCursor('**', '**', 'texte en gras'),
    italic: () => insertTextAtCursor('*', '*', 'texte en italique'),
    link: () => insertTextAtCursor('[', '](url)', 'texte du lien'),
    codeInline: () => insertTextAtCursor('`', '`', 'code'),
    codeBlock: () => insertTextAtCursor('```', '```', 'votre code ici'),
    quote: () => insertTextAtCursor('> ', '', 'citation'),
    list: () => insertTextAtCursor('- ', '', 'élément de liste'),
    listIndented: () => insertTextAtCursor('  - ', '', 'sous-élément'),
    orderedList: () => insertTextAtCursor('1. ', '', 'élément numéroté'),
    orderedListIndented: () => insertTextAtCursor('  1. ', '', 'sous-élément numéroté'),
    heading1: () => insertTextAtCursor('# ', '', 'Titre 1'),
    heading2: () => insertTextAtCursor('## ', '', 'Titre 2'),
    heading3: () => insertTextAtCursor('### ', '', 'Titre 3'),
  };

  // Glisser-déposer
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    imageFiles.forEach(handleImageUpload);
  }, [handleImageUpload]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragging(false);
    }
  };

  const editorHeight = isFullscreen ? 'calc(100vh - 12rem)' : `${height}px`;

  return (
    <Card className={`custom-markdown-editor ${isFullscreen ? 'fixed inset-4 z-50' : ''}`}>
      <CardContent className="p-0">
        {/* Barre d'outils */}
        <div className="flex items-center justify-between p-3 border-b bg-muted/30">
          <div className="flex items-center gap-1 flex-wrap">
            <Button type="button" variant="ghost" size="sm" onClick={actions.bold} title="Gras (Ctrl+B)">
              <Bold className="h-4 w-4" />
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={actions.italic} title="Italique (Ctrl+I)">
              <Italic className="h-4 w-4" />
            </Button>
            <div className="w-px h-6 bg-border mx-1" />
            <Button type="button" variant="ghost" size="sm" onClick={actions.heading1} title="Titre 1">
              H1
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={actions.heading2} title="Titre 2">
              H2
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={actions.heading3} title="Titre 3">
              H3
            </Button>
            <div className="w-px h-6 bg-border mx-1" />
            <Button type="button" variant="ghost" size="sm" onClick={actions.link} title="Lien (Ctrl+L)">
              <Link className="h-4 w-4" />
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={triggerImageUpload} title="Image (Ctrl+K)">
              <ImageIcon className="h-4 w-4" />
            </Button>
            <div className="w-px h-6 bg-border mx-1" />
            <Button type="button" variant="ghost" size="sm" onClick={actions.list} title="Liste">
              <List className="h-4 w-4" />
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={actions.listIndented} title="Sous-liste">
              <List className="h-4 w-4" />
              <span className="text-xs ml-1">→</span>
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={actions.orderedList} title="Liste numérotée">
              <ListOrdered className="h-4 w-4" />
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={actions.orderedListIndented} title="Sous-liste numérotée">
              <ListOrdered className="h-4 w-4" />
              <span className="text-xs ml-1">→</span>
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={actions.quote} title="Citation">
              <Quote className="h-4 w-4" />
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={actions.codeInline} title="Code inline (Ctrl+J)">
              <Code className="h-4 w-4" />
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={actions.codeBlock} title="Bloc de code (Ctrl+M)">
              <Code className="h-4 w-4" />
              <span className="text-xs ml-1">{ }</span>
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowPreview(!showPreview)}
              title={showPreview ? "Masquer l'aperçu" : "Afficher l'aperçu"}
            >
              {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsFullscreen(!isFullscreen)}
              title={isFullscreen ? "Quitter le plein écran" : "Plein écran"}
            >
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Zone d'édition */}
        <div 
          className={`flex ${isDragging ? 'bg-primary/10 border-2 border-primary border-dashed' : ''}`}
          style={{ height: editorHeight }}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          {/* Éditeur */}
          <div className={`${showPreview ? 'w-1/2' : 'w-full'} flex flex-col`}>
            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              className="w-full h-full p-4 border-0 resize-none bg-background text-foreground focus:outline-none focus:ring-0 font-mono text-sm leading-relaxed"
              style={{ minHeight: '100%' }}
            />
          </div>

          {/* Séparateur */}
          {showPreview && <div className="w-px bg-border" />}

                     {/* Aperçu */}
           {showPreview && (
             <div className="w-1/2 overflow-y-auto preview-content">
               <div
                 ref={previewRef}
                 className="p-4 prose prose-sm max-w-none dark:prose-invert markdown-preview"
                 dangerouslySetInnerHTML={{ __html: previewHtml }}
               />
             </div>
           )}

                     {/* Overlay de glisser-déposer */}
           {isDragging && (
             <div className="absolute inset-0 flex items-center justify-center bg-primary/10 border-2 border-primary border-dashed pointer-events-none z-10">
               <div className="text-primary font-medium text-center">
                 <ImageIcon className="h-8 w-8 mx-auto mb-2" />
                 Déposez vos images ici
               </div>
             </div>
           )}
        </div>

                {/* Instructions */}
        <div className="p-3 bg-muted/30 border-t text-xs text-muted-foreground">
          <div className="flex flex-wrap gap-4">
            <span><Badge variant="outline" className="mr-1">Ctrl+B</Badge>Gras</span>
            <span><Badge variant="outline" className="mr-1">Ctrl+I</Badge>Italique</span>
            <span><Badge variant="outline" className="mr-1">Ctrl+L</Badge>Lien</span>
            <span><Badge variant="outline" className="mr-1">Ctrl+K</Badge>Image</span>
            <span><Badge variant="outline" className="mr-1">Ctrl+J</Badge>Code</span>
            <span><Badge variant="outline" className="mr-1">Ctrl+M</Badge>Bloc code</span>
            <span><Badge variant="outline" className="mr-1">Tab</Badge>Indentation</span>
            <span><code className="bg-muted px-1 rounded">!&gt;</code> Attention</span>
            <span><code className="bg-muted px-1 rounded">?&gt;</code> Info</span>
            <span><code className="bg-muted px-1 rounded">:&gt;</code> Succès</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 