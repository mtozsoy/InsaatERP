import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckSquare, Clock, CheckCircle, XCircle, AlertTriangle, Filter } from 'lucide-react';
import { onaylar } from '../data/mockData';
import useERP from '../store/useERP';

const tipColors = { hakediş: '#3b82f6', satınalma: '#fb923c', sözleşme: '#818cf8' };
const tipIcons = { hakediş: '💰', satınalma: '📦', sözleşme: '📝' };
const oncColors = { kritik: '#f87171', yüksek: '#fb923c', orta: '#fbbf24', düşük: '#94a3b8' };

export default function Approvals() {
  const { onaylar: storeOnaylar, updateOnay } = useERP();
  const [filter, setFilter] = useState('tümü');

  const approve = (id) => updateOnay(id, 'approve');
  const reject = (id) => updateOnay(id, 'reject');

  const filtered = filter === 'tümü' ? storeOnaylar :
    filter === 'bekleyen' ? storeOnaylar.filter(o => o.status === 'beklemede') :
    storeOnaylar.filter(o => o.status === filter);

  const bekleyenCount = storeOnaylar.filter(o => o.status === 'beklemede').length;
  const onaylananCount = storeOnaylar.filter(o => o.status === 'onaylandı').length;
  const reddedilenCount = storeOnaylar.filter(o => o.status === 'reddedildi').length;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 className="page-title">Onay Merkezi</h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>Hakediş, satınalma ve sözleşme onayları tek yerden</p>
        </div>
      </div>

      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'Bekleyen', val: bekleyenCount, color: '#fbbf24', icon: Clock },
          { label: 'Onaylanan', val: onaylananCount, color: '#34d399', icon: CheckCircle },
          { label: 'Reddedilen', val: reddedilenCount, color: '#f87171', icon: XCircle },
          { label: 'Kritik', val: storeOnaylar.filter(o => o.oncelik === 'kritik').length, color: '#f87171', icon: AlertTriangle },
        ].map((item, i) => {
          const ItemIcon = item.icon;
          return (
            <motion.div key={item.label} className="glass-card" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }} style={{ padding: 18, display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 42, height: 42, borderRadius: 12, background: `${item.color}18`, border: `1px solid ${item.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ItemIcon size={18} color={item.color} />
              </div>
              <div>
                <div style={{ fontSize: 26, fontWeight: 700, color: item.color, fontFamily: 'Outfit, sans-serif' }}>{item.val}</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{item.label}</div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Filter */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 20 }}>
        {['tümü', 'bekleyen', 'onaylandı', 'reddedildi'].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{ fontSize: 12, padding: '6px 14px', borderRadius: 8, border: '1px solid var(--border-subtle)', background: filter === f ? 'rgba(59,130,246,0.15)' : 'var(--bg-card)', color: filter === f ? '#3b82f6' : 'var(--text-secondary)', cursor: 'pointer', fontFamily: 'Inter, sans-serif', transition: 'all 0.2s', textTransform: 'capitalize' }}>
            {f}
          </button>
        ))}
      </div>

      {/* Onay Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <AnimatePresence>
          {filtered.map((onay, i) => {
            const tipColor = tipColors[onay.tip] || '#3b82f6';
            const oncColor = oncColors[onay.oncelik] || '#fbbf24';
            return (
              <motion.div key={onay.id} className="glass-card" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ delay: i * 0.04 }} style={{ padding: 20, borderLeft: `3px solid ${tipColor}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: 14 }}>{tipIcons[onay.tip]}</span>
                      <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>{onay.baslik}</span>
                      <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 4, background: `${oncColor}18`, color: oncColor, border: `1px solid ${oncColor}30`, fontWeight: 600, textTransform: 'uppercase' }}>{onay.oncelik}</span>
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 4 }}>{onay.aciklama}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Talipçi: {onay.talipci} · {new Date(onay.tarih).toLocaleDateString('tr-TR')}</div>
                  </div>
                  <span className={`badge badge-${onay.status === 'beklemede' ? 'beklemede' : onay.status === 'onaylandı' ? 'tamamlandı' : 'kritik'}`}>{onay.status}</span>
                </div>

                {/* Approval Flow */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: onay.status === 'beklemede' ? 16 : 0 }}>
                  {onay.adimlar.map((adim, idx) => {
                    const done = idx < onay.mevcutAdim;
                    const current = idx === onay.mevcutAdim && onay.status === 'beklemede';
                    const stepColor = done ? '#34d399' : current ? '#fbbf24' : 'var(--border-medium)';
                    return (
                      <React.Fragment key={adim}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <div style={{ width: 32, height: 32, borderRadius: '50%', background: done ? '#34d399' : current ? 'rgba(251,191,36,0.2)' : 'var(--bg-card-hover)', border: `2px solid ${stepColor}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: done ? '#ffffff' : 'var(--text-secondary)', fontWeight: 700 }}>
                            {done ? '✓' : idx + 1}
                          </div>
                          <div style={{ fontSize: 9, color: 'var(--text-muted)', marginTop: 4, textAlign: 'center', maxWidth: 60, lineHeight: 1.3 }}>{adim}</div>
                        </div>
                        {idx < onay.adimlar.length - 1 && (
                          <div style={{ flex: 1, height: 2, background: done ? '#34d399' : 'var(--border-subtle)', margin: '0 4px', marginBottom: 20, minWidth: 20 }} />
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>

                {onay.status === 'beklemede' && (
                  <div style={{ display: 'flex', gap: 10, paddingTop: 12, borderTop: '1px solid var(--border-subtle)' }}>
                    <button onClick={() => approve(onay.id)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 8, border: 'none', cursor: 'pointer', background: 'rgba(0,255,179,0.15)', color: '#34d399', fontSize: 13, fontFamily: 'Inter, sans-serif', fontWeight: 600, transition: 'all 0.2s' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,255,179,0.25)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,255,179,0.15)'}
                    >
                      <CheckCircle size={14} /> Onayla
                    </button>
                    <button onClick={() => reject(onay.id)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 8, border: 'none', cursor: 'pointer', background: 'rgba(255,77,109,0.12)', color: '#f87171', fontSize: 13, fontFamily: 'Inter, sans-serif', fontWeight: 600, transition: 'all 0.2s' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,77,109,0.22)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,77,109,0.12)'}
                    >
                      <XCircle size={14} /> Reddet
                    </button>
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
