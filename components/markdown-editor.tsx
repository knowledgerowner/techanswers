"use client";

import { Card, CardContent } from "@/components/ui/card";
import dynamic from "next/dynamic";
import { useEffect, useState, useCallback, useRef } from "react";
import { markdownToHtmlSync } from "@/lib/markdown";

// Import dynamique de l'éditeur markdown pour éviter les erreurs SSR
const MDEditor = dynamic(
  () => import("@uiw/react-md-editor").then((mod) => mod.default),
  { 
    ssr: false,
    loading: () => <p>Chargement de l&apos;éditeur...</p>,
  }
);

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function MarkdownEditor({ value, onChange, placeholder }: MarkdownEditorProps) {
  const [previewHtml, setPreviewHtml] = useState<string>('');
  const processingRef = useRef(false);

  // Convertir le markdown pour le preview avec debouncing pour éviter les boucles
  useEffect(() => {
    if (processingRef.current) return;
    
    processingRef.current = true;
    const timeoutId = setTimeout(() => {
      if (value) {
        try {
          const html = markdownToHtmlSync(value);
          setPreviewHtml(html);
        } catch (error) {
          console.error('Erreur lors de la conversion markdown:', error);
          setPreviewHtml('');
        }
      } else {
        setPreviewHtml('');
      }
      processingRef.current = false;
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      processingRef.current = false;
    };
  }, [value]);

  // Fonction pour l'upload d'image avec useCallback pour éviter les re-créations
  const handleImageUpload = useCallback(async () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
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
          
          // Insérer l'image dans l'éditeur
          const textarea = document.querySelector('.w-md-editor-text-input') as HTMLTextAreaElement;
          if (textarea) {
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const newValue = value.substring(0, start) + imageMarkdown + value.substring(end);
            onChange(newValue);
            
            // Remettre le curseur à la bonne position
            setTimeout(() => {
              textarea.focus();
              textarea.setSelectionRange(start + imageMarkdown.length, start + imageMarkdown.length);
            }, 0);
          }
        } else {
          alert('Erreur lors de l\'upload de l\'image');
        }
      } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur lors de l\'upload de l\'image');
      }
    };
  }, [value, onChange]);

  // Gestion du raccourci clavier Ctrl+Alt+I
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+Alt+I (ou Cmd+Alt+I sur Mac)
      if ((e.ctrlKey || e.metaKey) && e.altKey && e.key === 'I') {
        e.preventDefault();
        e.stopPropagation();
        handleImageUpload();
      }
    };

    // Ajouter l'écouteur sur le document pour capturer avant l'éditeur
    document.addEventListener('keydown', handleKeyDown, true);
    return () => document.removeEventListener('keydown', handleKeyDown, true);
  }, [handleImageUpload]);

  // Effet pour appliquer nos styles au preview de l'éditeur - optimisé
  useEffect(() => {
    if (!previewHtml) return;

    const applyCustomStyles = () => {
      const previewElements = document.querySelectorAll('.w-md-editor-preview .wmde-markdown');
      previewElements.forEach((element) => {
        // Ajouter notre classe markdown-preview
        if (!element.classList.contains('markdown-preview')) {
          element.classList.add('markdown-preview');
        }
        
        // Convertir le contenu avec nos styles personnalisés seulement si différent
        if (element.innerHTML !== previewHtml) {
          element.innerHTML = previewHtml;
        }
      });
    };

    // Appliquer les styles après un court délai pour laisser l'éditeur se rendre
    const timer = setTimeout(applyCustomStyles, 200);
    
    return () => {
      clearTimeout(timer);
    };
  }, [previewHtml]);

  return (
    <Card>
      <CardContent className="p-0">
        <div data-color-mode="dark" style={{ overflow: 'hidden' }}>
          <MDEditor
            value={value}
            onChange={(val) => onChange(val || "")}
            height={400}
            preview="live"
            hideToolbar={false}
            style={{
              '--md-editor-scrollbar-width': '0px'
            } as React.CSSProperties}
            textareaProps={{
              placeholder: placeholder || "Commencez à écrire votre article...\n\nUtilisez:\n!> pour les notes d'attention\n?> pour les notes informationnelles\n:> pour les notes de succès",
              style: { resize: 'none' }
            }}
          />
        </div>
        
        {/* Instructions pour les nouvelles notes */}
        <div className="p-4 bg-muted/50 border-t">
          <p className="text-sm text-muted-foreground mb-2">
            <strong>Nouvelles syntaxes de notes :</strong>
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
            <div className="flex items-center gap-2">
              <code className="bg-muted px-1 rounded">!&gt;</code>
              <span className="text-yellow-600">⚠️ Attention</span>
            </div>
            <div className="flex items-center gap-2">
              <code className="bg-muted px-1 rounded">?&gt;</code>
              <span className="text-blue-600">ℹ️ Information</span>
            </div>
            <div className="flex items-center gap-2">
              <code className="bg-muted px-1 rounded">:&gt;</code>
              <span className="text-green-600">✅ Succès</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 