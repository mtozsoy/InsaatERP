import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Library, Search, BookOpen, FileText, Download, Star } from 'lucide-react';
import { birimFiyatlar, sablonlar } from '../data/mockData';

const categoryColors = {
  'Demir İşleri': '#fb923c', 'Beton İşleri': '#3b82f6', 'Kagir İşleri': '#818cf8',
  'Kalıp İşleri': '#fbbf24', 'Toprak İşleri': '#34d399', 'Yalıtım': '#f87171', 'Kaplama': '#34d399',
  'Metraj': '#3b82f6', 'Hakediş': '#34d399', 'Saha': '#fb923c', 'İSG': '#f87171', 'Kalite': '#fbbf24', 'Sözleşme': '#818cf8',
};

export default function LibraryPage() {
  const [activeTab, setActiveTab] = useState('birimfiyat');
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState(null);

  const bfCategories = [...new Set(birimFiyatlar.map(b => b.kategori))];
  const sbCategories = [...new Set(sablonlar.map(s => s.kategori))];

  const filteredBF = birimFiyatlar
    .filter(b => !activeCategory || b.kategori === activeCategory)
    .filter(b => b.tanim.toLowerCase().includes(search.toLowerCase()) || b.pozNo.includes(search));

  const filteredSB = sablonlar
    .filter(s => !activeCategory || s.kategori === activeCategory)
    .filter(s => s.ad.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg, #00FFB3, #00D4FF)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Library size={20} color="white" />
          </div>
          <div>
            <h1 className="page-title" style={{ marginBottom: 0 }}>Kütüphane</h1>
            <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Birim fiyat, şablon ve standart eklenti deposu</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 12, padding: 4, marginBottom: 20, width: 'fit-content' }}>
        {[{ id: 'birimfiyat', label: '📋 Birim Fiyatlar' }, { id: 'sablonlar', label: '📐 Şablonlar' }].map(tab => (
          <button key={tab.id} onClick={() => { setActiveTab(tab.id); setActiveCategory(null); }} style={{ padding: '7px 18px', borderRadius: 9, border: 'none', cursor: 'pointer', background: activeTab === tab.id ? 'rgba(16,185,129,0.12)' : 'transparent', color: activeTab === tab.id ? '#10b981' : 'var(--text-secondary)', fontSize: 13, fontFamily: 'Inter, sans-serif', transition: 'all 0.2s' }}>
            {tab.label}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 20 }}>
        {/* Category Sidebar */}
        <div className="glass-card" style={{ padding: 14, height: 'fit-content' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.7px', marginBottom: 10, textTransform: 'uppercase' }}>Kategori</div>
          <button onClick={() => setActiveCategory(null)} style={{ display: 'flex', justifyContent: 'space-between', width: '100%', padding: '7px 10px', borderRadius: 7, border: 'none', background: !activeCategory ? 'rgba(16,185,129,0.12)' : 'transparent', color: !activeCategory ? '#10b981' : 'var(--text-secondary)', cursor: 'pointer', fontSize: 12, fontFamily: 'Inter, sans-serif', marginBottom: 2 }}>
            <span>Tümü</span><span>{activeTab === 'birimfiyat' ? birimFiyatlar.length : sablonlar.length}</span>
          </button>
          {(activeTab === 'birimfiyat' ? bfCategories : sbCategories).map(cat => {
            const color = categoryColors[cat] || '#3b82f6';
            const count = activeTab === 'birimfiyat' ? birimFiyatlar.filter(b => b.kategori === cat).length : sablonlar.filter(s => s.kategori === cat).length;
            return (
              <button key={cat} onClick={() => setActiveCategory(cat === activeCategory ? null : cat)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', padding: '7px 10px', borderRadius: 7, border: 'none', background: activeCategory === cat ? `${color}12` : 'transparent', color: activeCategory === cat ? color : 'var(--text-secondary)', cursor: 'pointer', fontSize: 12, fontFamily: 'Inter, sans-serif', marginBottom: 2 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: color }} />
                  {cat}
                </div>
                <span style={{ opacity: 0.6 }}>{count}</span>
              </button>
            );
          })}
        </div>

        {/* Main Content */}
        <div>
          <div style={{ marginBottom: 14 }}>
            <div className="search-wrapper">
              <Search size={14} className="search-icon" />
              <input className="search-input" placeholder={activeTab === 'birimfiyat' ? 'Birim fiyat veya poz ara...' : 'Şablon ara...'} value={search} onChange={e => setSearch(e.target.value)} />
            </div>
          </div>

          {activeTab === 'birimfiyat' ? (
            <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
              <table className="erp-table">
                <thead><tr><th>Poz No</th><th>Tanım</th><th>Birim</th><th>Birim Fiyat</th><th>Kaynak</th><th></th></tr></thead>
                <tbody>
                  {filteredBF.map((bf, i) => {
                    const catColor = categoryColors[bf.kategori] || '#3b82f6';
                    return (
                      <motion.tr key={bf.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}>
                        <td style={{ fontFamily: 'monospace', color: '#3b82f6', fontSize: 12 }}>{bf.pozNo}</td>
                        <td>
                          <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>{bf.tanim}</div>
                          <div style={{ fontSize: 10, color: catColor, marginTop: 2 }}>{bf.kategori}</div>
                        </td>
                        <td style={{ color: 'var(--text-secondary)', fontSize: 12 }}>{bf.birim}</td>
                        <td style={{ fontSize: 15, fontWeight: 700, color: '#34d399', fontFamily: 'Outfit, sans-serif' }}>₺{bf.fiyat.toLocaleString('tr-TR')}</td>
                        <td><span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 6, background: 'var(--glass-bg)', color: 'var(--text-secondary)' }}>{bf.kaynak}</span></td>
                        <td>
                          <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#3b82f6', fontSize: 11, fontFamily: 'Inter, sans-serif', padding: '4px 8px', borderRadius: 6 }}>+ Metraj'a Ekle</button>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14 }}>
              {filteredSB.map((sb, i) => {
                const catColor = categoryColors[sb.kategori] || '#3b82f6';
                return (
                  <motion.div key={sb.id} className="glass-card" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }} style={{ padding: 18, cursor: 'pointer' }} whileHover={{ y: -2, borderColor: catColor + '40' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                      <div style={{ width: 40, height: 40, borderRadius: 10, background: `${catColor}15`, border: `1px solid ${catColor}30`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <FileText size={18} color={catColor} />
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Star size={11} color="#fbbf24" fill="#fbbf24" />
                        <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{sb.kullanim}</span>
                      </div>
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>{sb.ad}</div>
                    <div style={{ fontSize: 11, color: catColor, marginBottom: 8 }}>{sb.kategori}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 12 }}>{sb.aciklama}</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>Güncelleme: {sb.guncelleme}</span>
                      <button style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 10px', borderRadius: 7, border: `1px solid ${catColor}30`, background: `${catColor}10`, color: catColor, fontSize: 11, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
                        <Download size={11} /> İndir
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
