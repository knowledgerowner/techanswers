import React from 'react';

interface CommentReplyTemplateProps {
  username: string;
  commentUrl: string;
  articleTitle: string;
  replyAuthor: string;
  replyContent: string;
  timestamp: string;
}

export default function CommentReplyTemplate({
  username,
  commentUrl,
  articleTitle,
  replyAuthor,
  replyContent,
  timestamp
}: CommentReplyTemplateProps) {
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
            💬 Nouvelle Réponse à Votre Commentaire
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
            Quelqu&apos;un a répondu à votre commentaire sur l&apos;article <strong>{articleTitle}</strong>
          </p>

          {/* Reply Card */}
          <div style={{
            background: 'linear-gradient(135deg, #2a2a2a 0%, #3a3a3a 100%)',
            padding: '25px',
            borderRadius: '12px',
            border: '1px solid #444',
            margin: '25px 0',
            textAlign: 'left'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '15px'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #007bff 0%, #0056b3 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '15px',
                fontSize: '18px',
                fontWeight: 'bold',
                color: 'white'
              }}>
                {replyAuthor.charAt(0).toUpperCase()}
              </div>
              <div>
                <h4 style={{ 
                  margin: '0 0 5px 0', 
                  fontSize: '16px', 
                  color: '#ffffff',
                  fontWeight: '600'
                }}>
                  {replyAuthor}
                </h4>
                <span style={{ 
                  fontSize: '12px', 
                  color: '#aaaaaa'
                }}>
                  {timestamp}
                </span>
              </div>
            </div>

            <p style={{ 
              margin: '0 0 20px 0', 
              fontSize: '14px', 
              color: '#cccccc',
              lineHeight: '1.5',
              fontStyle: 'italic'
            }}>
              &quot;{replyContent}&quot;
            </p>

            <a href={commentUrl} style={{
              display: 'inline-block',
              background: 'linear-gradient(135deg, #007bff 0%, #0056b3 100%)',
              color: 'white',
              padding: '10px 25px',
              textDecoration: 'none',
              borderRadius: '6px',
              fontWeight: '600',
              fontSize: '14px',
              transition: 'all 0.3s ease',
              border: 'none',
              cursor: 'pointer'
            }}>
              💬 Voir la discussion
            </a>
          </div>

          <p style={{ 
            margin: '25px 0 0 0', 
            fontSize: '14px', 
            color: '#aaaaaa',
            textAlign: 'center'
          }}>
            Continuez la conversation et partagez vos connaissances !
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