import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Search, Upload, Filter, Grid, List, CheckCircle, Clock, Edit3, Download, X } from 'lucide-react';
import useERP from '../store/useERP';

const categoryColors = { 'Teknik Rapor': '#3b82f6', 'Çizim': '#818cf8', 'Resmi Belge': '#34d399', 'İSG': '#f87171', 'Test Raporu': '#fbbf24' };
const formatIcons = { PDF: '📄', DWG: '📐', XLSX: '📊', DOC: '📝' };
const statusColors = { onaylı: '#34d399', revizyon: '#fbbf24', taslak: 'rgba(255,255,255,0.3)' };

export default function Documents() {
  const { dokumanlar, addDokuman } = useERP();
  const [view, setView] = useState('grid');
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', category: 'Teknik Rapor', format: 'PDF', size: '1.5 MB' });

  const handleModalSubmit = (e) => {
    e.preventDefault();
    if (formData.name) {
      addDokuman(formData);
      setShowModal(false);
      setFormData({ name: '', category: 'Teknik Rapor', format: 'PDF', size: '1.5 MB' });
    }
  };

  const categories = [...new Set(dokumanlar.map(d => d.kategori))];
  const filtered = dokumanlar
    .filter(d => !activeCategory || d.kategori === activeCategory)
    .filter(d => d.ad.toLowerCase().includes(search.toLowerCase()) || d.etiketler.some(e => e.includes(search.toLowerCase())));

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 className="page-title">Dokümanlar</h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>Sözleşmeler, çizimler ve sürümlü döküman yönetimi</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-ghost" onClick={() => setView(v => v === 'grid' ? 'list' : 'grid')}>
            {view === 'grid' ? <List size={14} /> : <Grid size={14} />} {view === 'grid' ? 'Liste' : 'Grid'}
          </button>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <Upload size={14} /> Yükle
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 20 }}>
        {/* Sidebar */}
        <div>
          {/* Upload Zone */}
          <div
            onDragOver={e => { e.preventDefault(); setIsDragOver(true); }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={e => { e.preventDefault(); setIsDragOver(false); addDokuman('Suruklenen_Dosya.pdf'); alert('Dosya yüklendi!'); }}
            style={{
              border: `2px dashed ${isDragOver ? '#3b82f6' : 'rgba(255,255,255,0.12)'}`,
              borderRadius: 12, padding: '24px 16px', textAlign: 'center', marginBottom: 16,
              background: isDragOver ? 'rgba(0,212,255,0.05)' : 'rgba(10,13,24,0.5)',
              cursor: 'pointer', transition: 'all 0.2s',
            }}
          >
            <Upload size={24} color={isDragOver ? '#3b82f6' : 'rgba(255,255,255,0.25)'} style={{ margin: '0 auto 8px' }} />
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              {isDragOver ? 'Bırakın!' : 'Dosyaları buraya sürükleyin veya tıklayın'}
            </div>
          </div>

          {/* Categories */}
          <div className="glass-card" style={{ padding: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.7px', marginBottom: 10, textTransform: 'uppercase' }}>KATEGORİLER</div>
            <button onClick={() => setActiveCategory(null)} style={{ display: 'flex', justifyContent: 'space-between', width: '100%', padding: '7px 10px', borderRadius: 7, border: 'none', background: !activeCategory ? 'rgba(59,130,246,0.12)' : 'transparent', color: !activeCategory ? '#3b82f6' : 'var(--text-secondary)', cursor: 'pointer', fontSize: 13, fontFamily: 'Inter, sans-serif', marginBottom: 2, transition: 'all 0.15s' }}>
              <span>Tümü</span><span>{dokumanlar.length}</span>
            </button>
            {categories.map(cat => {
              const color = categoryColors[cat] || '#3b82f6';
              const count = dokumanlar.filter(d => d.kategori === cat).length;
              return (
                <button key={cat} onClick={() => setActiveCategory(cat === activeCategory ? null : cat)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', padding: '7px 10px', borderRadius: 7, border: 'none', background: activeCategory === cat ? `${color}12` : 'transparent', color: activeCategory === cat ? color : 'var(--text-secondary)', cursor: 'pointer', fontSize: 12, fontFamily: 'Inter, sans-serif', marginBottom: 2, transition: 'all 0.15s' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: color }} />
                    {cat}
                  </div>
                  <span style={{ opacity: 0.6 }}>{count}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main */}
        <div>
          <div style={{ marginBottom: 14 }}>
            <div className="search-wrapper">
              <Search size={14} className="search-icon" />
              <input className="search-input" placeholder="Döküman veya etiket ara..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
          </div>

          {view === 'grid' ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14 }}>
              {filtered.map((doc, i) => {
                const catColor = categoryColors[doc.kategori] || '#3b82f6';
                const statusColor = statusColors[doc.durum] || '#aaa';
                return (
                  <motion.div key={doc.id} className="glass-card" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.04 }} style={{ padding: 16, cursor: 'pointer', border: '1px solid var(--border-subtle)' }}
                    whileHover={{ borderColor: catColor + '40', y: -2 }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                      <div style={{ fontSize: 32 }}>{formatIcons[doc.format] || '📄'}</div>
                      <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 4, background: `${statusColor}18`, color: statusColor, border: `1px solid ${statusColor}30`, fontWeight: 600 }}>{doc.durum}</span>
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4, lineHeight: 1.4 }}>{doc.ad}</div>
                    <div style={{ fontSize: 11, color: catColor, marginBottom: 8 }}>{doc.kategori}</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--text-muted)' }}>
                      <span>{doc.versiyon}</span>
                      <span>{doc.boyut}</span>
                    </div>
                    <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                      {doc.etiketler.map(e => <span key={e} style={{ fontSize: 9, padding: '1px 6px', borderRadius: 4, background: 'var(--glass-bg)', color: 'var(--text-secondary)' }}>#{e}</span>)}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
              <table className="erp-table">
                <thead><tr><th>Döküman</th><th>Kategori</th><th>Versiyon</th><th>Boyut</th><th>Format</th><th>Yükleyen</th><th>Durum</th><th></th></tr></thead>
                <tbody>
                  {filtered.map((doc, i) => {
                    const catColor = categoryColors[doc.kategori] || '#3b82f6';
                    const statusColor = statusColors[doc.durum] || '#aaa';
                    return (
                      <motion.tr key={doc.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <span style={{ fontSize: 18 }}>{formatIcons[doc.format] || '📄'}</span>
                            <div>
                              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{doc.ad}</div>
                              <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{doc.yukleme}</div>
                            </div>
                          </div>
                        </td>
                        <td><span style={{ color: catColor, fontSize: 12 }}>{doc.kategori}</span></td>
                        <td style={{ fontFamily: 'monospace', color: '#3b82f6', fontSize: 12 }}>{doc.versiyon}</td>
                        <td style={{ color: 'var(--text-secondary)', fontSize: 12 }}>{doc.boyut}</td>
                        <td><span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 4, background: 'var(--glass-bg)', color: 'var(--text-secondary)' }}>{doc.format}</span></td>
                        <td style={{ color: 'var(--text-secondary)', fontSize: 12 }}>{doc.yukleyen}</td>
                        <td><span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 4, background: `${statusColor}18`, color: statusColor, border: `1px solid ${statusColor}25` }}>{doc.durum}</span></td>
                        <td>
                          <div style={{ display: 'flex', gap: 6 }}>
                            <button onClick={() => alert(`${doc.ad} indiriliyor...`)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4 }}><Download size={13} /></button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* New Document Modal */}
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
                <h3 style={{ margin: 0, color: 'var(--text-primary)', fontSize: 18, fontFamily: 'Outfit, sans-serif' }}>Yeni Doküman Yükle</h3>
                <button onClick={() => setShowModal(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex' }}><X size={20} /></button>
              </div>

              <form onSubmit={handleModalSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6 }}>Dosya Adı</label>
                  <input required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="search-input" style={{ width: '100%', padding: '10px 14px' }} placeholder="Örn: Statik Proje v2" />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6 }}>Kategori</label>
                    <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="search-input" style={{ width: '100%', padding: '10px 14px', appearance: 'none' }}>
                      <option value="Teknik Rapor">Teknik Rapor</option>
                      <option value="Çizim">Çizim</option>
                      <option value="Resmi Belge">Resmi Belge</option>
                      <option value="İSG">İSG</option>
                      <option value="Test Raporu">Test Raporu</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6 }}>Format</label>
                    <select value={formData.format} onChange={e => setFormData({ ...formData, format: e.target.value })} className="search-input" style={{ width: '100%', padding: '10px 14px', appearance: 'none' }}>
                      <option value="PDF">PDF</option>
                      <option value="DWG">DWG</option>
                      <option value="DOC">DOC</option>
                      <option value="XLSX">XLSX</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6 }}>Boyut (Görsel)</label>
                  <input type="text" value={formData.size} onChange={e => setFormData({ ...formData, size: e.target.value })} className="search-input" style={{ width: '100%', padding: '10px 14px' }} placeholder="Örn: 2.5 MB" />
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 10 }}>
                  <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>İptal</button>
                  <button type="submit" className="btn btn-primary">Yükle</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
