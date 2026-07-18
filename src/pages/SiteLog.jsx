import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cloud, Sun, CloudRain, CloudSnow, Users, Wrench, Camera, AlertTriangle, Plus, ChevronLeft, ChevronRight, X, MapPin, Upload, Loader } from 'lucide-react';
import useERP from '../store/useERP';

const weatherIcons = { 'Güneşli': Sun, 'Bulutlu': Cloud, 'Yağmurlu': CloudRain, 'Kapalı': CloudSnow };
const weatherColors = { 'Güneşli': '#fbbf24', 'Bulutlu': '#aaa', 'Yağmurlu': '#3b82f6', 'Kapalı': '#818cf8' };

const days = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
const calendar = Array.from({ length: 31 }, (_, i) => i + 1);

export default function SiteLog() {
  const { projects, santiyeGunlukleri, addSantiyeGunlugu, updateSantiyeGunlugu } = useERP();
  const [selectedDay, setSelectedDay] = useState(18);
  const [selectedProject, setSelectedProject] = useState('prj-001');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ date: new Date().toISOString(), weather: 'Güneşli', workers: '', notes: '', sorunlar: '', gps: null, photos: [] });
  const [isLocating, setIsLocating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleGetLocation = () => {
    setIsLocating(true);
    setTimeout(() => {
      setFormData(prev => ({ ...prev, gps: '41.1129° N, 29.0210° E (Saha)' }));
      setIsLocating(false);
    }, 1500);
  };

  const handleUploadPhoto = () => {
    setIsUploading(true);
    setTimeout(() => {
      setFormData(prev => ({ ...prev, photos: [...prev.photos, 'saha_foto_' + prev.photos.length + '.jpg'] }));
      setIsUploading(false);
    }, 1500);
  };

  const projectLogs = santiyeGunlukleri.filter(g => g.projectId === selectedProject);
  const selectedLog = projectLogs.find(g => new Date(g.tarih).getDate() === selectedDay);
  const logDays = new Set(projectLogs.map(g => new Date(g.tarih).getDate()));

  const handleOpenModal = () => {
    if (selectedLog) {
      setFormData({
        date: selectedLog.tarih,
        weather: selectedLog.havaDurumu,
        workers: selectedLog.personelSayisi,
        notes: selectedLog.yapılanIsler.join('\n') || '',
        sorunlar: selectedLog.sorunlar ? selectedLog.sorunlar.join('\n') : '',
        gps: selectedLog.gps || null,
        photos: selectedLog.photos || []
      });
    } else {
      setFormData({ date: new Date().toISOString(), weather: 'Güneşli', workers: '', notes: '', sorunlar: '', gps: null, photos: [] });
    }
    setShowModal(true);
  };

  const handleModalSubmit = (e) => {
    e.preventDefault();
    if (formData.weather) {
      const customDate = new Date();
      customDate.setDate(selectedDay);
      
      if (selectedLog) {
        updateSantiyeGunlugu(selectedLog.id, { ...formData, date: customDate.toISOString() });
      } else {
        addSantiyeGunlugu({ ...formData, date: customDate.toISOString() });
      }
      
      setShowModal(false);
      setFormData({ date: new Date().toISOString(), weather: 'Güneşli', workers: '', notes: '', sorunlar: '' });
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 className="page-title">Şantiye Günlüğü</h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>Mobil saha kayıtları, ekip ve ekipman takibi</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <select value={selectedProject} onChange={e => setSelectedProject(e.target.value)} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 10, padding: '9px 14px', color: 'var(--text-primary)', fontSize: 13, fontFamily: 'Inter, sans-serif', outline: 'none' }}>
            {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <button className="btn btn-primary" onClick={handleOpenModal}>
            <Plus size={14} /> Günlük Ekle
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 20 }}>
        {/* Calendar */}
        <div className="glass-card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <button onClick={() => setSelectedDay(d => Math.max(1, d - 1))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}><ChevronLeft size={16} /></button>
            <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif' }}>Ekim 2024</span>
            <button onClick={() => setSelectedDay(d => Math.min(31, d + 1))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}><ChevronRight size={16} /></button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2, marginBottom: 8 }}>
            {days.map(d => <div key={d} style={{ textAlign: 'center', fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', padding: '4px 0' }}>{d}</div>)}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2 }}>
            {/* Offset for December 2024 (Sunday=0, start on Sunday) */}
            {Array.from({ length: 0 }).map((_, i) => <div key={`e-${i}`} />)}
            {calendar.map(day => {
              const hasLog = logDays.has(day);
              const isSelected = day === selectedDay;
              return (
                <button key={day} onClick={() => setSelectedDay(day)} style={{
                  aspectRatio: '1', borderRadius: 7, border: 'none', cursor: 'pointer',
                  fontSize: 12, fontWeight: isSelected ? 700 : 400,
                  background: isSelected ? '#3b82f6' : hasLog ? 'rgba(59,130,246,0.12)' : 'transparent',
                  color: isSelected ? '#ffffff' : hasLog ? '#3b82f6' : 'var(--text-secondary)',
                  position: 'relative', transition: 'all 0.15s',
                }}>
                  {day}
                  {hasLog && !isSelected && <div style={{ position: 'absolute', bottom: 3, left: '50%', transform: 'translateX(-50%)', width: 4, height: 4, borderRadius: '50%', background: '#3b82f6' }} />}
                </button>
              );
            })}
          </div>

          {/* Project summary */}
          <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>AYLIK ÖZET</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Toplam Kayıt</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#3b82f6' }}>{projectLogs.length} gün</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Ort. Personel</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#818cf8' }}>
                {Math.round(projectLogs.reduce((s, g) => s + g.personelSayisi, 0) / (projectLogs.length || 1))}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Toplam Fotoğraf</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#fb923c' }}>
                {projectLogs.reduce((s, g) => s + g.fotografSayisi, 0)}
              </span>
            </div>
          </div>
        </div>

        {/* Log Detail */}
        <div>
          {selectedLog ? (
            <motion.div key={selectedLog.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              {/* Header */}
              <div className="glass-card" style={{ padding: 20, marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
                      {new Date(selectedLog.tarih).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Oluşturan: {selectedLog.olusturan}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    {(() => {
                      const WeatherIcon = weatherIcons[selectedLog.havaDurumu] || Sun;
                      const wColor = weatherColors[selectedLog.havaDurumu] || '#fbbf24';
                      return (
                        <div style={{ textAlign: 'center' }}>
                          <WeatherIcon size={28} color={wColor} />
                          <div style={{ fontSize: 11, color: wColor, marginTop: 2 }}>{selectedLog.havaDurumu}</div>
                          <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>{selectedLog.sicaklik}°C</div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
                {/* Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginTop: 16 }}>
                  {[
                    { label: 'Personel', val: selectedLog.personelSayisi, color: '#818cf8', icon: Users },
                    { label: 'Ekipman', val: selectedLog.ekipmanSayisi, color: '#fb923c', icon: Wrench },
                    { label: 'Fotoğraf', val: selectedLog.fotografSayisi, color: '#34d399', icon: Camera },
                    { label: 'Sorun', val: selectedLog.sorunlar.length, color: selectedLog.sorunlar.length > 0 ? '#f87171' : '#34d399', icon: AlertTriangle },
                  ].map((item) => {
                    const ItemIcon = item.icon;
                    return (
                      <div key={item.label} style={{ background: 'var(--glass-bg)', borderRadius: 10, padding: '12px', textAlign: 'center', border: `1px solid ${item.color}20` }}>
                        <ItemIcon size={16} color={item.color} style={{ marginBottom: 6 }} />
                        <div style={{ fontSize: 22, fontWeight: 700, color: item.color, fontFamily: 'Outfit, sans-serif' }}>{item.val}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{item.label}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* İşler & Sorunlar */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="glass-card" style={{ padding: 16 }}>
                  <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 12 }}>✅ Yapılan İşler</h3>
                  {selectedLog.yapılanIsler.map((is, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }} style={{ display: 'flex', gap: 10, marginBottom: 10, paddingBottom: 10, borderBottom: i < selectedLog.yapılanIsler.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#34d399', marginTop: 6, flexShrink: 0 }} />
                      <span style={{ fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.5 }}>{is}</span>
                    </motion.div>
                  ))}
                </div>
                <div className="glass-card" style={{ padding: 16 }}>
                  <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 12 }}>⚠️ Sorunlar & Notlar</h3>
                  {selectedLog.sorunlar.length > 0 ? selectedLog.sorunlar.map((sorun, i) => (
                    <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 10, padding: '10px 12px', background: 'rgba(255,77,109,0.08)', border: '1px solid rgba(255,77,109,0.2)', borderRadius: 8 }}>
                      <AlertTriangle size={14} color="#f87171" style={{ flexShrink: 0, marginTop: 2 }} />
                      <span style={{ fontSize: 13, color: '#b91c1c', lineHeight: 1.5, fontWeight: 500 }}>{sorun}</span>
                    </div>
                  )) : (
                    <div style={{ textAlign: 'center', padding: '20px 0', color: '#34d399', fontSize: 13 }}>✓ Sorun bildirilmedi</div>
                  )}
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="glass-card" style={{ padding: 40, textAlign: 'center' }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>📋</div>
              <div style={{ fontSize: 15, color: 'var(--text-secondary)' }}>Bu gün için günlük kaydı yok</div>
              <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={handleOpenModal}>
                <Plus size={14} /> Günlük Oluştur
              </button>
            </div>
          )}
        </div>
      </div>

      {/* New SiteLog Modal */}
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
                <h3 style={{ margin: 0, color: 'var(--text-primary)', fontSize: 18, fontFamily: 'Outfit, sans-serif' }}>
                  {selectedLog ? 'Şantiye Günlüğünü Düzenle' : 'Yeni Şantiye Günlüğü'}
                </h3>
                <button onClick={() => setShowModal(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex' }}><X size={20} /></button>
              </div>

              <form onSubmit={handleModalSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6 }}>Hava Durumu</label>
                    <select value={formData.weather} onChange={e => setFormData({ ...formData, weather: e.target.value })} className="search-input" style={{ width: '100%', padding: '10px 14px', appearance: 'none' }}>
                      <option value="Güneşli">Güneşli</option>
                      <option value="Bulutlu">Bulutlu</option>
                      <option value="Yağmurlu">Yağmurlu</option>
                      <option value="Kapalı">Kapalı</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6 }}>Personel Sayısı</label>
                    <input type="number" value={formData.workers} onChange={e => setFormData({ ...formData, workers: e.target.value })} className="search-input" style={{ width: '100%', padding: '10px 14px' }} placeholder="Örn: 24" />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6 }}>Yapılan İşler & Notlar</label>
                  <textarea value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })} className="search-input" style={{ width: '100%', padding: '10px 14px', minHeight: 80, resize: 'vertical' }} placeholder="Alt alta işleri yazabilirsiniz..."></textarea>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6 }}>Sorunlar & Eksikler</label>
                  <textarea value={formData.sorunlar} onChange={e => setFormData({ ...formData, sorunlar: e.target.value })} className="search-input" style={{ width: '100%', padding: '10px 14px', minHeight: 60, resize: 'vertical' }} placeholder="Varsa problemleri alt alta yazın..."></textarea>
                </div>
                
                {/* OHS & Media Features */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 4 }}>
                  <button type="button" onClick={handleGetLocation} className="btn btn-ghost" style={{ justifyContent: 'center', background: formData.gps ? 'rgba(52,211,153,0.1)' : 'var(--glass-bg)', color: formData.gps ? '#34d399' : 'var(--text-primary)', border: formData.gps ? '1px solid rgba(52,211,153,0.3)' : '1px solid var(--border-subtle)' }}>
                    {isLocating ? <Loader size={16} className="spin" /> : <MapPin size={16} />}
                    {formData.gps ? 'Konum Eklendi' : 'Konum Al'}
                  </button>
                  <button type="button" onClick={handleUploadPhoto} className="btn btn-ghost" style={{ justifyContent: 'center', background: formData.photos.length > 0 ? 'rgba(59,130,246,0.1)' : 'var(--glass-bg)', color: formData.photos.length > 0 ? '#3b82f6' : 'var(--text-primary)', border: formData.photos.length > 0 ? '1px solid rgba(59,130,246,0.3)' : '1px solid var(--border-subtle)' }}>
                    {isUploading ? <Loader size={16} className="spin" /> : <Upload size={16} />}
                    {formData.photos.length > 0 ? `${formData.photos.length} Fotoğraf Yüklendi` : 'Fotoğraf Yükle'}
                  </button>
                </div>
                {(formData.gps || formData.photos.length > 0) && (
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', background: 'rgba(0,0,0,0.2)', padding: 10, borderRadius: 8 }}>
                    {formData.gps && <div style={{ marginBottom: 4 }}>📍 {formData.gps}</div>}
                    {formData.photos.length > 0 && <div>📸 {formData.photos.join(', ')}</div>}
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 10 }}>
                  <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>İptal</button>
                  <button type="submit" className="btn btn-primary">{selectedLog ? 'Güncelle' : 'Kaydet'}</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
