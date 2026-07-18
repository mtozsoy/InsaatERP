import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import { Gavel, FileSignature, TrendingUp, Clock, CheckCircle, Plus, Eye, X, PenTool, Loader } from 'lucide-react';
import useERP from '../store/useERP';

const statusColors = { tamamlandı: '#34d399', devam: '#3b82f6', planlama: '#fbbf24' };

export default function Tender() {
  const { ihaleler, teklifler, sozlesmeler, addIhale } = useERP();
  const [activeTab, setActiveTab] = useState('ihaleler');
  const [selectedIhale, setSelectedIhale] = useState(ihaleler[1]);
  const [showModal, setShowModal] = useState(false);
  const [eSignModal, setESignModal] = useState(false);
  const [signStatus, setSignStatus] = useState('idle');
  const [formData, setFormData] = useState({ title: '', type: 'Mal Alımı', start: '', end: '' });

  const handleSignContract = () => {
    setSignStatus('signing');
    setTimeout(() => {
      setSignStatus('success');
      setTimeout(() => {
        setESignModal(false);
        setSignStatus('idle');
      }, 2000);
    }, 2000);
  };

  const handleModalSubmit = (e) => {
    e.preventDefault();
    if (formData.title) {
      addIhale(formData);
      setShowModal(false);
      setFormData({ title: '', type: 'Mal Alımı', start: '', end: '' });
    }
  };

  const selectedTeklifler = teklifler.filter(t => t.ihaleId === selectedIhale?.id);
  const minTeklif = selectedTeklifler.length ? Math.min(...selectedTeklifler.map(t => t.tutar)) : 0;

  const radarData = selectedTeklifler.map(t => ({
    firma: t.firma.split(' ')[0],
    Fiyat: Math.round(100 - ((t.tutar - minTeklif) / minTeklif) * 50),
    Süre: t.sure,
    Puan: t.puan,
  }));

  const tabs = [
    { id: 'ihaleler', label: 'İhaleler', icon: Gavel },
    { id: 'teklifler', label: 'Teklif Kıyası', icon: TrendingUp },
    { id: 'sozlesmeler', label: 'Sözleşmeler', icon: FileSignature },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 className="page-title">e-İhale & Sözleşme</h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>Dijital ihale, teklif kıyası ve sözleşme yönetimi</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={14} /> Yeni İhale
        </button>
      </div>

      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'Aktif İhale', val: ihaleler.filter(i => i.status === 'devam').length, color: '#3b82f6', icon: Gavel },
          { label: 'Aktif Sözleşme', val: sozlesmeler.filter(s => s.status === 'aktif').length, color: '#818cf8', icon: FileSignature },
          { label: 'Toplam Sözleşme', val: `₺${(sozlesmeler.reduce((s, c) => s + c.tutar, 0) / 1e6).toFixed(1)}M`, color: '#34d399', icon: TrendingUp },
          { label: 'Bekleyen Teklif', val: teklifler.filter(t => t.durum === 'değerlendirme').length, color: '#fbbf24', icon: Clock },
        ].map((item, i) => {
          const ItemIcon = item.icon;
          return (
            <motion.div key={item.label} className="glass-card" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }} style={{ padding: 18 }}>
              <ItemIcon size={16} color={item.color} style={{ marginBottom: 10 }} />
              <div style={{ fontSize: 28, fontWeight: 700, color: item.color, fontFamily: 'Outfit, sans-serif' }}>{item.val}</div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>{item.label}</div>
            </motion.div>
          );
        })}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 12, padding: 4, marginBottom: 20, width: 'fit-content' }}>
        {tabs.map(tab => {
          const TabIcon = tab.icon;
          return (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 9, border: 'none', cursor: 'pointer', background: activeTab === tab.id ? 'rgba(59,130,246,0.12)' : 'transparent', color: activeTab === tab.id ? '#3b82f6' : 'var(--text-secondary)', fontSize: 13, fontFamily: 'Inter, sans-serif', transition: 'all 0.2s' }}>
              <TabIcon size={14} />{tab.label}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'ihaleler' && (
          <motion.div key="ihaleler" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {ihaleler.map((ihale, i) => (
                <motion.div key={ihale.id} className="glass-card" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} style={{ padding: 16, cursor: 'pointer', borderLeft: `3px solid ${statusColors[ihale.status] || '#888'}` }} onClick={() => { setSelectedIhale(ihale); setActiveTab('teklifler'); }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>{ihale.title}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'flex', gap: 16 }}>
                        <span>🏷️ {ihale.tur}</span>
                        <span>📅 {ihale.baslangic} → {ihale.bitis}</span>
                        <span>📄 {ihale.teklifSayisi} teklif</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      {ihale.enDusukTeklif && <div style={{ textAlign: 'right' }}><div style={{ fontSize: 16, fontWeight: 700, color: '#34d399' }}>₺{(ihale.enDusukTeklif / 1e6).toFixed(2)}M</div><div style={{ fontSize: 10, color: 'var(--text-muted)' }}>En düşük</div></div>}
                      <span className={`badge badge-${ihale.status}`}>{ihale.status}</span>
                      <Eye size={14} color="rgba(255,255,255,0.3)" />
                    </div>
                  </div>
                  {ihale.kazananFirma && <div style={{ marginTop: 8, fontSize: 12, color: '#34d399' }}>✓ Kazanan: {ihale.kazananFirma}</div>}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'teklifler' && (
          <motion.div key="teklifler" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div style={{ marginBottom: 16 }}>
              <select value={selectedIhale?.id} onChange={e => setSelectedIhale(ihaleler.find(i => i.id === e.target.value))} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 10, padding: '8px 14px', color: 'var(--text-primary)', fontSize: 13, outline: 'none' }}>
                {ihaleler.filter(i => i.teklifSayisi > 0).map(i => <option key={i.id} value={i.id}>{i.title}</option>)}
              </select>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              <div className="glass-card" style={{ padding: 20 }}>
                <h3 className="section-title">Teklif Karşılaştırması (₺M)</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={selectedTeklifler.map(t => ({ firma: t.firma.split(' ')[0], tutar: +(t.tutar / 1e6).toFixed(2), puan: t.puan }))} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                    <XAxis type="number" tick={{ fill: 'var(--text-secondary)', fontSize: 11, fontWeight: 500 }} axisLine={false} tickLine={false} />
                    <YAxis dataKey="firma" type="category" tick={{ fill: 'var(--text-primary)', fontSize: 12, fontWeight: 500 }} axisLine={false} tickLine={false} width={80} />
                    <Tooltip contentStyle={{ background: '#ffffff', border: '1px solid var(--border-medium)', borderRadius: 8, fontSize: 12, color: 'var(--text-primary)' }} />
                    <Bar dataKey="tutar" name="Teklif (₺M)" fill="#3b82f6" radius={[0, 4, 4, 0]} label={{ position: 'right', fill: '#3b82f6', fontSize: 11, formatter: v => `₺${v}M` }} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="glass-card" style={{ padding: 20 }}>
                <h3 className="section-title">Değerlendirme Tablosu</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[...selectedTeklifler].sort((a, b) => b.puan - a.puan).map((t, i) => (
                    <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', background: i === 0 ? 'rgba(52,211,153,0.08)' : 'var(--bg-secondary)', border: `1px solid ${i === 0 ? 'rgba(52,211,153,0.2)' : 'var(--border-subtle)'}`, borderRadius: 10 }}>
                      <div style={{ width: 24, height: 24, borderRadius: '50%', background: i === 0 ? '#34d399' : 'var(--border-medium)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: i === 0 ? '#fff' : 'var(--text-secondary)', flexShrink: 0 }}>{i + 1}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{t.firma}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>₺{(t.tutar/1e6).toFixed(2)}M · {t.sure} gün</div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 18, fontWeight: 700, color: i === 0 ? '#34d399' : '#3b82f6', fontFamily: 'Outfit, sans-serif' }}>{t.puan}</div>
                        <div style={{ fontSize: 9, color: 'var(--text-muted)' }}>PUAN</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'sozlesmeler' && (
          <motion.div key="sozlesmeler" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {sozlesmeler.map((s, i) => {
                const bitis = new Date(s.bitisTarihi);
                const kalan = Math.round((bitis - new Date()) / (1000 * 60 * 60 * 24));
                const kalanColor = kalan < 30 ? '#f87171' : kalan < 90 ? '#fbbf24' : '#34d399';
                return (
                  <motion.div key={s.id} className="glass-card" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} style={{ padding: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>{s.title}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'flex', gap: 16 }}>
                          <span>🏢 {s.firma}</span>
                          <span>📋 {s.tip}</span>
                          <span>📅 {s.imzaTarihi} → {s.bitisTarihi}</span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: 16, fontWeight: 700, color: '#3b82f6' }}>₺{(s.tutar/1e6).toFixed(2)}M</div>
                          {kalan > 0 && <div style={{ fontSize: 11, color: kalanColor }}>⏱ {kalan} gün kaldı</div>}
                        </div>
                        {s.status === 'aktif' ? (
                          <button onClick={() => setESignModal(true)} className="btn btn-primary" style={{ padding: '6px 12px', fontSize: 11, background: 'rgba(59,130,246,0.1)', color: '#3b82f6', border: '1px solid rgba(59,130,246,0.3)' }}>
                            <PenTool size={12} style={{ marginRight: 4 }} /> E-İmzala
                          </button>
                        ) : (
                          <span className={`badge badge-tamamlandı`}>İmzalandı</span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* New Tender Modal */}
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
                <h3 style={{ margin: 0, color: 'var(--text-primary)', fontSize: 18, fontFamily: 'Outfit, sans-serif' }}>Yeni İhale Oluştur</h3>
                <button onClick={() => setShowModal(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex' }}><X size={20} /></button>
              </div>

              <form onSubmit={handleModalSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6 }}>İhale Başlığı</label>
                  <input required type="text" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="search-input" style={{ width: '100%', padding: '10px 14px' }} placeholder="Örn: C30 Beton Alımı" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6 }}>İhale Türü</label>
                  <select value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })} className="search-input" style={{ width: '100%', padding: '10px 14px', appearance: 'none' }}>
                    <option value="Mal Alımı">Mal Alımı</option>
                    <option value="Hizmet Alımı">Hizmet Alımı</option>
                    <option value="Yapım İşi">Yapım İşi</option>
                  </select>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6 }}>Başlangıç Tarihi</label>
                    <input type="date" value={formData.start} onChange={e => setFormData({ ...formData, start: e.target.value })} className="search-input" style={{ width: '100%', padding: '10px 14px' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6 }}>Bitiş Tarihi</label>
                    <input type="date" value={formData.end} onChange={e => setFormData({ ...formData, end: e.target.value })} className="search-input" style={{ width: '100%', padding: '10px 14px' }} />
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 10 }}>
                  <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>İptal</button>
                  <button type="submit" className="btn btn-primary">Oluştur</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* E-Sign Modal */}
        {eSignModal && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 16, width: 400, padding: 32, boxShadow: 'var(--shadow-lg)', textAlign: 'center' }}>
              {signStatus === 'idle' && (
                <>
                  <div style={{ width: 64, height: 64, borderRadius: 32, background: 'rgba(59,130,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                    <PenTool size={32} color="#3b82f6" />
                  </div>
                  <h3 style={{ margin: '0 0 10px 0', fontSize: 20 }}>Sözleşmeyi E-İmzala</h3>
                  <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 24 }}>Mobil imzanız ile yasal olarak bağlayıcı e-imza atmak üzeresiniz.</p>
                  <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                    <button className="btn btn-ghost" onClick={() => setESignModal(false)}>İptal</button>
                    <button className="btn btn-primary" onClick={handleSignContract}>İmzala (Onayla)</button>
                  </div>
                </>
              )}
              {signStatus === 'signing' && (
                <div style={{ padding: '20px 0' }}>
                  <div className="spinner" style={{ borderTopColor: '#3b82f6', width: 40, height: 40, margin: '0 auto 20px', borderRadius: '50%', border: '3px solid rgba(255,255,255,0.1)', borderTop: '3px solid #3b82f6', animation: 'spin 1s linear infinite' }} />
                  <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
                  <h3 style={{ margin: 0, fontSize: 16 }}>E-İmza Servisine Bağlanılıyor...</h3>
                </div>
              )}
              {signStatus === 'success' && (
                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                  <div style={{ width: 64, height: 64, borderRadius: 32, background: 'rgba(52,211,153,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                    <CheckCircle size={32} color="#34d399" />
                  </div>
                  <h3 style={{ margin: '0 0 10px 0', fontSize: 20, color: '#34d399' }}>Sözleşme İmzalandı!</h3>
                  <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0 }}>Zaman damgası eklendi ve karşı tarafa iletildi.</p>
                </motion.div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
