import { remark } from 'remark';
import remarkHtml from 'remark-html';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';

// Configuration du processeur Markdown
const markdownProcessor = remark()
  .use(remarkGfm) // Support GitHub Flavored Markdown (tables, strikethrough, etc.)
  .use(remarkBreaks) // Convertir les retours à la ligne en <br>
  .use(remarkHtml, { sanitize: false }); // Convertir en HTML (sanitize: false pour permettre le HTML brut)

/**
 * Convertit du contenu Markdown en HTML
 * @param markdown - Le contenu Markdown à convertir
 * @returns Le HTML généré
 */
export async function markdownToHtml(markdown: string): Promise<string> {
  try {
    // PROTECTION DES BLOCS DE CODE - Remplacer temporairement par des placeholders
    const codeBlocks: string[] = [];
    let codeBlockIndex = 0;
    
    // Sauvegarder les blocs de code avec des placeholders uniques et sécurisés
    let processedMarkdown = markdown.replace(/```([\s\S]*?)```/g, (match, content) => {
      const placeholder = `<!--CODE_BLOCK_${codeBlockIndex}-->`;
      codeBlocks[codeBlockIndex] = content;
      codeBlockIndex++;
      return placeholder;
    });

    // Sauvegarder aussi le code inline avec des placeholders sécurisés
    const inlineCodes: string[] = [];
    let inlineCodeIndex = 0;
    
    processedMarkdown = processedMarkdown.replace(/`([^`]+)`/g, (match, content) => {
      const placeholder = `<!--INLINE_CODE_${inlineCodeIndex}-->`;
      inlineCodes[inlineCodeIndex] = content;
      inlineCodeIndex++;
      return placeholder;
    });

    // Prétraitement des notes personnalisées simplifiées
    processedMarkdown = processedMarkdown
      // Notes personnalisées avec syntaxe simplifiée
      .replace(/^!>\s+(.*$)/gim, '<div class="warning-block"><strong>⚠️ Attention:</strong> $1</div>')
      .replace(/^\?>\s+(.*$)/gim, '<div class="info-block"><strong>ℹ️ Information:</strong> $1</div>')
      .replace(/^:>\s+(.*$)/gim, '<div class="success-block"><strong>✅ Succès:</strong> $1</div>');

    // Traitement avec remark
    const result = await markdownProcessor.process(processedMarkdown);
    let htmlResult = result.toString();

    // RESTAURER LES BLOCS DE CODE - Remplacer les placeholders par le vrai HTML
    codeBlocks.forEach((codeContent, index) => {
      const placeholder = `<!--CODE_BLOCK_${index}-->`;
      // Échapper les caractères HTML pour éviter l'interprétation native
      const escapedContent = codeContent
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
      htmlResult = htmlResult.replace(placeholder, `<pre><code>${escapedContent}</code></pre>`);
    });

    // RESTAURER LE CODE INLINE
    inlineCodes.forEach((codeContent, index) => {
      const placeholder = `<!--INLINE_CODE_${index}-->`;
      // Échapper les caractères HTML pour éviter l'interprétation native
      const escapedContent = codeContent
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
      htmlResult = htmlResult.replace(placeholder, `<code>${escapedContent}</code>`);
    });

    return htmlResult;
  } catch (error) {
    console.error('Erreur lors de la conversion Markdown:', error);
    // En cas d'erreur, retourner le texte brut avec des retours à la ligne en <br>
    return markdown.replace(/\n/g, '<br>');
  }
}

/**
 * Version synchrone pour les composants côté client (moins de fonctionnalités)
 * Utilise une conversion basique pour éviter les problèmes d'hydratation
 * @param markdown - Le contenu Markdown à convertir
 * @returns Le HTML généré de façon basique
 */
export function markdownToHtmlSync(markdown: string): string {
  // PROTECTION DES BLOCS DE CODE - Remplacer temporairement par des placeholders
  const codeBlocks: string[] = [];
  let codeBlockIndex = 0;
  
  // Sauvegarder les blocs de code avec des placeholders uniques et sécurisés
  let processedMarkdown = markdown.replace(/```([\s\S]*?)```/g, (match, content) => {
    const placeholder = `<!--CODE_BLOCK_${codeBlockIndex}-->`;
    codeBlocks[codeBlockIndex] = content;
    codeBlockIndex++;
    return placeholder;
  });

  // Sauvegarder aussi le code inline avec des placeholders sécurisés
  const inlineCodes: string[] = [];
  let inlineCodeIndex = 0;
  
  processedMarkdown = processedMarkdown.replace(/`([^`]+)`/g, (match, content) => {
    const placeholder = `<!--INLINE_CODE_${inlineCodeIndex}-->`;
    inlineCodes[inlineCodeIndex] = content;
    inlineCodeIndex++;
    return placeholder;
  });

  // Maintenant traiter le markdown sur le contenu protégé
  let result = processedMarkdown
    // Notes personnalisées simplifiées (à traiter en premier)
    .replace(/^!>\s+(.*$)/gim, '<div class="warning-block"><strong>⚠️ Attention:</strong> $1</div>')
    .replace(/^\?>\s+(.*$)/gim, '<div class="info-block"><strong>ℹ️ Information:</strong> $1</div>')
    .replace(/^:>\s+(.*$)/gim, '<div class="success-block"><strong>✅ Succès:</strong> $1</div>')
    
    // Titres (du plus spécifique au plus général)
    .replace(/^###### (.*$)/gim, '<h6>$1</h6>')
    .replace(/^##### (.*$)/gim, '<h5>$1</h5>')
    .replace(/^#### (.*$)/gim, '<h4>$1</h4>')
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    
    // Gras et italique
    .replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    
    // Images (AVANT les liens pour éviter les conflits)
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="max-w-full h-auto rounded-lg mb-4" />')
    
    // Liens (après les images)
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    
    // Traitement des listes avec indentation
    .split('\n')
    .map(line => {
      // Listes à puces avec indentation (-, *, +)
      const bulletMatch = line.match(/^(\s*)[-*+]\s+(.*)$/);
      if (bulletMatch) {
        const indentLevel = Math.floor(bulletMatch[1].length / 2); // 2 espaces = 1 niveau
        return `<li class="bullet-${indentLevel}">${bulletMatch[2]}</li>`;
      }
      
      // Listes numérotées avec indentation
      const numberedMatch = line.match(/^(\s*)(\d+)\.\s+(.*)$/);
      if (numberedMatch) {
        const indentLevel = Math.floor(numberedMatch[1].length / 2);
        return `<li class="numbered-${indentLevel}">${numberedMatch[3]}</li>`;
      }
      
      return line;
    })
    .join('\n')
    
    // Conversion des listes avec niveaux en HTML imbriqué
    .replace(/(<li class="(?:bullet|numbered)-\d+">[^<]*<\/li>[\n]*)+/g, (match) => {
      const lines = match.trim().split('\n');
      let result = '';
      const stack: Array<{type: string, level: number}> = [];
      
      lines.forEach(line => {
        const levelMatch = line.match(/<li class="(bullet|numbered)-(\d+)">([^<]*)<\/li>/);
        if (levelMatch) {
          const type = levelMatch[1];
          const level = parseInt(levelMatch[2]);
          const content = levelMatch[3];
          
          // Fermer les niveaux plus profonds
          while (stack.length > 0 && stack[stack.length - 1].level >= level) {
            const last = stack.pop()!;
            result += last.type === 'bullet' ? '</ul>' : '</ol>';
          }
          
          // Ouvrir un nouveau niveau si nécessaire
          if (stack.length === 0 || stack[stack.length - 1].level < level) {
            const tag = type === 'bullet' ? 'ul' : 'ol';
            result += `<${tag}>`;
            stack.push({type, level});
          }
          
          result += `<li>${content}</li>`;
        }
      });
      
      // Fermer tous les niveaux restants
      while (stack.length > 0) {
        const last = stack.pop()!;
        result += last.type === 'bullet' ? '</ul>' : '</ol>';
      }
      
      return result;
    })
    
    // Blockquotes
    .replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>')
    
    // Traitement des tableaux (doit être fait avant les autres remplacements)
    // Détecter les blocs de tableaux complets
    .replace(/((?:\|[^\n]*\|\n?)+)/g, (match) => {
      const lines = match.trim().split('\n');
      const tableLines = lines.filter(line => line.includes('|') && !line.match(/^\s*\|[\s\-:|]+\|\s*$/));
      
      if (tableLines.length === 0) return match;
      
      // Déterminer le nombre de colonnes à partir de la première ligne
      
      let tableHtml = '<table class="w-full border-collapse border border-border mb-4">';
      
      // En-tête du tableau
      if (tableLines.length > 0) {
        tableHtml += '<thead><tr>';
        const headerCells = tableLines[0].split('|').slice(1, -1).map(cell => cell.trim());
        headerCells.forEach(cell => {
          tableHtml += `<th class="border border-border bg-muted px-4 py-2 text-left font-bold text-foreground">${cell}</th>`;
        });
        tableHtml += '</tr></thead>';
      }
      
      // Corps du tableau
      if (tableLines.length > 1) {
        tableHtml += '<tbody>';
        for (let i = 1; i < tableLines.length; i++) {
          const line = tableLines[i];
          const cells = line.split('|').slice(1, -1).map(cell => cell.trim());
          tableHtml += '<tr>';
          cells.forEach(cell => {
            tableHtml += `<td class="border border-border px-4 py-2 text-foreground">${cell}</td>`;
          });
          tableHtml += '</tr>';
        }
        tableHtml += '</tbody>';
      }
      
      tableHtml += '</table>';
      return tableHtml;
    })
    
    // Retours à la ligne et paragraphes
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>')
    
    // Wrapper paragraphe (en évitant les balises HTML)
    .replace(/^(?!<[h|u|p|c|d|b|t])(.+)$/gm, '<p>$1</p>');

  // RESTAURER LES BLOCS DE CODE - Remplacer les placeholders par le vrai HTML
  codeBlocks.forEach((codeContent, index) => {
    const placeholder = `<!--CODE_BLOCK_${index}-->`;
    // Échapper les caractères HTML pour éviter l'interprétation native
    const escapedContent = codeContent
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
    result = result.replace(placeholder, `<pre><code>${escapedContent}</code></pre>`);
  });

  // RESTAURER LE CODE INLINE
  inlineCodes.forEach((codeContent, index) => {
    const placeholder = `<!--INLINE_CODE_${index}-->`;
    // Échapper les caractères HTML pour éviter l'interprétation native
    const escapedContent = codeContent
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
    result = result.replace(placeholder, `<code>${escapedContent}</code>`);
  });

  return result;
} 