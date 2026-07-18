import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { ClipboardCheck, CheckCircle, XCircle, Clock, AlertTriangle, Plus, X } from 'lucide-react';
import useERP from '../store/useERP';

const durumColors = { geçti: '#34d399', uygunsuz: '#f87171', beklemede: '#fbbf24' };
const oncColors = { kritik: '#f87171', yüksek: '#fb923c', orta: '#fbbf24', düşük: '#94a3b8' };

const PIPELINE = ['Açık', 'İnceleme', 'Aksiyon', 'Doğrulama', 'Kapalı'];

export default function Quality() {
  const { kaliteKontroller, uygunsuzluklar, updateUygunsuzlukStatus, addKaliteKontrol } = useERP();
  const [activeTab, setActiveTab] = useState('kontroller');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ title: '', category: 'Beton', priority: 'orta', manager: '' });

  const getColItems = (col) => uygunsuzluklar.filter(u => u.status === col.toLowerCase());

  const [draggingItem, setDraggingItem] = useState(null);
  const [overColumn, setOverColumn] = useState(null);

  const handleModalSubmit = (e) => {
    e.preventDefault();
    if (formData.title) {
      addKaliteKontrol(formData);
      setShowModal(false);
      setFormData({ title: '', category: 'Beton', priority: 'orta', manager: '' });
    }
  };

  const pieData = [
    { name: 'Geçti', value: kaliteKontroller.filter(k => k.durum === 'geçti').length, color: '#34d399' },
    { name: 'Uygunsuz', value: kaliteKontroller.filter(k => k.durum === 'uygunsuz').length, color: '#f87171' },
    { name: 'Beklemede', value: kaliteKontroller.filter(k => k.durum === 'beklemede').length, color: '#fbbf24' },
  ];

  const handleDragStart = (item, fromCol) => setDraggingItem({ item, fromCol });
  const handleDrop = (toCol) => {
    if (!draggingItem || draggingItem.fromCol === toCol) return;
    updateUygunsuzlukStatus(draggingItem.item.id, toCol.toLowerCase());
    setDraggingItem(null);
    setOverColumn(null);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 className="page-title">Kalite Kontrol</h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>Saha kontrolleri, uygunsuzluk takibi ve kapatma süreçleri</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}><Plus size={14} /> Yeni Kontrol</button>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 200px', gap: 16, marginBottom: 24 }}>
        <div className="glass-card" style={{ padding: 18 }}>
          <CheckCircle size={16} color="#34d399" style={{ marginBottom: 8 }} />
          <div style={{ fontSize: 28, fontWeight: 700, color: '#34d399', fontFamily: 'Outfit, sans-serif' }}>{kaliteKontroller.filter(k => k.durum === 'geçti').length}</div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Geçti</div>
        </div>
        <div className="glass-card" style={{ padding: 18 }}>
          <XCircle size={16} color="#f87171" style={{ marginBottom: 8 }} />
          <div style={{ fontSize: 28, fontWeight: 700, color: '#f87171', fontFamily: 'Outfit, sans-serif' }}>{kaliteKontroller.filter(k => k.durum === 'uygunsuz').length}</div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Uygunsuz</div>
        </div>
        <div className="glass-card" style={{ padding: 18 }}>
          <Clock size={16} color="#fbbf24" style={{ marginBottom: 8 }} />
          <div style={{ fontSize: 28, fontWeight: 700, color: '#fbbf24', fontFamily: 'Outfit, sans-serif' }}>{kaliteKontroller.filter(k => k.durum === 'beklemede').length}</div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Beklemede</div>
        </div>
        <div className="glass-card" style={{ padding: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ResponsiveContainer width="100%" height={110}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={24} outerRadius={46} paddingAngle={4} dataKey="value" strokeWidth={0}>
                {pieData.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip contentStyle={{ background: '#ffffff', border: '1px solid var(--border-medium)', borderRadius: 8, fontSize: 12, color: 'var(--text-primary)' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 12, padding: 4, marginBottom: 20, width: 'fit-content' }}>
        {['kontroller', 'uygunsuzluklar'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: '7px 16px', borderRadius: 9, border: 'none', cursor: 'pointer', background: activeTab === tab ? 'rgba(59,130,246,0.12)' : 'transparent', color: activeTab === tab ? '#3b82f6' : 'var(--text-secondary)', fontSize: 13, fontFamily: 'Inter, sans-serif', transition: 'all 0.2s', textTransform: 'capitalize' }}>
            {tab === 'kontroller' ? 'Kontroller' : 'Uygunsuzluklar'}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'kontroller' && (
          <motion.div key="kontroller" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {kaliteKontroller.map((k, i) => {
                const dColor = durumColors[k.durum] || '#aaa';
                const oColor = oncColors[k.oncelik] || '#aaa';
                return (
                  <motion.div key={k.id} className="glass-card" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} style={{ padding: 16, borderLeft: `3px solid ${dColor}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                          <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{k.baslik}</span>
                          <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 4, background: `${oColor}18`, color: oColor, border: `1px solid ${oColor}30` }}>{k.oncelik}</span>
                        </div>
                        <div style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'flex', gap: 16 }}>
                          <span>📂 {k.kategori}</span>
                          <span>👤 {k.sorumlu}</span>
                          <span>📅 {k.tarih}</span>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: 11, padding: '4px 10px', borderRadius: 6, background: `${dColor}15`, color: dColor, border: `1px solid ${dColor}30`, fontWeight: 600 }}>{k.durum}</span>
                      </div>
                    </div>
                    {k.sonuc && <div style={{ marginTop: 8, fontSize: 12, color: dColor, padding: '6px 10px', background: `${dColor}08`, borderRadius: 6 }}>{k.sonuc}</div>}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {activeTab === 'uygunsuzluklar' && (
          <motion.div key="uygunsuzluklar" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div style={{ display: 'flex', gap: 14, overflowX: 'auto', paddingBottom: 8 }}>
              {PIPELINE.map(col => (
                <div
                  key={col}
                  style={{ minWidth: 220, flex: 1 }}
                  onDragOver={e => { e.preventDefault(); setOverColumn(col); }}
                  onDragLeave={() => setOverColumn(null)}
                  onDrop={() => handleDrop(col)}
                >
                  <div style={{ background: overColumn === col ? 'rgba(59,130,246,0.08)' : 'var(--glass-bg)', border: `1px solid ${overColumn === col ? 'rgba(59,130,246,0.3)' : 'var(--border-subtle)'}`, borderRadius: 12, padding: 14, minHeight: 300, transition: 'all 0.2s' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.6px' }}>{col}</span>
                      <span style={{ fontSize: 11, background: 'var(--glass-bg)', borderRadius: 10, padding: '1px 7px', color: 'var(--text-secondary)' }}>{getColItems(col).length}</span>
                    </div>
                    {getColItems(col).map((u) => (
                      <div
                        key={u.id}
                        draggable
                        onDragStart={() => handleDragStart(u, col)}
                        style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 9, padding: '12px', marginBottom: 8, cursor: 'grab', borderLeft: `3px solid ${col === 'Kapalı' ? '#34d399' : '#f87171'}` }}
                      >
                        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>{u.baslik}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 4 }}>Sorumlu: {u.sorumlu}</div>
                        {u.aksiyon && <div style={{ fontSize: 11, color: '#3b82f6', lineHeight: 1.4 }}>{u.aksiyon}</div>}
                        <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 6 }}>
                          {u.acilis} → {u.kapanisBeklenen}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* New Quality Control Modal */}
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
                <h3 style={{ margin: 0, color: 'var(--text-primary)', fontSize: 18, fontFamily: 'Outfit, sans-serif' }}>Yeni Kalite Kontrolü</h3>
                <button onClick={() => setShowModal(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex' }}><X size={20} /></button>
              </div>

              <form onSubmit={handleModalSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6 }}>Kontrol Başlığı</label>
                  <input required type="text" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="search-input" style={{ width: '100%', padding: '10px 14px' }} placeholder="Örn: Kat 2 Beton Dökümü" />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6 }}>Kategori</label>
                    <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="search-input" style={{ width: '100%', padding: '10px 14px', appearance: 'none' }}>
                      <option value="Beton">Beton</option>
                      <option value="Demir">Demir</option>
                      <option value="İzolasyon">İzolasyon</option>
                      <option value="İnce İşler">İnce İşler</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6 }}>Öncelik</label>
                    <select value={formData.priority} onChange={e => setFormData({ ...formData, priority: e.target.value })} className="search-input" style={{ width: '100%', padding: '10px 14px', appearance: 'none' }}>
                      <option value="yüksek">Yüksek</option>
                      <option value="orta">Orta</option>
                      <option value="düşük">Düşük</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6 }}>Sorumlu Kişi</label>
                  <input type="text" value={formData.manager} onChange={e => setFormData({ ...formData, manager: e.target.value })} className="search-input" style={{ width: '100%', padding: '10px 14px' }} placeholder="Örn: Ali Vefa" />
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
