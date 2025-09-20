import React, { useEffect, useState } from 'react';

const EmailConfirmPage: React.FC = () => {
  const [status, setStatus] = useState<'success' | 'error' | 'missing-params'>('missing-params');
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    // Leggi i parametri URL
    const urlParams = new URLSearchParams(window.location.search);
    const requestId = urlParams.get('request_id');
    const statusParam = urlParams.get('status');

    console.log('📧 Email Confirm Page - Parametri ricevuti:', {
      request_id: requestId,
      status: statusParam,
      url: window.location.href
    });

    // Controllo parametri mancanti
    if (!requestId || !statusParam) {
      console.error('❌ Parametri mancanti:', { requestId, statusParam });
      setStatus('missing-params');
      setMessage('❌ Parametri mancanti');
      return;
    }

    // Funzione per effettuare la chiamata webhook
    const callWebhook = async () => {
      try {
        const webhookUrl = `https://n8n-h3a7.onrender.com/webhook/4968119c-0181-4f46-b137-893078b84a22?request_id=${encodeURIComponent(requestId)}&status=${encodeURIComponent(statusParam)}`;
        
        console.log('🔗 Chiamando webhook:', webhookUrl);

        const response = await fetch(webhookUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        console.log('📡 Webhook Response:', {
          status: response.status,
          statusText: response.statusText,
          ok: response.ok
        });

        if (response.ok) {
          // Determina il messaggio basato sullo status
          let successMessage = '';
          switch (statusParam) {
            case 'Letto':
              successMessage = '📖 Richiesta segnata come vista';
              break;
            case 'Completato':
              successMessage = '🛠️ Richiesta segnata come completata';
              break;
            default:
              successMessage = '✅ Stato aggiornato con successo';
              break;
          }

          setStatus('success');
          setMessage(successMessage);
          console.log('✅ Webhook chiamato con successo:', successMessage);
        } else {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
      } catch (error) {
        console.error('❌ Errore nella chiamata webhook:', error);
        setStatus('error');
        setMessage('⚠️ Errore nell\'aggiornamento');
      }
    };

    // Effettua la chiamata webhook
    callWebhook();
  }, []);

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        {/* Logo/Icon */}
        <div style={iconStyle}>
          {status === 'success' && '✅'}
          {status === 'error' && '⚠️'}
          {status === 'missing-params' && '❌'}
        </div>

        {/* Titolo */}
        <h1 style={titleStyle}>
          {status === 'success' && 'Conferma Riuscita'}
          {status === 'error' && 'Errore'}
          {status === 'missing-params' && 'Parametri Mancanti'}
        </h1>

        {/* Messaggio */}
        <p style={messageStyle}>
          {message}
        </p>

        {/* Footer informativo */}
        <div style={footerStyle}>
          <p style={footerTextStyle}>
            Puoi chiudere questa finestra
          </p>
        </div>
      </div>
    </div>
  );
};

// Stili inline per essere completamente standalone
const containerStyle: React.CSSProperties = {
  minHeight: '100vh',
  width: '100%',
  backgroundColor: '#111',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '20px',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  margin: 0,
};

const cardStyle: React.CSSProperties = {
  backgroundColor: '#1a1a1a',
  borderRadius: '12px',
  padding: '40px',
  textAlign: 'center',
  maxWidth: '500px',
  width: '100%',
  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
  border: '1px solid #333',
};

const iconStyle: React.CSSProperties = {
  fontSize: '3rem',
  marginBottom: '20px',
};

const titleStyle: React.CSSProperties = {
  color: '#ffffff',
  fontSize: '1.5rem',
  fontWeight: '600',
  marginBottom: '16px',
  margin: '0 0 16px 0',
};

const messageStyle: React.CSSProperties = {
  color: '#cccccc',
  fontSize: '1rem',
  lineHeight: '1.5',
  marginBottom: '20px',
};

const footerStyle: React.CSSProperties = {
  marginTop: '30px',
  paddingTop: '20px',
  borderTop: '1px solid #333',
};

const footerTextStyle: React.CSSProperties = {
  color: '#888',
  fontSize: '0.875rem',
  margin: 0,
};

// Aggiungi l'animazione CSS tramite style tag
const styleElement = document.createElement('style');
styleElement.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(styleElement);

export default EmailConfirmPage;