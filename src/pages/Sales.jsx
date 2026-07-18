import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Home, Users, TrendingUp, DollarSign, Phone, Mail } from 'lucide-react';
import { daireler, musteriler } from '../data/mockData';

const durumColors = { satıldı: '#34d399', rezerve: '#fbbf24', boş: 'rgba(255,255,255,0.2)' };
const durumBg = { satıldı: 'rgba(0,255,179,0.15)', rezerve: 'rgba(255,211,61,0.12)', boş: 'rgba(255,255,255,0.04)' };

export default function Sales() {
  const [activeTab, setActiveTab] = useState('plan');
  const [selected, setSelected] = useState(null);

  const bloklar = [...new Set(daireler.map(d => d.blok))];
  const katlar = [...new Set(daireler.map(d => d.kat))].sort((a, b) => b - a);

  const satilan = daireler.filter(d => d.durum === 'satıldı').length;
  const rezerve = daireler.filter(d => d.durum === 'rezerve').length;
  const bos = daireler.filter(d => d.durum === 'boş').length;
  const toplamCiro = daireler.filter(d => d.durum !== 'boş').reduce((s, d) => s + d.fiyat, 0);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 className="page-title">Satış Merkezi</h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>Daire/dükkan stoğu, müşteri ve tahsilat yönetimi</p>
        </div>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'Satılan', val: satilan, color: '#34d399', icon: Home },
          { label: 'Rezerve', val: rezerve, color: '#fbbf24', icon: TrendingUp },
          { label: 'Boş', val: bos, color: 'var(--text-secondary)', icon: Home },
          { label: 'Toplam Ciro', val: `₺${(toplamCiro/1e6).toFixed(1)}M`, color: '#3b82f6', icon: DollarSign },
        ].map((item, i) => {
          const ItemIcon = item.icon;
          return (
            <motion.div key={item.label} className="glass-card" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }} style={{ padding: 18 }}>
              <ItemIcon size={16} color={item.color} style={{ marginBottom: 8 }} />
              <div style={{ fontSize: 28, fontWeight: 700, color: item.color, fontFamily: 'Outfit, sans-serif' }}>{item.val}</div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>{item.label}</div>
            </motion.div>
          );
        })}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 12, padding: 4, marginBottom: 20, width: 'fit-content' }}>
        {['plan', 'musteriler'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: '7px 16px', borderRadius: 9, border: 'none', cursor: 'pointer', background: activeTab === tab ? 'rgba(59,130,246,0.12)' : 'transparent', color: activeTab === tab ? '#3b82f6' : 'var(--text-secondary)', fontSize: 13, fontFamily: 'Inter, sans-serif', transition: 'all 0.2s' }}>
            {tab === 'plan' ? '🏢 Kat Planı' : '👤 Müşteriler'}
          </button>
        ))}
      </div>

      {activeTab === 'plan' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20 }}>
          {/* Floor Plan Grid */}
          <div className="glass-card" style={{ padding: 20 }}>
            {/* Legend */}
            <div style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
              {Object.entries({ satıldı: 'Satıldı', rezerve: 'Rezerve', boş: 'Boş' }).map(([key, label]) => (
                <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 12, height: 12, borderRadius: 3, background: durumColors[key] }} />
                  <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{label}</span>
                </div>
              ))}
            </div>

            {/* Blok tabs */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
              {bloklar.map(blok => (
                <span key={blok} style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', padding: '4px 14px', background: 'rgba(0,212,255,0.12)', border: '1px solid rgba(0,212,255,0.25)', borderRadius: 8 }}>Blok {blok}</span>
              ))}
            </div>

            {/* Floors */}
            {katlar.map(kat => {
              const katDaireleri = daireler.filter(d => d.kat === kat);
              return (
                <div key={kat} style={{ display: 'flex', gap: 10, marginBottom: 10, alignItems: 'center' }}>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', width: 32, textAlign: 'right', flexShrink: 0 }}>KAT {kat}</div>
                  <div style={{ display: 'flex', gap: 8, flex: 1 }}>
                    {katDaireleri.map((daire) => (
                      <motion.div
                        key={daire.id}
                        whileHover={{ y: -2, scale: 1.03 }}
                        onClick={() => setSelected(daire.id === selected ? null : daire.id)}
                        style={{
                          flex: 1, minWidth: 90, padding: '10px 8px',
                          borderRadius: 10, cursor: 'pointer',
                          background: selected === daire.id ? `${durumColors[daire.durum]}30` : durumBg[daire.durum],
                          border: `2px solid ${selected === daire.id ? durumColors[daire.durum] : durumColors[daire.durum] + '40'}`,
                          transition: 'all 0.2s', textAlign: 'center',
                        }}
                      >
                        <div style={{ fontSize: 13, fontWeight: 700, color: durumColors[daire.durum] }}>{daire.no}</div>
                        <div style={{ fontSize: 10, color: 'var(--text-secondary)', marginTop: 2 }}>{daire.tip}</div>
                        <div style={{ fontSize: 10, color: 'var(--text-secondary)' }}>{daire.m2} m²</div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Detail Panel */}
          <div>
            {selected ? (() => {
              const daire = daireler.find(d => d.id === selected);
              if (!daire) return null;
              const dColor = durumColors[daire.durum];
              return (
                <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="glass-card" style={{ padding: 20, borderLeft: `3px solid ${dColor}` }}>
                  <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>Daire {daire.no}</div>
                  <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 6, background: `${dColor}18`, color: dColor, border: `1px solid ${dColor}30`, fontWeight: 600 }}>{daire.durum}</span>
                  <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {[
                      { l: 'Tip', v: daire.tip },
                      { l: 'Blok', v: `Blok ${daire.blok}` },
                      { l: 'Kat', v: daire.kat },
                      { l: 'Alan', v: `${daire.m2} m²` },
                      { l: 'Fiyat', v: `₺${daire.fiyat.toLocaleString('tr-TR')}` },
                    ].map(item => (
                      <div key={item.l} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 8, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{item.l}</span>
                        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{item.v}</span>
                      </div>
                    ))}
                    {daire.musteri && <div style={{ fontSize: 13, fontWeight: 600, color: '#34d399', marginTop: 4 }}>👤 {daire.musteri}</div>}
                    {daire.tarih && <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Tarih: {daire.tarih}</div>}
                  </div>
                </motion.div>
              );
            })() : (
              <div className="glass-card" style={{ padding: 24, textAlign: 'center' }}>
                <Home size={28} color="rgba(255,255,255,0.2)" style={{ margin: '0 auto 10px' }} />
                <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Daire seçin</div>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'musteriler' && (
        <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
          <table className="erp-table">
            <thead><tr><th>Müşteri</th><th>Daire</th><th>Ödeme Tipi</th><th>Tahsilat</th><th>Kalan</th><th>İletişim</th></tr></thead>
            <tbody>
              {musteriler.map((m, i) => {
                const daire = daireler.find(d => d.id === m.daire);
                const oranPct = daire ? Math.round((m.tahsilat / daire.fiyat) * 100) : 0;
                return (
                  <motion.tr key={m.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}>
                    <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{m.ad}</td>
                    <td><span style={{ color: '#3b82f6' }}>Daire {daire?.no}</span> <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>{daire?.tip} · {daire?.m2}m²</span></td>
                    <td><span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 6, background: 'var(--glass-bg)', color: 'var(--text-secondary)' }}>{m.odeme}</span></td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 60, height: 4, background: 'var(--glass-bg)', borderRadius: 2, overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${oranPct}%`, background: '#34d399', borderRadius: 2 }} />
                        </div>
                        <span style={{ color: '#34d399', fontWeight: 600, fontSize: 13 }}>₺{(m.tahsilat/1e6).toFixed(2)}M</span>
                      </div>
                    </td>
                    <td style={{ color: m.kalan > 0 ? '#fbbf24' : '#34d399', fontWeight: 600 }}>{m.kalan > 0 ? `₺${(m.kalan/1e6).toFixed(2)}M` : '✓ Tamamlandı'}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{m.telefon}</span>
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
  );
}
