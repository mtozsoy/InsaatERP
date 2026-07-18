import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, UserCheck, UserX, Search, X, QrCode, CalendarClock, Calculator, Check } from 'lucide-react';
import { PersonnelCard } from '../components/Cards/Cards';
import useERP from '../store/useERP';

// Puantaj tablosu için mock veriler (Örnek Mayıs ayı 1-7 günleri)
const days = ['1 Pzt', '2 Sal', '3 Çar', '4 Per', '5 Cum', '6 Cmt', '7 Paz'];

export default function Personnel() {
  const { personnel, projects, assignPersonnel } = useERP();
  const [activeTab, setActiveTab] = useState('ekip'); // 'ekip' veya 'puantaj'
  const [draggingId, setDraggingId] = useState(null);
  const [overProject, setOverProject] = useState(null);
  const [search, setSearch] = useState('');
  
  // Modals
  const [showModal, setShowModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [qrStatus, setQrStatus] = useState('scanning'); // scanning, success

  const [formData, setFormData] = useState({ name: '', role: '', department: 'Genel', dailyRate: '', status: 'aktif' });

  const handleModalSubmit = (e) => {
    e.preventDefault();
    if (formData.name) {
      useERP.getState().addPersonnel(formData);
      setShowModal(false);
      setFormData({ name: '', role: '', department: 'Genel', dailyRate: '', status: 'aktif' });
    }
  };

  const handleDragStart = (e, id) => {
    setDraggingId(id);
    e.dataTransfer.setData('text/plain', id);
  };

  const handleDrop = (e, projectId) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain');
    if (id) assignPersonnel(id, projectId);
    setDraggingId(null);
    setOverProject(null);
  };

  const handleQRScan = () => {
    setQrStatus('scanning');
    setShowQRModal(true);
    setTimeout(() => {
      setQrStatus('success');
      setTimeout(() => {
        setShowQRModal(false);
      }, 2000);
    }, 2500);
  };

  const filteredPersonnel = personnel.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.role.toLowerCase().includes(search.toLowerCase())
  );

  const activeProjects = projects.filter(p => p.status === 'devam');
  const totalDailyCost = personnel.reduce((s, p) => s + p.dailyRate, 0);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 className="page-title">İnsan & Veri Yönetimi</h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
            Personel atamaları, şantiye puantajları ve bordro otomasyonu
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          {activeTab === 'puantaj' ? (
            <button className="btn btn-primary" onClick={handleQRScan} style={{ background: '#34d399', borderColor: '#34d399' }}>
              <QrCode size={14} /> Şantiye QR Okut
            </button>
          ) : (
            <button className="btn btn-primary" onClick={() => setShowModal(true)}>
              <Plus size={14} /> Personel Ekle
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        <button onClick={() => setActiveTab('ekip')} style={{ background: activeTab === 'ekip' ? 'var(--bg-card)' : 'transparent', border: activeTab === 'ekip' ? '1px solid var(--border-subtle)' : '1px solid transparent', padding: '8px 16px', borderRadius: 8, color: activeTab === 'ekip' ? '#3b82f6' : 'var(--text-secondary)', fontSize: 13, fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}><UserCheck size={14} /> Ekip & Atamalar</button>
        <button onClick={() => setActiveTab('puantaj')} style={{ background: activeTab === 'puantaj' ? 'var(--bg-card)' : 'transparent', border: activeTab === 'puantaj' ? '1px solid var(--border-subtle)' : '1px solid transparent', padding: '8px 16px', borderRadius: 8, color: activeTab === 'puantaj' ? '#3b82f6' : 'var(--text-secondary)', fontSize: 13, fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}><CalendarClock size={14} /> Puantaj & Bordro</button>
      </div>

      {/* Summary Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'Toplam Personel', value: personnel.length, icon: UserCheck, color: '#3b82f6' },
          { label: 'Aktif Şantiye', value: activeProjects.length, icon: UserCheck, color: '#818cf8' },
          { label: 'Aylık İşçilik Maliyeti', value: `₺${((totalDailyCost * 26) / 1000).toFixed(0)}K`, icon: Calculator, color: '#fb923c' },
        ].map((item, i) => {
          const ItemIcon = item.icon;
          return (
            <motion.div key={item.label} className="glass-card" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }} style={{ padding: 20, display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: `${item.color}18`, border: `1px solid ${item.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ItemIcon size={20} color={item.color} />
              </div>
              <div>
                <div style={{ fontSize: 24, fontWeight: 700, color: item.color, fontFamily: 'Outfit, sans-serif' }}>{item.value}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{item.label}</div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {activeTab === 'ekip' ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 20 }}>
          {/* Left: Personnel Cards */}
          <div>
            <div style={{ marginBottom: 16 }}>
              <div className="search-wrapper">
                <Search size={14} className="search-icon" />
                <input className="search-input" placeholder="Personel ara..." value={search} onChange={e => setSearch(e.target.value)} />
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxHeight: '60vh', overflowY: 'auto', paddingRight: 8 }}>
              {filteredPersonnel.map(p => (
                <div key={p.id} draggable onDragStart={(e) => handleDragStart(e, p.id)} style={{ cursor: 'grab' }}>
                  <PersonnelCard person={p} />
                </div>
              ))}
              {filteredPersonnel.length === 0 && (
                <div style={{ padding: 20, textAlign: 'center', color: 'var(--text-muted)', fontSize: 13, background: 'var(--glass-bg)', borderRadius: 12 }}>Personel bulunamadı.</div>
              )}
            </div>
          </div>

          {/* Right: Projects Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, alignContent: 'start' }}>
            {activeProjects.map(project => {
              const projectStaff = personnel.filter(p => p.projectId === project.id);
              return (
                <div key={project.id} onDragOver={(e) => { e.preventDefault(); setOverProject(project.id); }} onDragLeave={() => setOverProject(null)} onDrop={(e) => handleDrop(e, project.id)} className="glass-card" style={{ padding: 16, border: overProject === project.id ? '1px dashed #3b82f6' : '1px solid var(--border-subtle)', background: overProject === project.id ? 'rgba(59,130,246,0.05)' : 'var(--bg-card)', transition: 'all 0.2s', minHeight: 200 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <h4 style={{ margin: 0, color: 'var(--text-primary)', fontSize: 14 }}>{project.name}</h4>
                    <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 10, background: 'rgba(59,130,246,0.1)', color: '#3b82f6' }}>{projectStaff.length} Kişi</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {projectStaff.length > 0 ? (
                      projectStaff.map(p => (
                        <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'var(--glass-bg)', borderRadius: 8, border: '1px solid var(--glass-border)' }}>
                          <div>
                            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>{p.name}</div>
                            <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{p.role}</div>
                          </div>
                          <button onClick={() => assignPersonnel(p.id, null)} style={{ background: 'transparent', border: 'none', color: '#f87171', cursor: 'pointer', padding: 4 }} title="Şantiyeden Çıkar"><X size={14} /></button>
                        </div>
                      ))
                    ) : (
                      <div style={{ padding: 20, textAlign: 'center', color: 'var(--text-muted)', fontSize: 12, border: '1px dashed rgba(255,255,255,0.1)', borderRadius: 8 }}>Personeli buraya sürükleyin</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 className="section-title" style={{ margin: 0 }}>Haftalık Şantiye Puantajı (Maslak Rezidans)</h3>
              <button className="btn btn-ghost" style={{ fontSize: 11 }}>Excel Dışa Aktar</button>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table className="erp-table">
                <thead>
                  <tr>
                    <th style={{ width: 200, position: 'sticky', left: 0, background: 'var(--bg-card)', zIndex: 10 }}>Personel</th>
                    <th>Görev</th>
                    {days.map(d => <th key={d} style={{ textAlign: 'center' }}>{d}</th>)}
                    <th style={{ textAlign: 'center', color: '#3b82f6' }}>Toplam</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPersonnel.filter(p => p.projectId === 'prj-001').map(p => {
                    // Mock data for timesheet attendance
                    const attendances = days.map((d, i) => i === 5 ? 'X' : i === 6 ? 'T' : '8.5'); // 8.5 saat, X devamsız, T tatil
                    const totalHours = attendances.reduce((acc, curr) => acc + (parseFloat(curr) || 0), 0);
                    
                    return (
                      <tr key={p.id}>
                        <td style={{ position: 'sticky', left: 0, background: 'var(--bg-card)', zIndex: 10 }}>
                          <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: 13 }}>{p.name}</div>
                        </td>
                        <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{p.role}</td>
                        {attendances.map((att, i) => (
                          <td key={i} style={{ textAlign: 'center' }}>
                            <span style={{ 
                              display: 'inline-block', width: 32, height: 24, lineHeight: '24px', borderRadius: 4, fontSize: 11, fontWeight: 600,
                              background: att === 'X' ? 'rgba(248,113,113,0.1)' : att === 'T' ? 'rgba(251,191,36,0.1)' : 'rgba(52,211,153,0.1)',
                              color: att === 'X' ? '#f87171' : att === 'T' ? '#fbbf24' : '#34d399'
                            }}>
                              {att}
                            </span>
                          </td>
                        ))}
                        <td style={{ textAlign: 'center', fontWeight: 700, color: '#3b82f6', fontSize: 13 }}>{totalHours} Saat</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div style={{ padding: 16, background: 'rgba(255,255,255,0.02)', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn btn-primary">Bordro Tahakkuk (Maaş Hesapla)</button>
            </div>
          </div>
        </motion.div>
      )}

      {/* New Personnel Modal */}
      <AnimatePresence>
        {showModal && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)' }}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 16, width: 450, padding: 24, boxShadow: 'var(--shadow-lg)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h3 style={{ margin: 0, color: 'var(--text-primary)', fontSize: 18, fontFamily: 'Outfit, sans-serif' }}>Yeni Personel Ekle</h3>
                <button onClick={() => setShowModal(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex' }}><X size={20} /></button>
              </div>
              <form onSubmit={handleModalSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6 }}>Ad Soyad</label>
                  <input required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="search-input" style={{ width: '100%', padding: '10px 14px' }} placeholder="Örn: Ahmet Yılmaz" />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6 }}>Ünvan / Rol</label>
                    <input required type="text" value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })} className="search-input" style={{ width: '100%', padding: '10px 14px' }} placeholder="Örn: Şantiye Şefi" />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6 }}>Departman</label>
                    <select value={formData.department} onChange={e => setFormData({ ...formData, department: e.target.value })} className="search-input" style={{ width: '100%', padding: '10px 14px', appearance: 'none' }}>
                      <option value="Saha">Saha Ekibi</option>
                      <option value="Teknik">Teknik Ofis</option>
                      <option value="Yönetim">Yönetim</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6 }}>Günlük Ücret (₺)</label>
                  <input type="number" required value={formData.dailyRate} onChange={e => setFormData({ ...formData, dailyRate: Number(e.target.value) })} className="search-input" style={{ width: '100%', padding: '10px 14px' }} placeholder="1500" />
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 10 }}>
                  <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>İptal</button>
                  <button type="submit" className="btn btn-primary">Kaydet</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* QR Scan Modal */}
        {showQRModal && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)' }}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 16, width: 400, padding: 32, boxShadow: 'var(--shadow-lg)', textAlign: 'center' }}>
              {qrStatus === 'scanning' && (
                <>
                  <div style={{ position: 'relative', width: 200, height: 200, margin: '0 auto 20px', border: '2px solid rgba(52,211,153,0.3)', borderRadius: 16, overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <QrCode size={100} color="rgba(255,255,255,0.1)" />
                    </div>
                    <motion.div animate={{ y: [-100, 200, -100] }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }} style={{ position: 'absolute', left: 0, right: 0, height: 2, background: '#34d399', boxShadow: '0 0 10px #34d399' }} />
                  </div>
                  <h3 style={{ margin: '0 0 10px 0', fontSize: 18, color: 'var(--text-primary)' }}>Kamera Taranıyor...</h3>
                  <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 20 }}>Personel yaka kartını veya QR kodunu gösterin.</p>
                  <button className="btn btn-ghost" onClick={() => setShowQRModal(false)}>İptal Et</button>
                </>
              )}
              {qrStatus === 'success' && (
                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                  <div style={{ width: 80, height: 80, borderRadius: 40, background: 'rgba(52,211,153,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                    <Check size={40} color="#34d399" />
                  </div>
                  <h3 style={{ margin: '0 0 10px 0', fontSize: 20, color: '#34d399' }}>Giriş Başarılı!</h3>
                  <p style={{ fontSize: 14, color: 'var(--text-primary)', fontWeight: 600 }}>Mete K. (Saha Şefi)</p>
                  <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>18 Mayıs 2024 - 08:00</p>
                </motion.div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
