import React from 'react';

interface SecurityAlertTemplateProps {
  username: string;
  alertType: 'LOGIN_ATTEMPT' | 'PASSWORD_CHANGE' | '2FA_ENABLED' | '2FA_DISABLED' | 'SUSPICIOUS_ACTIVITY';
  message: string;
  details?: string;
  timestamp: string;
  securityUrl?: string;
}

export default function SecurityAlertTemplate({
  username,
  alertType,
  message,
  details,
  timestamp,
  securityUrl
}: SecurityAlertTemplateProps) {
  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'LOGIN_ATTEMPT': return '🔐';
      case 'PASSWORD_CHANGE': return '🔑';
      case '2FA_ENABLED': return '✅';
      case '2FA_DISABLED': return '⚠️';
      case 'SUSPICIOUS_ACTIVITY': return '🚨';
      default: return '🔒';
    }
  };

  const getAlertTitle = (type: string) => {
    switch (type) {
      case 'LOGIN_ATTEMPT': return 'Tentative de Connexion';
      case 'PASSWORD_CHANGE': return 'Changement de Mot de Passe';
      case '2FA_ENABLED': return 'Authentification à 2 Facteurs Activée';
      case '2FA_DISABLED': return 'Authentification à 2 Facteurs Désactivée';
      case 'SUSPICIOUS_ACTIVITY': return 'Activité Suspecte Détectée';
      default: return 'Alerte de Sécurité';
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'LOGIN_ATTEMPT': return '#ff6b6b';
      case 'PASSWORD_CHANGE': return '#4ecdc4';
      case '2FA_ENABLED': return '#51cf66';
      case '2FA_DISABLED': return '#ffd43b';
      case 'SUSPICIOUS_ACTIVITY': return '#ff922b';
      default: return '#868e96';
    }
  };

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
          <div style={{
            fontSize: '48px',
            marginBottom: '15px'
          }}>
            {getAlertIcon(alertType)}
          </div>
          <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 'bold' }}>
            {getAlertTitle(alertType)}
          </h1>
          <p style={{ margin: '10px 0 0 0', opacity: 0.9 }}>
            TechAnswers - Sécurité
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
            {message}
          </p>

          {/* Alert Details */}
          <div style={{
            background: 'linear-gradient(135deg, #2a2a2a 0%, #3a3a3a 100%)',
            padding: '25px',
            borderRadius: '12px',
            border: `2px solid ${getAlertColor(alertType)}`,
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
                background: getAlertColor(alertType),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '15px',
                fontSize: '20px'
              }}>
                {getAlertIcon(alertType)}
              </div>
              <div>
                <h4 style={{ 
                  margin: '0 0 5px 0', 
                  fontSize: '18px', 
                  color: '#ffffff',
                  fontWeight: '600'
                }}>
                  {getAlertTitle(alertType)}
                </h4>
                <span style={{ 
                  fontSize: '12px', 
                  color: '#aaaaaa'
                }}>
                  {timestamp}
                </span>
              </div>
            </div>

            {details && (
              <div style={{
                background: 'rgba(0,0,0,0.3)',
                padding: '15px',
                borderRadius: '8px',
                marginBottom: '20px'
              }}>
                <p style={{ 
                  margin: '0 0 10px 0', 
                  fontSize: '14px', 
                  color: '#ffffff',
                  fontWeight: '600'
                }}>
                  Détails :
                </p>
                <p style={{ 
                  margin: 0, 
                  fontSize: '13px', 
                  color: '#cccccc',
                  lineHeight: '1.4'
                }}>
                  {details}
                </p>
              </div>
            )}

            {securityUrl && (
              <a href={securityUrl} style={{
                display: 'inline-block',
                background: 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)',
                color: 'white',
                padding: '12px 25px',
                textDecoration: 'none',
                borderRadius: '6px',
                fontWeight: '600',
                fontSize: '14px',
                transition: 'all 0.3s ease',
                border: 'none',
                cursor: 'pointer'
              }}>
                🔒 Vérifier la Sécurité
              </a>
            )}
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            padding: '20px',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            margin: '25px 0'
          }}>
            <h4 style={{ 
              margin: '0 0 15px 0', 
              fontSize: '16px', 
              color: '#ffffff',
              textAlign: 'center'
            }}>
              💡 Conseils de Sécurité
            </h4>
            <ul style={{
              margin: 0,
              paddingLeft: '20px',
              color: '#cccccc',
              fontSize: '14px'
            }}>
              <li>Utilisez des mots de passe forts et uniques</li>
              <li>Activez l&apos;authentification à 2 facteurs</li>
              <li>Surveillez régulièrement vos connexions</li>
              <li>Contactez-nous si vous ne reconnaissez pas cette activité</li>
            </ul>
          </div>

          <p style={{ 
            margin: '25px 0 0 0', 
            fontSize: '14px', 
            color: '#aaaaaa',
            textAlign: 'center'
          }}>
            Votre sécurité est notre priorité absolue.
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