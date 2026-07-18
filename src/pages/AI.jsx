import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Send, TrendingDown, AlertTriangle, BarChart2, Zap, RefreshCw } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';

const anomalyData = [
  { gun: 'Pzt', maliyet: 2.1, norm: 2.0 },
  { gun: 'Sal', maliyet: 2.3, norm: 2.1 },
  { gun: 'Çar', maliyet: 4.8, norm: 2.2, anomali: true },
  { gun: 'Per', maliyet: 2.0, norm: 2.1 },
  { gun: 'Cum', maliyet: 2.2, norm: 2.2 },
  { gun: 'Cmt', maliyet: 1.1, norm: 1.5 },
  { gun: 'Paz', maliyet: 0.8, norm: 1.4 },
];

const autoReports = [
  { id: 1, tip: 'anomali', baslik: 'Maliyet Anomalisi Tespit Edildi', detay: 'Çarşamba günü maliyet beklenenden %118 yüksek gerçekleşti. Muhtemel neden: Beton pompası arızası ve ekstra işçilik.', renk: '#f87171', icon: AlertTriangle, zaman: '2 saat önce' },
  { id: 2, tip: 'tahmin', baslik: 'Bütçe Tüketim Tahmini', detay: 'Mevcut harcama hızıyla Maslak projesi bütçesi 47 gün içinde tükenecek. Revizyon önerilir.', renk: '#fbbf24', icon: TrendingDown, zaman: '6 saat önce' },
  { id: 3, tip: 'performans', baslik: 'Yüksek Performanslı Personel', detay: 'Bu hafta Leyla Çetin 98 puan ile en yüksek saha verimliliğine ulaştı. Aylık rekoru kırdı.', renk: '#34d399', icon: Zap, zaman: '1 gün önce' },
];

const suggestedQueries = [
  'Maslak projesinin bu ay tahmini maliyeti nedir?',
  'Hangi malzeme stokları kritik seviyede?',
  'Son 3 aydaki hakediş ödemelerini özetle',
  'En riskli proje hangisi ve neden?',
  'Bu hafta kaç personel çalıştı?',
];

const aiResponses = {
  'maslak': '📊 **Maslak Rezidans Kulesi** — Aralık 2024 Tahmini:\n\n• Gerçekleşen: ₺38.2M (%68 tüketim)\n• Aylık harcama hızı: ₺4.8M/ay\n• Tahmini tamamlama: 8.2 ay\n• ⚠️ Bütçe sapması: +₺2.1M (beton maliyeti yükselmesi)\n\nÖneri: Zemin ankrajı alt taşeron fiyatını yeniden müzakere edin.',
  'stok': '📦 **Kritik Stok Durumu:**\n\n• 🔴 Tünel Segment Kalıbı: 48 adet (Min: 20) — Yeterli ama dikkat!\n• ✅ Hazır Beton: 1.450 m³ — Normal\n• ✅ İnşaat Demiri: 320 ton — Normal\n\nSiparişe gerek yok, ancak Tünel projesinde hız artarsa Segment Kalıbı 3 hafta içinde kritik olabilir.',
  'default': '🤖 Anlıyorum! Veritabanını analiz ediyorum...\n\nSorgunuza uygun veri bulunamadı veya bu özellik geliştirme aşamasında. Şu konularda yardımcı olabilirim:\n- Proje maliyet analizi\n- Stok durumu\n- Personel performansı\n- Hakediş özetleri',
};

export default function AI() {
  const [messages, setMessages] = useState([
    { id: 0, role: 'ai', text: '👋 Merhaba! Ben **Saha AI**, İnşaat ERP\'nin yapay zeka asistanıyım.\n\nDoğal dil ile proje verilerinizi sorgulayabilir, anomalileri keşfedebilir ve otomatik raporlar alabilirsiniz.', time: 'Şimdi' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendQuery = (text) => {
    const q = text || input;
    if (!q.trim()) return;
    setInput('');
    setMessages(prev => [...prev, { id: Date.now(), role: 'user', text: q, time: 'Şimdi' }]);
    setLoading(true);
    setTimeout(() => {
      const lower = q.toLowerCase();
      const response = lower.includes('maslak') || lower.includes('tahmini') ? aiResponses['maslak'] :
        lower.includes('stok') || lower.includes('malzeme') ? aiResponses['stok'] :
        aiResponses['default'];
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'ai', text: response, time: 'Şimdi' }]);
      setLoading(false);
    }, 1200);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg, #7B2FFF, #00D4FF)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(123,47,255,0.4)' }}>
            <Sparkles size={20} color="white" />
          </div>
          <div>
            <h1 className="page-title" style={{ marginBottom: 0 }}>Saha AI</h1>
            <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Doğal dil sorgu · Anomali tespiti · Otomatik raporlar</p>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20 }}>
        {/* Chat */}
        <div>
          <div className="glass-card" style={{ padding: 0, overflow: 'hidden', marginBottom: 16 }}>
            <div style={{ height: 400, overflowY: 'auto', padding: '20px' }}>
              {messages.map((msg, i) => (
                <motion.div key={msg.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }} style={{ display: 'flex', gap: 12, flexDirection: msg.role === 'user' ? 'row-reverse' : 'row', marginBottom: 16 }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: msg.role === 'ai' ? 'linear-gradient(135deg, #7B2FFF, #00D4FF)' : 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: msg.role === 'ai' ? '0 0 14px rgba(123,47,255,0.4)' : 'none' }}>
                    {msg.role === 'ai' ? <Sparkles size={16} color="white" /> : <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-primary)' }}>MK</span>}
                  </div>
                  <div style={{ maxWidth: '75%', padding: '12px 16px', borderRadius: msg.role === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px', background: msg.role === 'user' ? 'rgba(0,212,255,0.15)' : 'rgba(123,47,255,0.12)', border: `1px solid ${msg.role === 'user' ? 'rgba(0,212,255,0.2)' : 'rgba(123,47,255,0.2)'}`, fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              {loading && (
                <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #7B2FFF, #00D4FF)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Sparkles size={16} color="white" />
                  </div>
                  <div style={{ padding: '14px 18px', borderRadius: '14px 14px 14px 4px', background: 'rgba(123,47,255,0.12)', border: '1px solid rgba(123,47,255,0.2)' }}>
                    <div style={{ display: 'flex', gap: 4 }}>
                      {[0, 1, 2].map(i => (
                        <motion.div key={i} animate={{ y: [0, -6, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }} style={{ width: 7, height: 7, borderRadius: '50%', background: '#818cf8' }} />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>
            <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center', background: 'var(--glass-bg)', borderRadius: 12, border: '1px solid var(--border-subtle)', padding: '4px 4px 4px 14px' }}>
                <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendQuery()} placeholder="Projeniz hakkında bir şey sorun..." style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-primary)', fontSize: 13, fontFamily: 'Inter, sans-serif' }} />
                <motion.button onClick={() => sendQuery()} whileTap={{ scale: 0.9 }} style={{ width: 36, height: 36, borderRadius: 9, border: 'none', cursor: 'pointer', background: input.trim() ? 'linear-gradient(135deg, #7B2FFF, #00D4FF)' : 'rgba(255,255,255,0.06)', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.2s' }}>
                  <Send size={15} />
                </motion.button>
              </div>
            </div>
          </div>

          {/* Suggested */}
          <div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8, fontWeight: 600 }}>ÖNERİLEN SORGULAR</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {suggestedQueries.map((q, i) => (
                <motion.button key={i} whileHover={{ y: -1 }} onClick={() => sendQuery(q)} style={{ padding: '6px 12px', borderRadius: 8, border: '1px solid rgba(123,47,255,0.3)', background: 'rgba(123,47,255,0.08)', color: 'var(--text-secondary)', fontSize: 12, cursor: 'pointer', fontFamily: 'Inter, sans-serif', transition: 'all 0.15s' }}>
                  {q}
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        {/* Insights */}
        <div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 10, fontWeight: 600, letterSpacing: '0.6px' }}>OTOMATİK RAPORLAR</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
            {autoReports.map((r, i) => {
              const ReportIcon = r.icon;
              return (
                <motion.div key={r.id} className="glass-card" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }} style={{ padding: 14, borderLeft: `3px solid ${r.renk}` }}>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <div style={{ width: 30, height: 30, borderRadius: 8, background: `${r.renk}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <ReportIcon size={14} color={r.renk} />
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>{r.baslik}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{r.detay}</div>
                      <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 6 }}>{r.zaman}</div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="glass-card" style={{ padding: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
              <AlertTriangle size={14} color="#f87171" /> Anomali Grafiği
            </div>
            <ResponsiveContainer width="100%" height={110}>
              <AreaChart data={anomalyData}>
                <XAxis dataKey="gun" tick={{ fill: 'var(--text-secondary)', fontSize: 11, fontWeight: 500 }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip contentStyle={{ background: '#ffffff', border: '1px solid var(--border-medium)', borderRadius: 8, fontSize: 12, color: 'var(--text-primary)' }} />
                <Area type="monotone" dataKey="norm" stroke="var(--border-medium)" fill="var(--bg-secondary)" strokeDasharray="5 3" strokeWidth={2} />
                <Area type="monotone" dataKey="maliyet" stroke="#ef4444" fill="rgba(239,68,68,0.14)" strokeWidth={3} dot={{ fill: '#ef4444', r: 4, strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
              </AreaChart>
            </ResponsiveContainer>
            <div style={{ fontSize: 11, color: '#f87171', textAlign: 'center', marginTop: 6 }}>Çarşamba anomalisi: +%118 sapma</div>
          </div>
        </div>
      </div>
    </div>
  );
}
