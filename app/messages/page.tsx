'use client';

import { useState } from 'react';

interface PredefinedMessage {
  id: string;
  label: string;
  content: string;
}

const defaultMessages: PredefinedMessage[] = [
  {
    id: 'err119',
    label: 'ERR119',
    content: `Bonjour, l'erreur logon #ERR119 indique que le code renseigné n'existe pas côté bandeau. Pour ajouter un numéro (SDA) il faut faire une demande SNOW via le chemin suivant : SNOW > Demande > SDA. J'ai toutefois procédé exceptionnellement à l'ajout de ce numéro. Il ne devrait plus y avoir d'erreur à la connexion du bandeau avec ce numéro. Cordialement`,
  },
];

export default function MessagesPage() {
  const [messages, setMessages] = useState<PredefinedMessage[]>(defaultMessages);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newLabel, setNewLabel] = useState('');
  const [newContent, setNewContent] = useState('');

  const handleCopy = async (message: PredefinedMessage) => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopiedId(message.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleAddMessage = () => {
    if (!newLabel.trim() || !newContent.trim()) return;

    const newMessage: PredefinedMessage = {
      id: Date.now().toString(),
      label: newLabel,
      content: newContent,
    };

    setMessages([...messages, newMessage]);
    setNewLabel('');
    setNewContent('');
    setIsAddingNew(false);
  };

  const handleDeleteMessage = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce message ?')) {
      setMessages(messages.filter((m) => m.id !== id));
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <div
        style={{
          marginBottom: '1.25rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <h1
          style={{
            fontSize: '1.75rem',
            fontWeight: '700',
            color: 'var(--color-primary-dark)',
            margin: 0,
          }}
        >
          Messages prédéfinis
        </h1>
        <button
          onClick={() => setIsAddingNew(true)}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: 'var(--color-secondary-blue)',
            color: 'var(--color-white)',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '0.9rem',
            fontWeight: '500',
            transition: 'background-color 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#2f4fb5';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--color-secondary-blue)';
          }}
        >
          + Nouveau message
        </button>
      </div>

      <div
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.4)',
          backdropFilter: 'blur(15px)',
          borderRadius: '8px',
          padding: '1.5rem',
          boxShadow: '0 2px 8px rgba(29, 30, 60, 0.08)',
          border: '1px solid rgba(230, 225, 219, 0.3)',
        }}
      >
        {isAddingNew && (
          <div
            style={{
              backgroundColor: 'rgba(176, 191, 240, 0.1)',
              border: '1px solid rgba(176, 191, 240, 0.3)',
              borderRadius: '6px',
              padding: '1rem',
              marginBottom: '1rem',
            }}
          >
            <div style={{ marginBottom: '0.75rem' }}>
              <label
                htmlFor="newLabel"
                style={{
                  display: 'block',
                  marginBottom: '0.25rem',
                  fontSize: '0.8rem',
                  color: 'var(--color-primary-dark)',
                  fontWeight: '500',
                }}
              >
                Libellé
              </label>
              <input
                id="newLabel"
                type="text"
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                placeholder="Ex: ERR119"
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '2px solid var(--color-neutral-beige)',
                  borderRadius: '4px',
                  fontSize: '0.85rem',
                  outline: 'none',
                }}
                autoFocus
              />
            </div>
            <div style={{ marginBottom: '0.75rem' }}>
              <label
                htmlFor="newContent"
                style={{
                  display: 'block',
                  marginBottom: '0.25rem',
                  fontSize: '0.8rem',
                  color: 'var(--color-primary-dark)',
                  fontWeight: '500',
                }}
              >
                Contenu du message
              </label>
              <textarea
                id="newContent"
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder="Votre message..."
                rows={4}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '2px solid var(--color-neutral-beige)',
                  borderRadius: '4px',
                  fontSize: '0.85rem',
                  outline: 'none',
                  resize: 'vertical',
                  fontFamily: 'inherit',
                }}
              />
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
              <button
                onClick={() => {
                  setIsAddingNew(false);
                  setNewLabel('');
                  setNewContent('');
                }}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: 'var(--color-neutral-beige)',
                  color: 'var(--color-primary-dark)',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  fontWeight: '500',
                }}
              >
                Annuler
              </button>
              <button
                onClick={handleAddMessage}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: 'var(--color-secondary-blue)',
                  color: 'var(--color-white)',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  fontWeight: '500',
                }}
              >
                Ajouter
              </button>
            </div>
          </div>
        )}

        <div style={{ display: 'grid', gap: '0.75rem' }}>
          {messages.map((message) => (
            <div
              key={message.id}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.6)',
                backdropFilter: 'blur(10px)',
                borderRadius: '8px',
                padding: '1rem',
                border: '1px solid rgba(230, 225, 219, 0.5)',
                boxShadow: '0 1px 3px rgba(29, 30, 60, 0.08)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '0.5rem',
                }}
              >
                <h3
                  style={{
                    fontSize: '1rem',
                    fontWeight: '600',
                    color: 'var(--color-primary-dark)',
                    margin: 0,
                  }}
                >
                  {message.label}
                </h3>
                <div style={{ display: 'flex', gap: '0.25rem' }}>
                  <button
                    onClick={() => handleCopy(message)}
                    style={{
                      padding: '0.4rem 0.75rem',
                      backgroundColor:
                        copiedId === message.id
                          ? 'var(--color-accent-green)'
                          : 'var(--color-secondary-blue)',
                      color: 'var(--color-white)',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '0.8rem',
                      fontWeight: '500',
                      transition: 'background-color 0.2s',
                    }}
                  >
                    {copiedId === message.id ? 'Copié !' : 'Copier'}
                  </button>
                  <button
                    onClick={() => handleDeleteMessage(message.id)}
                    style={{
                      width: '28px',
                      height: '28px',
                      backgroundColor: 'transparent',
                      color: 'rgba(217, 36, 36, 0.5)',
                      border: '1px solid rgba(217, 36, 36, 0.2)',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      transition: 'all 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(217, 36, 36, 0.1)';
                      e.currentTarget.style.color = 'var(--color-accent-red)';
                      e.currentTarget.style.borderColor = 'var(--color-accent-red)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = 'rgba(217, 36, 36, 0.5)';
                      e.currentTarget.style.borderColor = 'rgba(217, 36, 36, 0.2)';
                    }}
                    title="Supprimer"
                  >
                    🗑️
                  </button>
                </div>
              </div>
              <p
                style={{
                  fontSize: '0.85rem',
                  color: 'var(--color-primary-blue)',
                  margin: 0,
                  lineHeight: '1.5',
                  whiteSpace: 'pre-wrap',
                }}
              >
                {message.content}
              </p>
            </div>
          ))}
        </div>

        {messages.length === 0 && !isAddingNew && (
          <div
            style={{
              textAlign: 'center',
              padding: '3rem 1rem',
              color: 'var(--color-primary-blue)',
            }}
          >
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💬</div>
            <p style={{ fontSize: '1.1rem', fontWeight: '500' }}>
              Aucun message prédéfini
            </p>
            <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
              Cliquez sur "Nouveau message" pour en ajouter un
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
