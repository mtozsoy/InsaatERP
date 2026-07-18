import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Plus, TrendingUp, DollarSign, Clock, CheckCircle, X } from 'lucide-react';
import { HakedisCard } from '../components/Cards/Cards';
import useERP from '../store/useERP';

const PIPELINE_STAGES = [
  { id: 'onay-bekliyor', label: 'Onay Bekliyor', color: '#fbbf24', icon: Clock },
  { id: 'beklemede', label: 'Ödeme Bekliyor', color: '#fb923c', icon: TrendingUp },
  { id: 'ödendi', label: 'Ödendi', color: '#34d399', icon: CheckCircle },
];

const monthlyPayments = [
  { month: 'Tem', odendi: 8.2, beklenen: 12 },
  { month: 'Ağu', odendi: 11.4, beklenen: 14 },
  { month: 'Eyl', odendi: 9.8, beklenen: 11 },
  { month: 'Eki', odendi: 15.2, beklenen: 16 },
  { month: 'Kas', odendi: 13.6, beklenen: 15 },
  { month: 'Ara', odendi: 18.5, beklenen: 31.5 },
];

export default function Finance() {
  const { hakedisler, projects, updateHakedisStatus, addHakedis } = useERP();
  const [draggingId, setDraggingId] = useState(null);
  const [overStage, setOverStage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ title: '', amount: '', date: '', status: 'onay-bekliyor', kdv: 20, stopaj: 3 });

  const handleModalSubmit = (e) => {
    e.preventDefault();
    if (formData.title) {
      addHakedis(formData);
      setShowModal(false);
      setFormData({ title: '', amount: '', date: '', status: 'onay-bekliyor', kdv: 20, stopaj: 3 });
    }
  };

  const handleDragStart = (e, id) => {
    setDraggingId(id);
    e.dataTransfer.setData('text/plain', id);
  };

  const handleDrop = (e, stageId) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain');
    if (id) updateHakedisStatus(id, stageId);
    setDraggingId(null);
    setOverStage(null);
  };

  const totalPaid = hakedisler.filter(h => h.status === 'ödendi').reduce((s, h) => s + (Number(h.amount) || Number(h.tutar) || 0), 0);
  const totalPending = hakedisler.filter(h => h.status !== 'ödendi').reduce((s, h) => s + (Number(h.amount) || Number(h.tutar) || 0), 0);
  const totalAll = hakedisler.reduce((s, h) => s + (Number(h.amount) || Number(h.tutar) || 0), 0);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 className="page-title">Hakediş & Finans</h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
            {hakedisler.length} hakediş · Toplam ₺{(totalAll / 1000000).toFixed(1)}M
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={14} /> Yeni Hakediş
        </button>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'Toplam Ödenen', value: totalPaid, color: '#34d399' },
          { label: 'Ödeme Bekleyen', value: totalPending, color: '#fb923c' },
          { label: 'Toplam Hakediş', value: totalAll, color: '#3b82f6' },
        ].map((item, i) => (
          <motion.div
            key={item.label}
            className="glass-card"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            style={{ padding: 20 }}
          >
            <DollarSign size={16} color={item.color} style={{ marginBottom: 8 }} />
            <div style={{ fontSize: 28, fontWeight: 700, color: item.color, fontFamily: 'Outfit, sans-serif' }}>
              ₺{(item.value / 1000000).toFixed(2)}M
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{item.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Chart */}
      <motion.div
        className="glass-card"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={{ padding: 20, marginBottom: 24 }}
      >
        <h3 className="section-title">Aylık Hakediş Akışı (₺M)</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={monthlyPayments} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="4 4" stroke="#cbd5e1" vertical={false} strokeWidth={1.5} />
            <XAxis dataKey="month" tick={{ fill: 'var(--text-secondary)', fontSize: 12, fontWeight: 600 }} axisLine={false} tickLine={false} dy={8} />
            <YAxis tick={{ fill: 'var(--text-secondary)', fontSize: 12, fontWeight: 600 }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{
                background: '#ffffff', border: '1px solid var(--border-medium)',
                borderRadius: 8, fontSize: 13, fontWeight: 500, color: 'var(--text-primary)',
                boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'
              }}
            />
            <Bar dataKey="odendi" name="Ödendi" fill="#16a34a" radius={[5, 5, 0, 0]} />
            <Bar dataKey="beklenen" name="Beklenen" fill="#60a5fa" radius={[5, 5, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Pipeline */}
      <h3 className="section-title">Hakediş Pipeline — Sürükle & Bırak</h3>
      <div style={{ display: 'flex', gap: 16, overflowX: 'auto', paddingBottom: 12 }}>
        {PIPELINE_STAGES.map((stage) => {
          const stageHakedis = hakedisler.filter(h => h.status === stage.id);
          const StageIcon = stage.icon;
          const isOver = overStage === stage.id;
          return (
            <div
              key={stage.id}
              onDragOver={(e) => { e.preventDefault(); setOverStage(stage.id); }}
              onDrop={(e) => handleDrop(e, stage.id)}
              style={{
                minWidth: 300, flex: 1,
                background: isOver ? `${stage.color}08` : 'var(--glass-bg)',
                border: `1px solid ${isOver ? stage.color + '60' : 'var(--glass-border)'}`,
                borderTop: `2px solid ${stage.color}`,
                borderRadius: 'var(--radius-lg)',
                padding: 16,
                transition: 'all 0.2s',
                boxShadow: isOver ? `0 0 20px ${stage.color}20` : 'none',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <StageIcon size={16} color={stage.color} />
                <span style={{ fontSize: 13, fontWeight: 600, color: stage.color }}>{stage.label}</span>
                <span style={{
                  marginLeft: 'auto', background: `${stage.color}20`,
                  color: stage.color, borderRadius: 20, padding: '1px 8px',
                  fontSize: 11, fontWeight: 700,
                }}>{stageHakedis.length}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {stageHakedis.map(h => (
                  <div
                    key={h.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, h.id)}
                    onDragEnd={() => { setDraggingId(null); setOverStage(null); }}
                  >
                    <HakedisCard hakedis={h} />
                  </div>
                ))}
                {stageHakedis.length === 0 && (
                  <div style={{
                    textAlign: 'center', padding: '20px 0',
                    color: 'var(--text-muted)', fontSize: 12,
                    border: `2px dashed ${stage.color}30`, borderRadius: 10,
                  }}>Buraya sürükle</div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* New Finance Modal */}
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
                <h3 style={{ margin: 0, color: 'var(--text-primary)', fontSize: 18, fontFamily: 'Outfit, sans-serif' }}>Yeni Hakediş Ekle</h3>
                <button onClick={() => setShowModal(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex' }}><X size={20} /></button>
              </div>

              <form onSubmit={handleModalSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6 }}>Hakediş Tanımı</label>
                  <input required type="text" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="search-input" style={{ width: '100%', padding: '10px 14px' }} placeholder="Örn: 5 Nolu Taşeron Hakedişi" />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6 }}>Tutar (₺)</label>
                    <input type="number" value={formData.amount} onChange={e => setFormData({ ...formData, amount: e.target.value })} className="search-input" style={{ width: '100%', padding: '10px 14px' }} placeholder="Örn: 250000" />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6 }}>Tarih / Dönem</label>
                    <input type="date" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} className="search-input" style={{ width: '100%', padding: '10px 14px' }} />
                  </div>
                </div>
                {formData.amount && (
                  <div style={{ background: 'var(--glass-bg)', padding: 16, borderRadius: 10, border: '1px solid var(--glass-border)' }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 10 }}>Vergi & Kesinti Otomasyonu</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
                      <div>
                        <label style={{ fontSize: 11, color: 'var(--text-muted)' }}>KDV Oranı (%)</label>
                        <select value={formData.kdv} onChange={e => setFormData({ ...formData, kdv: Number(e.target.value) })} className="search-input" style={{ width: '100%', padding: '6px 10px', marginTop: 4 }}>
                          <option value={0}>%0</option><option value={10}>%10</option><option value={20}>%20</option>
                        </select>
                      </div>
                      <div>
                        <label style={{ fontSize: 11, color: 'var(--text-muted)' }}>Stopaj Oranı (%)</label>
                        <select value={formData.stopaj} onChange={e => setFormData({ ...formData, stopaj: Number(e.target.value) })} className="search-input" style={{ width: '100%', padding: '6px 10px', marginTop: 4 }}>
                          <option value={0}>%0</option><option value={3}>%3</option><option value={5}>%5</option>
                        </select>
                      </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4, color: 'var(--text-secondary)' }}>
                      <span>KDV Tutar:</span> <span style={{ color: '#34d399' }}>+₺{((Number(formData.amount) || 0) * (formData.kdv / 100)).toLocaleString('tr-TR')}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 8, color: 'var(--text-secondary)' }}>
                      <span>Stopaj Kesinti:</span> <span style={{ color: '#f87171' }}>-₺{((Number(formData.amount) || 0) * (formData.stopaj / 100)).toLocaleString('tr-TR')}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, fontWeight: 700, paddingTop: 8, borderTop: '1px dashed var(--border-subtle)', color: 'var(--text-primary)' }}>
                      <span>Net Ödenecek:</span> <span>₺{((Number(formData.amount) || 0) * (1 + formData.kdv / 100 - formData.stopaj / 100)).toLocaleString('tr-TR')}</span>
                    </div>
                  </div>
                )}
                <div>
                  <label style={{ display: 'block', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6 }}>Başlangıç Durumu</label>
                  <select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })} className="search-input" style={{ width: '100%', padding: '10px 14px', appearance: 'none' }}>
                    <option value="onay-bekliyor">Onay Bekliyor</option>
                    <option value="beklemede">Ödeme Bekliyor</option>
                    <option value="ödendi">Ödendi</option>
                  </select>
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
