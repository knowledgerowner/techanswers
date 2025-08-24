import React from 'react';

interface ArticlePublishedTemplateProps {
  username: string;
  articleTitle: string;
  articleUrl: string;
  summary?: string;
}

export default function ArticlePublishedTemplate({
  username,
  articleTitle,
  articleUrl,
  summary
}: ArticlePublishedTemplateProps) {
  return (
    <div style={{
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      lineHeight: '1.6',
      color: '#ffffff',
      margin: 0,
      padding: 0,
      background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 50%, #2d2d2d 100%)',
      minHeight: '100vh'
    }}>
      <div style={{
        maxWidth: '600px',
        margin: '0 auto',
        padding: '20px'
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)',
          color: 'white',
          padding: '40px 30px',
          textAlign: 'center',
          borderRadius: '15px 15px 0 0',
          border: '1px solid #333',
          borderBottom: 'none'
        }}>
          <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 'bold' }}>
            🎉 Nouvel Article Publié !
          </h1>
          <p style={{ margin: '10px 0 0 0', opacity: 0.9 }}>
            TechAnswers
          </p>
        </div>

        {/* Content */}
        <div style={{
          background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
          padding: '40px 30px',
          borderRadius: '0 0 15px 15px',
          border: '1px solid #333',
          borderTop: 'none'
        }}>
          <h2 style={{ 
            margin: '0 0 20px 0', 
            fontSize: '24px', 
            color: '#ffffff',
            textAlign: 'center'
          }}>
            Bonjour {username} !
          </h2>

          <p style={{ 
            margin: '0 0 20px 0', 
            fontSize: '16px', 
            color: '#e0e0e0',
            textAlign: 'center'
          }}>
            Un nouvel article vient d&apos;être publié sur TechAnswers !
          </p>

          {/* Article Card */}
          <div style={{
            background: 'linear-gradient(135deg, #2a2a2a 0%, #3a3a3a 100%)',
            padding: '25px',
            borderRadius: '12px',
            border: '1px solid #444',
            margin: '25px 0',
            textAlign: 'center'
          }}>
            <h3 style={{ 
              margin: '0 0 15px 0', 
              fontSize: '20px', 
              color: '#ffffff',
              fontWeight: '600'
            }}>
              {articleTitle}
            </h3>

            {summary && (
              <p style={{ 
                margin: '0 0 20px 0', 
                fontSize: '14px', 
                color: '#cccccc',
                lineHeight: '1.5'
              }}>
                {summary}
              </p>
            )}

            <a href={articleUrl} style={{
              display: 'inline-block',
              background: 'linear-gradient(135deg, #007bff 0%, #0056b3 100%)',
              color: 'white',
              padding: '12px 30px',
              textDecoration: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              fontSize: '16px',
              transition: 'all 0.3s ease',
              border: 'none',
              cursor: 'pointer'
            }}>
              📖 Lire l&apos;article
            </a>
          </div>

          <p style={{ 
            margin: '25px 0 0 0', 
            fontSize: '14px', 
            color: '#aaaaaa',
            textAlign: 'center'
          }}>
            Merci de faire partie de notre communauté TechAnswers !
          </p>
        </div>

        {/* Footer */}
        <div style={{
          textAlign: 'center',
          marginTop: '20px',
          padding: '20px',
          color: '#888888',
          fontSize: '12px'
        }}>
          <p style={{ margin: '0 0 10px 0' }}>
            Cet email a été envoyé automatiquement par TechAnswers
          </p>
          <p style={{ margin: 0 }}>
            © 2024 TechAnswers. Tous droits réservés.
          </p>
        </div>
      </div>
    </div>
  );
} 