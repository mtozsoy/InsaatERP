import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Truck, Map, Wrench, CircleDashed, Plus, Search, Activity, CalendarClock, ShieldAlert, Navigation, X } from 'lucide-react';
import useERP from '../store/useERP';

const mockTires = [
  { id: 't1', plaka: '06 KML 89', pozisyon: 'Sol Ön', dot: '1223', derinlik: '14mm', durum: 'İyi' },
  { id: 't2', plaka: '06 KML 89', pozisyon: 'Sağ Ön', dot: '1223', derinlik: '13.5mm', durum: 'İyi' },
  { id: 't3', plaka: '34 XYZ 123', pozisyon: 'Arka Sağ', dot: '4521', derinlik: '4mm', durum: 'Değişim Gerekli' },
];

export default function Fleet() {
  const { fleetList, maintenanceList, addFleetVehicle, updateMaintenanceStatus } = useERP();
  const [activeTab, setActiveTab] = useState('list');
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ plaka: '', marka: '', surucu: '', durum: 'Aktif' });
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleWorkOrder = (id) => {
    updateMaintenanceStatus(id, 'Devam Ediyor');
    showToast('İş emri onaylandı, bakım işlemi başlatıldı.');
  };

  const handleModalSubmit = (e) => {
    e.preventDefault();
    if(formData.plaka) {
      addFleetVehicle({
        id: `f-${Date.now()}`,
        plaka: formData.plaka,
        marka: formData.marka,
        model: '',
        surucu: formData.surucu,
        durum: formData.durum,
        yakit: 'Bilinmiyor',
        konum: 'Bilinmiyor'
      });
      showToast(`${formData.plaka} plakalı araç başarıyla eklendi.`);
      setShowModal(false);
      setFormData({ plaka: '', marka: '', surucu: '', durum: 'Aktif' });
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'list':
        return (
          <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: 16, borderBottom: '1px solid var(--border-subtle)' }}>
              <div className="search-wrapper" style={{ maxWidth: 300 }}>
                <Search size={14} className="search-icon" />
                <input className="search-input" placeholder="Plaka veya sürücü ara..." value={search} onChange={e => setSearch(e.target.value)} />
              </div>
            </div>
            <table className="erp-table">
              <thead><tr><th>Plaka</th><th>Marka/Model</th><th>Sürücü</th><th>Durum</th><th>Yakıt Durumu</th><th>Konum</th></tr></thead>
              <tbody>
                {fleetList.filter(f => f.plaka.toLowerCase().includes(search.toLowerCase()) || f.surucu.toLowerCase().includes(search.toLowerCase())).map(f => (
                  <tr key={f.id}>
                    <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{f.plaka}</td>
                    <td>{f.marka} {f.model}</td>
                    <td>{f.surucu}</td>
                    <td>
                      <span style={{ fontSize: 11, padding: '4px 8px', borderRadius: 6, background: f.durum === 'Aktif' ? 'rgba(52,211,153,0.1)' : 'rgba(248,113,113,0.1)', color: f.durum === 'Aktif' ? '#34d399' : '#f87171' }}>
                        {f.durum}
                      </span>
                    </td>
                    <td>{f.yakit}</td>
                    <td>{f.konum}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case 'map':
        return (
          <div className="glass-card" style={{ height: 500, padding: 0, position: 'relative', overflow: 'hidden', background: '#0f172a', backgroundImage: 'radial-gradient(circle at 20% 30%, rgba(59,130,246,0.1) 0%, transparent 40%), radial-gradient(circle at 80% 70%, rgba(52,211,153,0.1) 0%, transparent 40%)' }}>
            <div style={{ position: 'absolute', top: 20, left: 20, zIndex: 10, background: 'rgba(15,23,42,0.7)', backdropFilter: 'blur(10px)', padding: 16, borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>
              <h4 style={{ margin: '0 0 10px 0', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: 6 }}><Navigation size={14} color="#3b82f6" /> Filo Canlı Takip</h4>
              <div style={{ fontSize: 12, color: '#94a3b8' }}>Hareket Halinde: 2</div>
              <div style={{ fontSize: 12, color: '#94a3b8' }}>Rölantide: 1</div>
            </div>
            
            {/* Improved Grid Background for Map Feel */}
            <div style={{ position: 'absolute', inset: 0, opacity: 0.15, backgroundImage: 'linear-gradient(rgba(148,163,184,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.3) 1px, transparent 1px)', backgroundSize: '50px 50px' }} />
            <div style={{ position: 'absolute', inset: 0, opacity: 0.05, backgroundImage: 'linear-gradient(rgba(148,163,184,0.5) 2px, transparent 2px), linear-gradient(90deg, rgba(148,163,184,0.5) 2px, transparent 2px)', backgroundSize: '250px 250px' }} />
            
            {/* Topographic Lines Mock */}
            <svg style={{ position: 'absolute', width: '100%', height: '100%', opacity: 0.05 }}>
              <path d="M0 100 Q 250 50, 500 200 T 1000 150" stroke="#fff" fill="none" strokeWidth="2" />
              <path d="M0 250 Q 300 200, 600 350 T 1000 300" stroke="#fff" fill="none" strokeWidth="2" />
            </svg>
            
            {/* Moving Blips */}
            <motion.div animate={{ x: [100, 300, 200], y: [100, 150, 300] }} transition={{ repeat: Infinity, duration: 15, ease: "linear" }} style={{ position: 'absolute', left: 0, top: 0 }}>
              <div style={{ width: 14, height: 14, background: '#3b82f6', borderRadius: '50%', boxShadow: '0 0 15px #3b82f6', border: '2px solid white' }} />
              <div style={{ background: 'rgba(0,0,0,0.8)', padding: '2px 6px', borderRadius: 4, fontSize: 10, color: 'white', position: 'absolute', top: 18, left: -20, whiteSpace: 'nowrap' }}>34 XYZ 123 (65 km/h)</div>
            </motion.div>
            <motion.div animate={{ x: [400, 350, 400], y: [400, 200, 400] }} transition={{ repeat: Infinity, duration: 20, ease: "linear" }} style={{ position: 'absolute', left: 0, top: 0 }}>
              <div style={{ width: 14, height: 14, background: '#34d399', borderRadius: '50%', boxShadow: '0 0 15px #34d399', border: '2px solid white' }} />
              <div style={{ background: 'rgba(0,0,0,0.8)', padding: '2px 6px', borderRadius: 4, fontSize: 10, color: 'white', position: 'absolute', top: 18, left: -20, whiteSpace: 'nowrap' }}>06 KML 89 (42 km/h)</div>
            </motion.div>
          </div>
        );
      case 'maintenance':
        return (
          <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
            <table className="erp-table">
              <thead><tr><th>Plaka</th><th>İşlem Tipi</th><th>Tarih</th><th>Maliyet</th><th>Durum</th><th>İşlem</th></tr></thead>
              <tbody>
                {maintenanceList.map(m => (
                  <tr key={m.id}>
                    <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{m.plaka}</td>
                    <td>{m.tip}</td>
                    <td>{m.tarih}</td>
                    <td>{m.maliyet}</td>
                    <td>
                      <span style={{ fontSize: 11, padding: '4px 8px', borderRadius: 6, background: m.durum === 'Planlandı' ? 'rgba(251,191,36,0.1)' : 'rgba(59,130,246,0.1)', color: m.durum === 'Planlandı' ? '#fbbf24' : '#3b82f6' }}>
                        {m.durum}
                      </span>
                    </td>
                    <td>
                      {m.durum === 'Planlandı' ? (
                        <button className="btn btn-ghost" onClick={() => handleWorkOrder(m.id)} style={{ padding: '4px 8px', fontSize: 11 }}>İş Emri Ver</button>
                      ) : (
                        <span style={{ fontSize: 11, color: 'var(--text-muted)', paddingLeft: 8 }}>İşlemde</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case 'tires':
        return (
          <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
            <table className="erp-table">
              <thead><tr><th>Plaka</th><th>Pozisyon</th><th>DOT (Üretim)</th><th>Diş Derinliği</th><th>Durum</th></tr></thead>
              <tbody>
                {mockTires.map(t => (
                  <tr key={t.id}>
                    <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{t.plaka}</td>
                    <td>{t.pozisyon}</td>
                    <td>{t.dot}</td>
                    <td>{t.derinlik}</td>
                    <td>
                      <span style={{ fontSize: 11, padding: '4px 8px', borderRadius: 6, background: t.durum === 'İyi' ? 'rgba(52,211,153,0.1)' : 'rgba(248,113,113,0.1)', color: t.durum === 'İyi' ? '#34d399' : '#f87171' }}>
                        {t.durum}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999, background: toast.type === 'success' ? '#34d399' : '#f87171', color: '#fff', padding: '12px 20px', borderRadius: 10, fontSize: 14, fontWeight: 600, boxShadow: '0 8px 24px rgba(0,0,0,0.15)', display: 'flex', alignItems: 'center', gap: 8, maxWidth: 360 }}>
          <span>{toast.type === 'success' ? '✓' : '!'}</span> {toast.msg}
        </div>
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 className="page-title">Araç & Ekipman Yönetimi</h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>Tüm iş makinesi ve araç filosu için operasyonel takip merkezi.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}><Plus size={14} /> Yeni Araç/Ekipman Ekle</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        <div className="glass-card" style={{ padding: 18 }}>
          <Truck size={18} color="#3b82f6" style={{ marginBottom: 10 }} />
          <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif' }}>{fleetList.length}</div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Toplam Araç</div>
        </div>
        <div className="glass-card" style={{ padding: 18 }}>
          <Map size={18} color="#34d399" style={{ marginBottom: 10 }} />
          <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif' }}>{fleetList.filter(f => f.durum === 'Aktif').length}</div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Sahada (Aktif)</div>
        </div>
        <div className="glass-card" style={{ padding: 18 }}>
          <Wrench size={18} color="#f59e0b" style={{ marginBottom: 10 }} />
          <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif' }}>3</div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Kademede (Bakım)</div>
        </div>
        <div className="glass-card" style={{ padding: 18 }}>
          <ShieldAlert size={18} color="#f87171" style={{ marginBottom: 10 }} />
          <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif' }}>2</div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Sigorta Yaklaşan</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        <button onClick={() => setActiveTab('list')} style={{ background: activeTab === 'list' ? 'var(--bg-card)' : 'transparent', border: activeTab === 'list' ? '1px solid var(--border-subtle)' : '1px solid transparent', padding: '8px 16px', borderRadius: 8, color: activeTab === 'list' ? '#3b82f6' : 'var(--text-secondary)', fontSize: 13, fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}><Truck size={14} /> Araç Listesi</button>
        <button onClick={() => setActiveTab('map')} style={{ background: activeTab === 'map' ? 'var(--bg-card)' : 'transparent', border: activeTab === 'map' ? '1px solid var(--border-subtle)' : '1px solid transparent', padding: '8px 16px', borderRadius: 8, color: activeTab === 'map' ? '#3b82f6' : 'var(--text-secondary)', fontSize: 13, fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}><Map size={14} /> GPS Haritası (Arvento)</button>
        <button onClick={() => setActiveTab('maintenance')} style={{ background: activeTab === 'maintenance' ? 'var(--bg-card)' : 'transparent', border: activeTab === 'maintenance' ? '1px solid var(--border-subtle)' : '1px solid transparent', padding: '8px 16px', borderRadius: 8, color: activeTab === 'maintenance' ? '#3b82f6' : 'var(--text-secondary)', fontSize: 13, fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}><Wrench size={14} /> Bakım Yönetimi</button>
        <button onClick={() => setActiveTab('tires')} style={{ background: activeTab === 'tires' ? 'var(--bg-card)' : 'transparent', border: activeTab === 'tires' ? '1px solid var(--border-subtle)' : '1px solid transparent', padding: '8px 16px', borderRadius: 8, color: activeTab === 'tires' ? '#3b82f6' : 'var(--text-secondary)', fontSize: 13, fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}><CircleDashed size={14} /> Lastik Panosu</button>
      </div>

      {renderContent()}

      {/* Yeni Araç/Ekipman Ekle Modalı */}
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
                <h3 style={{ margin: 0, color: 'var(--text-primary)', fontSize: 18, fontFamily: 'Outfit, sans-serif' }}>Yeni Araç / Ekipman Ekle</h3>
                <button onClick={() => setShowModal(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex' }}><X size={20} /></button>
              </div>

              <form onSubmit={handleModalSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6 }}>Plaka veya Araç Kodu</label>
                  <input required type="text" value={formData.plaka} onChange={e => setFormData({ ...formData, plaka: e.target.value })} className="search-input" style={{ width: '100%', padding: '10px 14px' }} placeholder="Örn: 34 XYZ 123" />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6 }}>Marka/Model</label>
                    <input type="text" value={formData.marka} onChange={e => setFormData({ ...formData, marka: e.target.value })} className="search-input" style={{ width: '100%', padding: '10px 14px' }} placeholder="Örn: Ford Transit" />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6 }}>Sürücü / Operatör</label>
                    <input type="text" value={formData.surucu} onChange={e => setFormData({ ...formData, surucu: e.target.value })} className="search-input" style={{ width: '100%', padding: '10px 14px' }} placeholder="Örn: Ahmet Yılmaz" />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6 }}>Durum</label>
                  <select value={formData.durum} onChange={e => setFormData({ ...formData, durum: e.target.value })} className="search-input" style={{ width: '100%', padding: '10px 14px', appearance: 'none' }}>
                    <option value="Aktif">Aktif</option>
                    <option value="Bakımda">Bakımda</option>
                    <option value="Pasif">Pasif</option>
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
