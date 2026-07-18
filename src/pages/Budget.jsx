import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart, Line, ReferenceLine, Legend } from 'recharts';
import { TrendingDown, TrendingUp, AlertTriangle, DollarSign, Filter, Download } from 'lucide-react';
import { butceKalemleri, aylikMaliyet } from '../data/mockData';
import useERP from '../store/useERP';

const formatM = (v) => `₺${v.toFixed(1)}M`;

export default function Budget() {
  const { projects } = useERP();
  const [selectedProject, setSelectedProject] = useState('prj-001');
  const [activeCategory, setActiveCategory] = useState(null);

  const kalemler = butceKalemleri.filter(k => k.projectId === selectedProject);
  const categories = [...new Set(kalemler.map(k => k.kategori))];
  const filtered = activeCategory ? kalemler.filter(k => k.kategori === activeCategory) : kalemler;

  const toplamButce = kalemler.reduce((s, k) => s + k.butce, 0);
  const toplamHarcanan = kalemler.reduce((s, k) => s + k.harcanan, 0);
  const toplamTaahhut = kalemler.reduce((s, k) => s + k.taahhut, 0);
  const sapma = toplamHarcanan - toplamButce;
  const tamamlanmaOrani = Math.round((toplamHarcanan / toplamButce) * 100);

  const chartData = categories.map(cat => {
    const items = kalemler.filter(k => k.kategori === cat);
    return {
      name: cat,
      butce: +(items.reduce((s, k) => s + k.butce, 0) / 1e6).toFixed(2),
      gercek: +(items.reduce((s, k) => s + k.harcanan, 0) / 1e6).toFixed(2),
      taahhut: +(items.reduce((s, k) => s + k.taahhut, 0) / 1e6).toFixed(2),
    };
  });

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div style={{ background: '#ffffff', border: '1px solid var(--border-medium)', borderRadius: 8, padding: '12px 16px', fontSize: 13, boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}>
        <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>{label}</div>
        {payload.map((p, i) => (
          <div key={i} style={{ color: p.color, marginBottom: 4, fontWeight: 500 }}>{p.name}: <strong>₺{p.value}M</strong></div>
        ))}
      </div>
    );
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 className="page-title">Bütçe & Maliyet</h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>Gerçek zamanlı bütçe vs. fiili maliyet analizi</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <select
            value={selectedProject}
            onChange={e => setSelectedProject(e.target.value)}
            style={{
              background: 'var(--bg-card)', border: '1px solid var(--border-subtle)',
              borderRadius: 10, padding: '9px 14px', color: 'var(--text-primary)',
              fontSize: 13, fontFamily: 'Inter, sans-serif', cursor: 'pointer', outline: 'none',
            }}
          >
            {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <button className="btn btn-ghost" onClick={() => alert('Bütçe raporu hazırlanıyor ve indiriliyor...')}><Download size={14} /> Rapor</button>
        </div>
      </div>

      {/* KPI Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'Toplam Bütçe', val: `₺${(toplamButce/1e6).toFixed(1)}M`, color: '#3b82f6', icon: DollarSign, sub: '10 kalem' },
          { label: 'Gerçekleşen', val: `₺${(toplamHarcanan/1e6).toFixed(1)}M`, color: '#818cf8', icon: TrendingDown, sub: `%${tamamlanmaOrani} tüketildi` },
          { label: 'Taahhüt', val: `₺${(toplamTaahhut/1e6).toFixed(1)}M`, color: '#fbbf24', icon: TrendingUp, sub: 'Sözleşmeli' },
          { label: 'Bütçe Sapması', val: sapma >= 0 ? `+₺${(sapma/1e6).toFixed(1)}M` : `-₺${(Math.abs(sapma)/1e6).toFixed(1)}M`, color: sapma > 0 ? '#f87171' : '#34d399', icon: AlertTriangle, sub: sapma > 0 ? 'Bütçe aşımı!' : 'Bütçe dahilinde' },
        ].map((item, i) => {
          const ItemIcon = item.icon;
          return (
            <motion.div key={item.label} className="glass-card" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }} style={{ padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 9, background: `${item.color}18`, border: `1px solid ${item.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ItemIcon size={16} color={item.color} />
                </div>
              </div>
              <div style={{ fontSize: 26, fontWeight: 700, color: item.color, fontFamily: 'Outfit, sans-serif', marginBottom: 4 }}>{item.val}</div>
              <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 2 }}>{item.label}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{item.sub}</div>
            </motion.div>
          );
        })}
      </div>

      {/* Chart */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 20, marginBottom: 20 }}>
        <motion.div className="glass-card" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} style={{ padding: 20 }}>
          <h3 className="section-title">Kategori Bazlı Bütçe Analizi (₺M)</h3>
          <ResponsiveContainer width="100%" height={290}>
            <ComposedChart data={chartData} barCategoryGap="25%" margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="4 4" stroke="#cbd5e1" vertical={false} strokeWidth={1.5} />
              <XAxis dataKey="name" tick={{ fill: 'var(--text-secondary)', fontSize: 12, fontWeight: 600 }} axisLine={false} tickLine={false} dy={10} />
              <YAxis tick={{ fill: 'var(--text-secondary)', fontSize: 12, fontWeight: 600 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', paddingTop: 20 }} />
              <Bar dataKey="butce" name="Bütçe" fill="#93c5fd" radius={[5,5,0,0]} />
              <Bar dataKey="gercek" name="Gerçekleşen" fill="#2563eb" radius={[5,5,0,0]} />
              <Line type="monotone" dataKey="taahhut" name="Taahhüt" stroke="#d97706" strokeWidth={4} dot={{ fill: '#d97706', r: 5, strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 7 }} strokeDasharray="6 3" />
            </ComposedChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div className="glass-card" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 }} style={{ padding: 20 }}>
          <h3 className="section-title">Aylık Maliyet Akışı (₺M)</h3>
          <ResponsiveContainer width="100%" height={290}>
            <ComposedChart data={aylikMaliyet} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="4 4" stroke="#cbd5e1" vertical={false} strokeWidth={1.5} />
              <XAxis dataKey="ay" tick={{ fill: 'var(--text-secondary)', fontSize: 12, fontWeight: 600 }} axisLine={false} tickLine={false} dy={10} />
              <YAxis tick={{ fill: 'var(--text-secondary)', fontSize: 12, fontWeight: 600 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', paddingTop: 20 }} />
              <ReferenceLine y={4.5} stroke="#ef4444" strokeWidth={2.5} strokeDasharray="5 3" label={{ value: '⚠ Limit', fill: '#ef4444', fontSize: 12, fontWeight: 700, position: 'insideTopLeft' }} />
              <Bar dataKey="gercek" name="Gerçekleşen" fill="#6366f1" radius={[5,5,0,0]} barSize={32} />
              <Line type="monotone" dataKey="tahmin" name="Tahmin" stroke="#d97706" strokeWidth={4} strokeDasharray="6 4" dot={{ fill: '#d97706', r: 5, stroke: '#fff', strokeWidth: 2 }} activeDot={{ r: 7 }} />
              <Line type="monotone" dataKey="butce" name="Bütçe" stroke="#64748b" strokeWidth={3} dot={{ fill: '#64748b', r: 3, stroke: '#fff', strokeWidth: 1 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

         <motion.div className="glass-card" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.38 }} style={{ padding: 20, marginBottom: 20 }}>
        <h3 className="section-title" style={{ marginBottom: 16 }}>Bütçe Dağılım ve Maliyet Merkezleri</h3>
        <div style={{ display: 'flex', gap: 20 }}>
          <div style={{ flex: 1, padding: 16, background: 'var(--bg-secondary)', borderRadius: 12, border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Malzeme Maliyeti</span>
              <span style={{ fontSize: 13, color: '#3b82f6', fontWeight: 600 }}>₺{(toplamHarcanan * 0.52 / 1e6).toFixed(2)}M</span>
            </div>
            <div style={{ width: '100%', height: 8, background: 'var(--border-medium)', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{ width: '52%', height: '100%', background: '#3b82f6', borderRadius: 4 }} />
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 8 }}>%52 (Demir, Beton, İnce Yapı)</div>
          </div>
          <div style={{ flex: 1, padding: 16, background: 'var(--bg-secondary)', borderRadius: 12, border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Taşeron (Alt Yüklenci)</span>
              <span style={{ fontSize: 13, color: '#fb923c', fontWeight: 600 }}>₺{(toplamHarcanan * 0.34 / 1e6).toFixed(2)}M</span>
            </div>
            <div style={{ width: '100%', height: 8, background: 'var(--border-medium)', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{ width: '34%', height: '100%', background: '#fb923c', borderRadius: 4 }} />
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 8 }}>%34 (Elektrik, Mekanik, Cephe)</div>
          </div>
          <div style={{ flex: 1, padding: 16, background: 'var(--bg-secondary)', borderRadius: 12, border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>İşçilik ve SGK</span>
              <span style={{ fontSize: 13, color: '#34d399', fontWeight: 600 }}>₺{(toplamHarcanan * 0.14 / 1e6).toFixed(2)}M</span>
            </div>
            <div style={{ width: '100%', height: 8, background: 'var(--border-medium)', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{ width: '14%', height: '100%', background: '#34d399', borderRadius: 4 }} />
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 8 }}>%14 (Direkt Personel)</div>
          </div>
        </div>
      </motion.div>

      {/* Detail Table */}
      <motion.div className="glass-card" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>Bütçe Kalemleri</h3>
          <div style={{ display: 'flex', gap: 6 }}>
            <button onClick={() => setActiveCategory(null)} style={{ fontSize: 11, padding: '4px 10px', borderRadius: 6, border: '1px solid var(--border-subtle)', background: !activeCategory ? 'rgba(59,130,246,0.12)' : 'transparent', color: !activeCategory ? '#3b82f6' : 'var(--text-secondary)', cursor: 'pointer' }}>Tümü</button>
            {categories.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat === activeCategory ? null : cat)} style={{ fontSize: 11, padding: '4px 10px', borderRadius: 6, border: '1px solid var(--border-subtle)', background: activeCategory === cat ? 'rgba(59,130,246,0.12)' : 'transparent', color: activeCategory === cat ? '#3b82f6' : 'var(--text-secondary)', cursor: 'pointer' }}>{cat}</button>
            ))}
          </div>
        </div>
        <table className="erp-table">
          <thead><tr><th>Kalem</th><th>Kategori</th><th>Bütçe</th><th>Gerçekleşen</th><th>Taahhüt</th><th>Sapma</th><th>Tüketim</th></tr></thead>
          <tbody>
            {filtered.map((k, i) => {
              const sapma = k.harcanan - k.butce;
              const oran = Math.round((k.harcanan / k.butce) * 100);
              const barColor = oran > 100 ? '#f87171' : oran > 85 ? '#fbbf24' : '#34d399';
              return (
                <motion.tr key={k.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}>
                  <td style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: 13 }}>{k.alt}</td>
                  <td><span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 6, background: 'var(--glass-bg)', color: 'var(--text-secondary)' }}>{k.kategori}</span></td>
                  <td style={{ color: 'var(--text-primary)', fontWeight: 500 }}>₺{(k.butce/1e6).toFixed(2)}M</td>
                  <td style={{ color: '#3b82f6', fontWeight: 600 }}>₺{(k.harcanan/1e6).toFixed(2)}M</td>
                  <td style={{ color: '#fbbf24' }}>₺{(k.taahhut/1e6).toFixed(2)}M</td>
                  <td style={{ color: sapma > 0 ? '#f87171' : '#34d399', fontWeight: 600 }}>{sapma > 0 ? '+' : ''}₺{(sapma/1000).toFixed(0)}K</td>
                  <td style={{ minWidth: 120 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ flex: 1, height: 5, background: 'var(--glass-bg)', borderRadius: 3, overflow: 'hidden' }}>
                        <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(100, oran)}%` }} transition={{ delay: 0.5, duration: 0.8 }} style={{ height: '100%', background: barColor, borderRadius: 3 }} />
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 600, color: barColor, minWidth: 32 }}>%{oran}</span>
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
}
