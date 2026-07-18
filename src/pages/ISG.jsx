import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, AlertOctagon, Users, Shield, Plus, X, AlertTriangle, Zap, BookOpen, Calendar, HardHat, Check } from 'lucide-react';
import useERP from '../store/useERP';

const agirlikColors = { kritik: '#f87171', yüksek: '#fb923c', orta: '#fbbf24', hafif: '#34d399' };
const tipColors = { 'ramak-kala': '#fbbf24', kaza: '#f87171', denetim: '#3b82f6' };
const tipIcons = { 'ramak-kala': '⚡', kaza: '🩹', denetim: '📋' };

const getRiskColor = (olasilik, siddet) => {
  const score = olasilik * siddet;
  if (score >= 9) return '#f87171';
  if (score >= 6) return '#fb923c';
  if (score >= 3) return '#fbbf24';
  return '#34d399';
};

export default function ISG() {
  const { isgOlaylar, isgEgitimler, riskMatrisi, addIsgOlay } = useERP();
  const [activeTab, setActiveTab] = useState('olaylar');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ title: '', type: 'ramak-kala', severity: 'hafif', reporter: '', category: 'Genel', date: new Date().toISOString().split('T')[0], solution: '' });

  const handleModalSubmit = (e) => {
    e.preventDefault();
    if (formData.title) {
      addIsgOlay({
        id: Date.now(),
        baslik: formData.title,
        tip: formData.type,
        agirlik: formData.severity,
        bildiren: formData.reporter || 'Anonim',
        kategori: formData.category,
        tarih: formData.date,
        cozum: formData.solution
      });
      setShowModal(false);
      setFormData({ title: '', type: 'ramak-kala', severity: 'hafif', reporter: '', category: 'Genel', date: new Date().toISOString().split('T')[0], solution: '' });
    }
  };

  const kazaSayisi = isgOlaylar.filter(o => o.tip === 'kaza').length;
  const ramakKalaSayisi = isgOlaylar.filter(o => o.tip === 'ramak-kala').length;
  const tamamlananEgitim = isgEgitimler.filter(e => e.durum === 'tamamlandı').length;
  const planEgitim = isgEgitimler.filter(e => e.durum === 'planlandı').length;

  // Build 3x3 risk grid
  const riskGrid = [];
  for (let o = 3; o >= 1; o--) {
    for (let s = 1; s <= 3; s++) {
      const cell = riskMatrisi.find(r => r.olasilik === o && r.siddet === s);
      riskGrid.push({ olasilik: o, siddet: s, ...cell });
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 className="page-title">İSG — İş Sağlığı & Güvenliği</h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>Kaza/ramak kala kaydı, risk değerlendirmesi ve eğitim takibi</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={14} /> Olay Bildir
        </button>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'Kaza Sayısı', val: kazaSayisi, sub: 'Bu ay', color: '#f87171', icon: AlertTriangle },
          { label: 'Ramak Kala', val: ramakKalaSayisi, sub: 'Bu ay', color: '#fbbf24', icon: Zap },
          { label: 'Eğitim Tamamlandı', val: tamamlananEgitim, sub: `${planEgitim} planlandı`, color: '#34d399', icon: BookOpen },
          { label: 'Sıfır Kaza Gün', val: 42, sub: 'Streak', color: '#3b82f6', icon: ShieldAlert },
        ].map((item, i) => {
          const ItemIcon = item.icon;
          return (
            <motion.div key={item.label} className="glass-card" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }} style={{ padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: `${item.color}18`, border: `1px solid ${item.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ItemIcon size={17} color={item.color} />
                </div>
              </div>
              <div style={{ fontSize: 30, fontWeight: 700, color: item.color, fontFamily: 'Outfit, sans-serif', marginBottom: 4 }}>{item.val}</div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 2 }}>{item.label}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{item.sub}</div>
            </motion.div>
          );
        })}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 12, padding: 4, marginBottom: 20, width: 'fit-content' }}>
        {['olaylar', 'risk', 'egitimler', 'kkd'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: '7px 16px', borderRadius: 9, border: 'none', cursor: 'pointer', background: activeTab === tab ? 'rgba(248,113,113,0.12)' : 'transparent', color: activeTab === tab ? '#ef4444' : 'var(--text-secondary)', fontSize: 13, fontFamily: 'Inter, sans-serif', transition: 'all 0.2s' }}>
            {tab === 'olaylar' ? 'Olaylar' : tab === 'risk' ? 'Risk Matrisi' : tab === 'egitimler' ? 'Eğitimler' : 'KKD & Zimmet'}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'olaylar' && (
          <motion.div key="olaylar" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {isgOlaylar.map((olay, i) => {
                const tColor = tipColors[olay.tip] || '#aaa';
                const aColor = agirlikColors[olay.agirlik] || 'rgba(255,255,255,0.3)';
                return (
                  <motion.div key={olay.id} className="glass-card" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }} style={{ padding: 16, borderLeft: `3px solid ${tColor}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                          <span style={{ fontSize: 16 }}>{tipIcons[olay.tip]}</span>
                          <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{olay.baslik}</span>
                          <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 4, background: `${tColor}18`, color: tColor, border: `1px solid ${tColor}30` }}>{olay.tip}</span>
                          {olay.agirlik && <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 4, background: `${aColor}18`, color: aColor, border: `1px solid ${aColor}30` }}>{olay.agirlik}</span>}
                        </div>
                        <div style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'flex', gap: 16, marginBottom: 6 }}>
                          <span>📂 {olay.kategori}</span>
                          <span>👤 {olay.bildiren}</span>
                          <span>📅 {olay.tarih}</span>
                        </div>
                        <div style={{ fontSize: 13, color: 'var(--text-secondary)', background: 'var(--glass-bg)', padding: '8px 10px', borderRadius: 7 }}>{olay.cozum}</div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {activeTab === 'risk' && (
          <motion.div key="risk" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              <div className="glass-card" style={{ padding: 24 }}>
                <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 20 }}>Risk Matrisi (Olasılık × Şiddet)</h3>
                <div style={{ marginBottom: 8, display: 'flex', justifyContent: 'flex-end', gap: 4, paddingRight: 8 }}>
                  {['Düşük', 'Orta', 'Yüksek'].map((l, i) => (
                    <div key={l} style={{ flex: 1, textAlign: 'center', fontSize: 10, color: 'var(--text-secondary)', fontWeight: 600 }}>{l} ŞİDDET</div>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  {/* Y Axis labels */}
                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around', paddingBottom: 4 }}>
                    {['Yüksek', 'Orta', 'Düşük'].map(l => (
                      <div key={l} style={{ fontSize: 9, color: 'var(--text-muted)', textAlign: 'right', lineHeight: 1.2, width: 40 }}>{l}<br/>OLAS.</div>
                    ))}
                  </div>
                  <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
                    {riskGrid.map((cell, i) => {
                      const color = getRiskColor(cell.olasilik, cell.siddet);
                      return (
                        <div key={i} style={{ aspectRatio: '1', borderRadius: 10, background: `${color}20`, border: `2px solid ${color}40`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 4, position: 'relative' }}>
                          {cell.sayi && <div style={{ fontSize: 20, fontWeight: 800, color, fontFamily: 'Outfit, sans-serif' }}>{cell.sayi}</div>}
                          {cell.baslik && <div style={{ fontSize: 8, color: 'var(--text-secondary)', textAlign: 'center', lineHeight: 1.2 }}>{cell.baslik}</div>}
                          {!cell.sayi && <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>—</div>}
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
                  {[{ l: 'Kabul Edilemez', c: '#f87171' }, { l: 'Yüksek', c: '#fb923c' }, { l: 'Orta', c: '#fbbf24' }, { l: 'Düşük', c: '#34d399' }].map(item => (
                    <div key={item.l} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <div style={{ width: 10, height: 10, borderRadius: 2, background: item.c }} />
                      <span style={{ fontSize: 9, color: 'var(--text-secondary)' }}>{item.l}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="glass-card" style={{ padding: 20 }}>
                <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 16 }}>Aktif Riskler</h3>
                {riskMatrisi.map((r, i) => {
                  const color = getRiskColor(r.olasilik, r.siddet);
                  const score = r.olasilik * r.siddet;
                  return (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', background: 'var(--glass-bg)', borderRadius: 9, marginBottom: 6, border: `1px solid ${color}20` }}>
                      <div style={{ width: 36, height: 36, borderRadius: 8, background: `${color}18`, border: `1px solid ${color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color, fontSize: 14, fontFamily: 'Outfit, sans-serif', flexShrink: 0 }}>{score}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{r.baslik}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>O:{r.olasilik} × Ş:{r.siddet} = {score} · {r.sayi} kayıt</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'egitimler' && (
          <motion.div key="egitimler" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {isgEgitimler.map((eg, i) => {
                const done = eg.durum === 'tamamlandı';
                return (
                  <motion.div key={eg.id} className="glass-card" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }} style={{ padding: 16, borderLeft: `3px solid ${done ? '#34d399' : '#fbbf24'}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>{eg.ad}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'flex', gap: 16 }}>
                          <span>📅 {eg.tarih}</span>
                          <span>⏱ {eg.sure} saat</span>
                          <span><Users size={11} style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }} />{eg.katilimcilar.length} kişi</span>
                        </div>
                      </div>
                      <span style={{ fontSize: 11, padding: '4px 12px', borderRadius: 8, background: done ? 'rgba(0,255,179,0.12)' : 'rgba(255,211,61,0.12)', color: done ? '#34d399' : '#fbbf24', border: `1px solid ${done ? 'rgba(0,255,179,0.25)' : 'rgba(255,211,61,0.25)'}`, fontWeight: 600 }}>{done ? '✓ Tamamlandı' : '📅 Planlandı'}</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {activeTab === 'kkd' && (
          <motion.div key="kkd" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 className="section-title" style={{ margin: 0 }}>Kişisel Koruyucu Donanım (KKD) Zimmetleri</h3>
                <button className="btn btn-primary" style={{ fontSize: 11, padding: '6px 12px' }}>Zimmet Fişi Yazdır</button>
              </div>
              <table className="erp-table">
                <thead>
                  <tr>
                    <th>Personel</th>
                    <th style={{ textAlign: 'center' }}>Baret</th>
                    <th style={{ textAlign: 'center' }}>Yelek</th>
                    <th style={{ textAlign: 'center' }}>Gözlük</th>
                    <th style={{ textAlign: 'center' }}>Eldiven</th>
                    <th style={{ textAlign: 'center' }}>Çelik Burun</th>
                    <th>Zimmet Tarihi</th>
                    <th>Durum</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { id: 1, isim: 'Ahmet Yılmaz', baret: true, yelek: true, gozluk: true, eldiven: true, ayak: true, tarih: '2024-05-18' },
                    { id: 2, isim: 'Mehmet Demir', baret: true, yelek: true, gozluk: false, eldiven: true, ayak: true, tarih: '2024-05-19' },
                    { id: 3, isim: 'Can Kaya', baret: false, yelek: false, gozluk: false, eldiven: false, ayak: false, tarih: '-' },
                  ].map(p => (
                    <tr key={p.id}>
                      <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{p.isim}</td>
                      <td style={{ textAlign: 'center' }}>{p.baret ? <Check size={16} color="#34d399" style={{ margin: 'auto' }} /> : <X size={16} color="#f87171" style={{ margin: 'auto' }} />}</td>
                      <td style={{ textAlign: 'center' }}>{p.yelek ? <Check size={16} color="#34d399" style={{ margin: 'auto' }} /> : <X size={16} color="#f87171" style={{ margin: 'auto' }} />}</td>
                      <td style={{ textAlign: 'center' }}>{p.gozluk ? <Check size={16} color="#34d399" style={{ margin: 'auto' }} /> : <X size={16} color="#f87171" style={{ margin: 'auto' }} />}</td>
                      <td style={{ textAlign: 'center' }}>{p.eldiven ? <Check size={16} color="#34d399" style={{ margin: 'auto' }} /> : <X size={16} color="#f87171" style={{ margin: 'auto' }} />}</td>
                      <td style={{ textAlign: 'center' }}>{p.ayak ? <Check size={16} color="#34d399" style={{ margin: 'auto' }} /> : <X size={16} color="#f87171" style={{ margin: 'auto' }} />}</td>
                      <td style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{p.tarih}</td>
                      <td>
                        <span style={{ fontSize: 11, padding: '4px 8px', borderRadius: 6, background: p.tarih !== '-' ? 'rgba(52,211,153,0.1)' : 'rgba(251,191,36,0.1)', color: p.tarih !== '-' ? '#34d399' : '#fbbf24' }}>
                          {p.tarih !== '-' ? 'İmzalandı' : 'Eksik'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* New ISG Modal */}
      <AnimatePresence>
        {showModal && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)' }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 16, width: 450, padding: 24, boxShadow: 'var(--shadow-lg)' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h3 style={{ margin: 0, color: 'var(--text-primary)', fontSize: 18, fontFamily: 'Outfit, sans-serif' }}>Yeni İSG Olay Bildirimi</h3>
                <button onClick={() => setShowModal(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex' }}><X size={20} /></button>
              </div>

              <form onSubmit={handleModalSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6 }}>Olay Başlığı</label>
                  <input required type="text" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="search-input" style={{ width: '100%', padding: '10px 14px' }} placeholder="Örn: İskeleye emniyet kemersiz çıkış" />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6 }}>Olay Tipi</label>
                    <select value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })} className="search-input" style={{ width: '100%', padding: '10px 14px', appearance: 'none' }}>
                      <option value="ramak-kala">Ramak Kala</option>
                      <option value="kaza">Kaza</option>
                      <option value="uygunsuzluk">Uygunsuzluk</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6 }}>Ağırlık (Şiddet)</label>
                    <select value={formData.severity} onChange={e => setFormData({ ...formData, severity: e.target.value })} className="search-input" style={{ width: '100%', padding: '10px 14px', appearance: 'none' }}>
                      <option value="hafif">Hafif</option>
                      <option value="orta">Orta</option>
                      <option value="ciddi">Ciddi</option>
                      <option value="kritik">Kritik</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6 }}>Bildiren Kişi</label>
                  <input type="text" value={formData.reporter} onChange={e => setFormData({ ...formData, reporter: e.target.value })} className="search-input" style={{ width: '100%', padding: '10px 14px' }} placeholder="Örn: Ahmet Yılmaz" />
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 10 }}>
                  <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>İptal</button>
                  <button type="submit" className="btn btn-primary">Kaydet</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
