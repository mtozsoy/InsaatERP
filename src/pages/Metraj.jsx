import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Download, Calculator, ChevronDown, ChevronUp, Search, X, BookOpen, Loader } from 'lucide-react';
import useERP from '../store/useERP';

const bakanlikPozlari = [
  { pozNo: '15.150.1002', tanim: 'C30/37 hazır beton dökülmesi', birim: 'm³', fiyat: 2850, kategori: 'Beton İşleri' },
  { pozNo: '15.160.1004', tanim: 'Nervürlü çelik hasır yerleştirilmesi', birim: 'ton', fiyat: 22500, kategori: 'Demir İşleri' },
  { pozNo: '15.140.1001', tanim: 'Makine ile her derinlikte kazı', birim: 'm³', fiyat: 180, kategori: 'Kazı ve Hafriyat' },
  { pozNo: '15.280.1001', tanim: 'İç cephe sıva yapılması', birim: 'm²', fiyat: 340, kategori: 'Sıva-Alçı' },
  { pozNo: '15.330.1003', line: 'XPS ile ısı yalıtımı yapılması', birim: 'm²', fiyat: 450, kategori: 'Yalıtım' }
];

export default function Metraj() {
  const { projects, metrajPozlari, addMetrajPoz, updateMetrajPoz } = useERP();
  const [selectedProject, setSelectedProject] = useState('prj-001');
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState(null);
  const [collapsedCats, setCollapsedCats] = useState({});
  const [activeCategory, setActiveCategory] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ desc: '', category: 'Beton İşleri', quantity: '', unit: 'm²', price: '' });
  const [calcMode, setCalcMode] = useState(false);
  const [dims, setDims] = useState({ length: '', width: '', height: '' });
  const [isExporting, setIsExporting] = useState(false);
  const [libSearch, setLibSearch] = useState('');

  const handleExportBoQ = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      // alert('BoQ Keşif Özeti Excel olarak indirildi.');
    }, 1500);
  };

  const handleSelectLibPoz = (poz) => {
    setFormData(prev => ({
      ...prev,
      desc: `[${poz.pozNo}] ${poz.tanim || poz.line}`,
      category: poz.kategori,
      unit: poz.birim,
      price: poz.fiyat
    }));
    setLibSearch('');
  };

  React.useEffect(() => {
    if (calcMode) {
      const l = parseFloat(dims.length) || 1;
      const w = parseFloat(dims.width) || 1;
      const h = parseFloat(dims.height) || 1;
      const total = (parseFloat(dims.length)||0) === 0 && (parseFloat(dims.width)||0) === 0 && (parseFloat(dims.height)||0) === 0 ? '' : (l * w * h).toFixed(2);
      setFormData(prev => ({ ...prev, quantity: total }));
    }
  }, [dims, calcMode]);

  const handleModalSubmit = (e) => {
    e.preventDefault();
    if (formData.desc) {
      addMetrajPoz(formData);
      setShowModal(false);
      setFormData({ desc: '', category: 'Beton İşleri', quantity: '', unit: 'm²', price: '' });
    }
  };

  const pozlar = metrajPozlari.filter(p => p.projectId === selectedProject);
  const filtered = pozlar
    .filter(p => !activeCategory || p.kategori === activeCategory)
    .filter(p => p.tanim.toLowerCase().includes(search.toLowerCase()) || p.pozNo.includes(search));
  const categories = [...new Set(pozlar.map(p => p.kategori))];

  const toplamTutar = pozlar.reduce((s, p) => s + p.tutar, 0);

  const toggleCat = (cat) => setActiveCategory(prev => prev === cat ? null : cat);

  const updateField = (id, field, val) => {
    updateMetrajPoz(id, field, val);
  };

  const catSums = categories.map(cat => ({
    name: cat,
    tutar: pozlar.filter(p => p.kategori === cat).reduce((s, p) => s + p.tutar, 0),
    count: pozlar.filter(p => p.kategori === cat).length,
  }));

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 className="page-title">Metraj & Keşif</h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>Poz bazlı metraj ve keşif özet yönetimi</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <select value={selectedProject} onChange={e => setSelectedProject(e.target.value)} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 10, padding: '9px 14px', color: 'var(--text-primary)', fontSize: 13, fontFamily: 'Inter, sans-serif', outline: 'none' }}>
            {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <button className="btn btn-ghost" onClick={handleExportBoQ}>
            {isExporting ? <Loader size={14} className="spin" /> : <Download size={14} />} 
            {isExporting ? 'Hazırlanıyor...' : 'BoQ Çıktısı Al'}
          </button>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={14} /> Poz Ekle
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        <div className="glass-card" style={{ padding: 18 }}>
          <Calculator size={16} color="#3b82f6" style={{ marginBottom: 8 }} />
          <div style={{ fontSize: 26, fontWeight: 700, color: '#3b82f6', fontFamily: 'Outfit, sans-serif' }}>₺{(toplamTutar / 1e6).toFixed(2)}M</div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Toplam Keşif Bedeli</div>
        </div>
        <div className="glass-card" style={{ padding: 18 }}>
          <div style={{ fontSize: 26, fontWeight: 700, color: '#818cf8', fontFamily: 'Outfit, sans-serif' }}>{pozlar.length}</div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Toplam Poz</div>
        </div>
        <div className="glass-card" style={{ padding: 18 }}>
          <div style={{ fontSize: 26, fontWeight: 700, color: '#fb923c', fontFamily: 'Outfit, sans-serif' }}>{categories.length}</div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Kategori</div>
        </div>
        <div className="glass-card" style={{ padding: 18 }}>
          <div style={{ fontSize: 26, fontWeight: 700, color: '#34d399', fontFamily: 'Outfit, sans-serif' }}>₺{(toplamTutar / pozlar.length / 1000).toFixed(0)}K</div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Ort. Poz Bedeli</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 20 }}>
        {/* Category Tree */}
        <div className="glass-card" style={{ padding: 16, height: 'fit-content' }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: 12 }}>Kategoriler</div>
          {catSums.map((cat, i) => (
            <motion.div key={cat.name} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} style={{ padding: '10px 12px', borderRadius: 9, marginBottom: 4, cursor: 'pointer', background: activeCategory === cat.name ? 'rgba(0,212,255,0.08)' : 'rgba(255,255,255,0.03)', border: activeCategory === cat.name ? '1px solid #00D4FF' : '1px solid rgba(255,255,255,0.06)' }}
              onClick={() => toggleCat(cat.name)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>{cat.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{cat.count} poz</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#3b82f6' }}>₺{(cat.tutar/1e6).toFixed(2)}M</div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>%{Math.round((cat.tutar / toplamTutar) * 100)}</div>
                </div>
              </div>
              <div style={{ marginTop: 8, height: 3, background: 'var(--glass-bg)', borderRadius: 2, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${Math.round((cat.tutar / toplamTutar) * 100)}%`, background: '#3b82f6', borderRadius: 2 }} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Poz Table */}
        <div>
          <div style={{ marginBottom: 12 }}>
            <div className="search-wrapper">
              <Search size={14} className="search-icon" />
              <input className="search-input" placeholder="Poz ara (poz no veya tanım)..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
          </div>

          <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
            <table className="erp-table" style={{ tableLayout: 'fixed' }}>
              <thead>
                <tr>
                  <th style={{ width: 90 }}>Poz No</th>
                  <th>Tanım</th>
                  <th style={{ width: 60 }}>Birim</th>
                  <th style={{ width: 90 }}>Miktar</th>
                  <th style={{ width: 100 }}>Birim Fiyat</th>
                  <th style={{ width: 110 }}>Tutar</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((poz, i) => (
                  <motion.tr key={poz.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}>
                    <td style={{ fontSize: 11, fontFamily: 'monospace', color: '#3b82f6' }}>{poz.pozNo}</td>
                    <td>
                      <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', lineHeight: 1.4 }}>{poz.tanim}</div>
                      <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>{poz.kategori}</div>
                    </td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: 12 }}>{poz.birim}</td>
                    <td>
                      <input
                        type="number"
                        value={poz.miktar}
                        onChange={e => updateField(poz.id, 'miktar', e.target.value)}
                        style={{ width: '100%', background: 'var(--glass-bg)', border: '1px solid var(--border-subtle)', borderRadius: 6, padding: '4px 8px', color: 'var(--text-primary)', fontSize: 13, fontFamily: 'Inter, sans-serif', outline: 'none' }}
                        onFocus={e => { e.target.style.borderColor = '#3b82f6'; e.target.style.background = 'rgba(0,212,255,0.05)'; }}
                        onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.background = 'rgba(255,255,255,0.05)'; }}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={poz.birimFiyat}
                        onChange={e => updateField(poz.id, 'birimFiyat', e.target.value)}
                        style={{ width: '100%', background: 'var(--glass-bg)', border: '1px solid var(--border-subtle)', borderRadius: 6, padding: '4px 8px', color: 'var(--text-primary)', fontSize: 13, fontFamily: 'Inter, sans-serif', outline: 'none' }}
                        onFocus={e => { e.target.style.borderColor = '#3b82f6'; e.target.style.background = 'rgba(0,212,255,0.05)'; }}
                        onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.background = 'rgba(255,255,255,0.05)'; }}
                      />
                    </td>
                    <td style={{ fontWeight: 700, color: '#34d399', fontSize: 13 }}>₺{poz.tutar.toLocaleString('tr-TR')}</td>
                  </motion.tr>
                ))}
                {/* Total Row */}
                <tr style={{ background: 'rgba(0,212,255,0.05)', borderTop: '2px solid rgba(0,212,255,0.2)' }}>
                  <td colSpan={5} style={{ fontWeight: 700, color: 'var(--text-secondary)', fontSize: 13, padding: '14px 16px' }}>TOPLAM KEŞIF BEDELİ</td>
                  <td style={{ fontWeight: 800, color: '#3b82f6', fontSize: 16, fontFamily: 'Outfit, sans-serif', padding: '14px 16px' }}>₺{filtered.reduce((s, p) => s + p.tutar, 0).toLocaleString('tr-TR')}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* New Metraj Modal */}
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
                <h3 style={{ margin: 0, color: 'var(--text-primary)', fontSize: 18, fontFamily: 'Outfit, sans-serif' }}>Yeni Metraj Pozu Ekle</h3>
                <button onClick={() => setShowModal(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex' }}><X size={20} /></button>
              </div>

              <form onSubmit={handleModalSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ position: 'relative' }}>
                  <label style={{ display: 'block', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6 }}><BookOpen size={12} style={{ display: 'inline', marginRight: 4 }} />Bakanlık Kütüphanesinde Ara (Opsiyonel)</label>
                  <input type="text" value={libSearch} onChange={e => setLibSearch(e.target.value)} className="search-input" style={{ width: '100%', padding: '10px 14px', border: '1px solid #3b82f6', background: 'rgba(59,130,246,0.05)' }} placeholder="Örn: Beton, Sıva, 15.150..." />
                  {libSearch && (
                    <div style={{ position: 'absolute', top: 60, left: 0, right: 0, background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 8, zIndex: 10, maxHeight: 150, overflowY: 'auto', boxShadow: 'var(--shadow-lg)' }}>
                      {bakanlikPozlari.filter(p => (p.tanim || p.line).toLowerCase().includes(libSearch.toLowerCase()) || p.pozNo.includes(libSearch)).map((p, i) => (
                        <div key={i} onClick={() => handleSelectLibPoz(p)} style={{ padding: '8px 12px', fontSize: 12, cursor: 'pointer', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between' }}>
                          <span><strong style={{ color: '#3b82f6' }}>{p.pozNo}</strong> {p.tanim || p.line}</span>
                          <span style={{ color: 'var(--text-muted)' }}>{p.fiyat} ₺/{p.birim}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6 }}>Poz Tanımı</label>
                    <input required type="text" value={formData.desc} onChange={e => setFormData({ ...formData, desc: e.target.value })} className="search-input" style={{ width: '100%', padding: '10px 14px' }} placeholder="Örn: C30 Hazır Beton Dökümü" />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6 }}>Kategori</label>
                    <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="search-input" style={{ width: '100%', padding: '10px 14px', appearance: 'none' }}>
                      <option value="Beton İşleri">Beton İşleri</option>
                      <option value="Demir İşleri">Demir İşleri</option>
                      <option value="Kagir İşleri">Kagir İşleri</option>
                      <option value="Sıva-Alçı">Sıva-Alçı</option>
                      <option value="Yalıtım">Yalıtım</option>
                      <option value="Tesisat (Elektrik)">Tesisat (Elektrik)</option>
                      <option value="Tesisat (Mekanik)">Tesisat (Mekanik)</option>
                      <option value="Kazı ve Hafriyat">Kazı ve Hafriyat</option>
                      <option value="Diğer">Diğer</option>
                    </select>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <label style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Miktar</label>
                      <label style={{ fontSize: 11, color: '#3b82f6', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <input type="checkbox" checked={calcMode} onChange={e => setCalcMode(e.target.checked)} /> BoyxEnxYükseklik
                      </label>
                    </div>
                    {calcMode ? (
                      <div style={{ display: 'flex', gap: 4 }}>
                        <input type="number" placeholder="B(m)" value={dims.length} onChange={e => setDims({...dims, length: e.target.value})} className="search-input" style={{ width: '100%', padding: '10px 4px', textAlign: 'center' }} />
                        <span style={{ display: 'flex', alignItems: 'center', color: 'var(--text-muted)', fontSize: 11 }}>x</span>
                        <input type="number" placeholder="E(m)" value={dims.width} onChange={e => setDims({...dims, width: e.target.value})} className="search-input" style={{ width: '100%', padding: '10px 4px', textAlign: 'center' }} />
                        <span style={{ display: 'flex', alignItems: 'center', color: 'var(--text-muted)', fontSize: 11 }}>x</span>
                        <input type="number" placeholder="Y(m)" value={dims.height} onChange={e => setDims({...dims, height: e.target.value})} className="search-input" style={{ width: '100%', padding: '10px 4px', textAlign: 'center' }} />
                        <span style={{ display: 'flex', alignItems: 'center', fontWeight: 'bold', marginLeft: 4, color: 'var(--text-primary)', fontSize: 12 }}>= {formData.quantity || 0}</span>
                      </div>
                    ) : (
                      <input type="number" value={formData.quantity} onChange={e => setFormData({ ...formData, quantity: e.target.value })} className="search-input" style={{ width: '100%', padding: '10px 14px' }} placeholder="Örn: 150" />
                    )}
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6 }}>Birim</label>
                    <select value={formData.unit} onChange={e => setFormData({ ...formData, unit: e.target.value })} className="search-input" style={{ width: '100%', padding: '10px 14px', appearance: 'none' }}>
                      <option value="m²">m²</option>
                      <option value="m³">m³</option>
                      <option value="mt">mt (Metretül)</option>
                      <option value="adet">Adet</option>
                      <option value="ton">Ton</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6 }}>Birim Fiyat (₺)</label>
                  <input type="number" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} className="search-input" style={{ width: '100%', padding: '10px 14px' }} placeholder="Örn: 2000" />
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 10 }}>
                  <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>İptal</button>
                  <button type="submit" className="btn btn-primary">Ekle</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
