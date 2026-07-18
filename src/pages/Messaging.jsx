import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Hash, Users, Send, Smile, Paperclip, Search } from 'lucide-react';
import { mesajKanallari, mesajlar as mesajData } from '../data/mockData';

const avatarColors = ['#3b82f6', '#818cf8', '#fb923c', '#34d399', '#fbbf24', '#f87171'];

export default function Messaging() {
  const [activeKanal, setActiveKanal] = useState('k-001');
  const [mesajText, setMesajText] = useState('');
  const [mesajlar, setMesajlar] = useState(mesajData);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mesajlar, activeKanal]);

  const kanal = mesajKanallari.find(k => k.id === activeKanal);
  const kanalMesajlar = mesajlar[activeKanal] || [];

  const sendMessage = () => {
    if (!mesajText.trim()) return;
    const newMsg = {
      id: `m-new-${Date.now()}`,
      kanalId: activeKanal,
      gonderen: 'Mete K.',
      avatar: 'MK',
      icerik: mesajText,
      zaman: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
      benim: true,
      renk: '#3b82f6',
    };
    setMesajlar(prev => ({ ...prev, [activeKanal]: [...(prev[activeKanal] || []), newMsg] }));
    setMesajText('');
  };

  return (
    <div>
      <h1 className="page-title" style={{ marginBottom: 20 }}>Mesajlaşma</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 0, height: 620, borderRadius: 14, overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
        {/* Sidebar */}
        <div style={{ background: 'var(--bg-card)', borderRight: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '14px 12px', borderBottom: '1px solid var(--border-subtle)' }}>
            <div style={{ position: 'relative' }}>
              <Search size={12} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input placeholder="Kanal ara..." style={{ width: '100%', background: 'var(--glass-bg)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: '7px 10px 7px 28px', color: 'var(--text-primary)', fontSize: 12, fontFamily: 'Inter, sans-serif', outline: 'none', boxSizing: 'border-box' }} />
            </div>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '8px 8px' }}>
            {[
              { label: 'Genel', items: mesajKanallari.filter(k => k.tip === 'genel') },
              { label: 'Projeler', items: mesajKanallari.filter(k => k.tip === 'proje') },
              { label: 'Departmanlar', items: mesajKanallari.filter(k => k.tip === 'departman') },
            ].map(group => (
              <div key={group.label} style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.8px', textTransform: 'uppercase', padding: '4px 8px', marginBottom: 4 }}>{group.label}</div>
                {group.items.map(kanal => {
                  const isActive = activeKanal === kanal.id;
                  const unread = kanal.tip === 'genel' && kanal.id !== activeKanal;
                  return (
                    <button key={kanal.id} onClick={() => setActiveKanal(kanal.id)} style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', padding: '7px 10px', borderRadius: 7, border: 'none', background: isActive ? 'rgba(59,130,246,0.12)' : 'transparent', color: isActive ? '#3b82f6' : 'var(--text-secondary)', cursor: 'pointer', fontSize: 13, fontFamily: 'Inter, sans-serif', transition: 'all 0.15s', marginBottom: 2, textAlign: 'left' }}>
                      <Hash size={12} style={{ flexShrink: 0, opacity: 0.6 }} />
                      <span style={{ flex: 1 }}>{kanal.ad}</span>
                      {unread && <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#3b82f6', flexShrink: 0 }} />}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>

          <div style={{ padding: '10px 12px', borderTop: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #00D4FF, #7B2FFF)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', flexShrink: 0 }}>MK</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Mete K.</div>
                <div style={{ fontSize: 11, color: '#34d399', display: 'flex', alignItems: 'center', gap: 4 }}><div style={{ width: 6, height: 6, borderRadius: '50%', background: '#34d399' }} /> Çevrimiçi</div>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div style={{ background: 'var(--bg-body)', display: 'flex', flexDirection: 'column' }}>
          {/* Header */}
          <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: 12 }}>
            <Hash size={16} color="var(--text-muted)" />
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{kanal?.ad}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}><Users size={10} style={{ display: 'inline', marginRight: 4 }} />{kanal?.uyeSayisi} üye</div>
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 4 }}>
            {kanalMesajlar.length === 0 ? (
              <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 14, paddingTop: 40 }}>Bu kanalda henüz mesaj yok</div>
            ) : kanalMesajlar.map((msg, i) => {
              const prevSame = i > 0 && kanalMesajlar[i - 1].gonderen === msg.gonderen;
              return (
                <motion.div key={msg.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} style={{ display: 'flex', gap: 10, flexDirection: msg.benim ? 'row-reverse' : 'row', marginTop: prevSame ? 2 : 12 }}>
                  {!prevSame && !msg.benim && (
                    <div style={{ width: 34, height: 34, borderRadius: '50%', background: `${msg.renk}20`, border: `1.5px solid ${msg.renk}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: msg.renk, flexShrink: 0 }}>{msg.avatar}</div>
                  )}
                  {prevSame && !msg.benim && <div style={{ width: 34, flexShrink: 0 }} />}
                  <div style={{ maxWidth: '68%' }}>
                    {!prevSame && !msg.benim && (
                      <div style={{ fontSize: 11, fontWeight: 600, color: msg.renk, marginBottom: 3 }}>{msg.gonderen} <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>{msg.zaman}</span></div>
                    )}
                    <div style={{
                      padding: '9px 14px', borderRadius: msg.benim ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                      background: msg.benim ? 'linear-gradient(135deg, rgba(0,212,255,0.2), rgba(123,47,255,0.15))' : 'var(--border-subtle)',
                      border: `1px solid ${msg.benim ? 'rgba(0,212,255,0.2)' : 'var(--border-subtle)'}`,
                      fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.5, whiteSpace: 'pre-wrap',
                    }}>{msg.icerik}</div>
                    {(!prevSame || msg.benim) && <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2, textAlign: msg.benim ? 'right' : 'left' }}>{msg.zaman}</div>}
                  </div>
                </motion.div>
              );
            })}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={{ padding: '12px 20px', borderTop: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', background: 'var(--glass-bg)', border: '1px solid var(--border-subtle)', borderRadius: 12, padding: '4px 4px 4px 14px' }}>
              <input
                value={mesajText}
                onChange={e => setMesajText(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), sendMessage())}
                placeholder={`#${kanal?.ad?.replace(/[^\w\s]/gi, '').trim()} kanalına yaz...`}
                style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-primary)', fontSize: 13, fontFamily: 'Inter, sans-serif' }}
              />
              <button onClick={() => alert('Dosya ekleme menüsü açılıyor...')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 6 }}><Paperclip size={15} /></button>
              <button onClick={() => alert('Emoji paleti açılıyor...')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 6 }}><Smile size={15} /></button>
              <motion.button onClick={sendMessage} whileTap={{ scale: 0.9 }} style={{ width: 36, height: 36, borderRadius: 9, border: 'none', cursor: 'pointer', background: mesajText.trim() ? 'linear-gradient(135deg, #00D4FF, #7B2FFF)' : 'var(--border-subtle)', color: mesajText.trim() ? 'white' : 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', flexShrink: 0 }}>
                <Send size={15} />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
