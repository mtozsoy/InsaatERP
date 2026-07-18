import React, { useState } from 'react';
import { Bell, Search, Settings, ChevronDown } from 'lucide-react';
import useERP from '../../store/useERP';
import { motion } from 'framer-motion';

const pageTitles = {
  dashboard:  { title: 'Dashboard',              subtitle: 'Genel proje durumu ve özet' },
  projects:   { title: 'Projeler',               subtitle: 'Proje yönetimi, Kanban ve takip' },
  finance:    { title: 'Hakediş & Finans',       subtitle: 'Ödeme takibi ve hakediş pipeline' },
  personnel:  { title: 'Personel & Bordro',      subtitle: 'Çalışan yönetimi, atamalar ve puantaj' },
  materials:  { title: 'Satınalma & Stok',       subtitle: 'Depo takibi ve tedarikçi yönetimi' },
  relations:  { title: 'İlişki Haritası',        subtitle: 'Proje-Kaynak bağlantı grafiği' },
  budget:     { title: 'Bütçe & Maliyet',        subtitle: 'Gerçek zamanlı bütçe ve maliyet analizi' },
  tender:     { title: 'e-İhale & Sözleşme',     subtitle: 'Dijital ihale, teklif kıyası ve sözleşme yönetimi' },
  sitelog:    { title: 'Şantiye Günlüğü',        subtitle: 'Mobil saha kayıtları, ekip ve ekipman takibi' },
  metraj:     { title: 'Metraj & Keşif',         subtitle: 'Poz tabanlı keşif, boyut hesaplayıcı ve BoQ export' },
  schedule:   { title: 'Süreç & Planlama',       subtitle: 'Proje zaman çizelgesi ve Gantt görünümü' },
  approvals:  { title: 'Onay Merkezi',           subtitle: 'Hakediş, satınalma ve sözleşme onay akışları' },
  documents:  { title: 'Dokümanlar',             subtitle: 'Proje dosyaları, sözleşmeler ve teknik çizimler' },
  quality:    { title: 'Kalite Kontrol',         subtitle: 'Saha kontrolleri, uygunsuzluk takibi ve kapatma' },
  isg:        { title: 'İSG — İş Sağlığı & Güvenliği', subtitle: 'Kaza/ramak kala kaydı, risk değerlendirmesi ve eğitim' },
  sales:      { title: 'Satış Merkezi',          subtitle: 'Müşteri ilişkileri ve teklif yönetimi' },
  messaging:  { title: 'Mesajlaşma',             subtitle: 'Ekip içi anlık mesajlaşma ve kanal yönetimi' },
  fleet:      { title: 'Araç & Ekipman',         subtitle: 'Filo yönetimi, bakım takibi ve canlı konum' },
  ai:         { title: 'Saha AI Asistanı',       subtitle: 'Yapay zeka destekli saha analizi ve öneriler' },
  library:    { title: 'Kütüphane',              subtitle: 'Teknik dokümanlar, standartlar ve referanslar' },
};

export default function Header() {
  const { activePage, sidebarCollapsed, notifications } = useERP();
  const [searchVal, setSearchVal] = useState('');
  const info = pageTitles[activePage] || pageTitles.dashboard;

  return (
    <motion.header
      animate={{ left: sidebarCollapsed ? 72 : 260 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      style={{
        position: 'fixed',
        top: 0, right: 0,
        height: 'var(--header-height)',
        background: 'var(--bg-header)',
        borderBottom: '1px solid var(--border-subtle)',
        backdropFilter: 'blur(24px)',
        zIndex: 99,
        display: 'flex',
        alignItems: 'center',
        padding: '0 24px',
        gap: 20,
      }}
    >
      {/* Title */}
      <div style={{ flex: 1 }}>
        <motion.div
          key={activePage}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          <h1 style={{
            fontFamily: 'Outfit, sans-serif',
            fontSize: 20,
            fontWeight: 700,
            color: 'var(--text-primary)',
            lineHeight: 1.2,
          }}>{info.title}</h1>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{info.subtitle}</p>
        </motion.div>
      </div>

      {/* Search */}
      <div className="search-wrapper" style={{ width: 260 }}>
        <Search size={14} className="search-icon" />
        <input
          className="search-input"
          placeholder="Ara... (Proje, personel, malzeme)"
          value={searchVal}
          onChange={e => setSearchVal(e.target.value)}
        />
      </div>

      {/* Notifs */}
      <button style={{
        position: 'relative',
        background: 'var(--glass-bg)',
        border: '1px solid var(--glass-border)',
        borderRadius: 10,
        width: 40, height: 40,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer',
        color: 'var(--text-secondary)',
        transition: 'all 0.2s',
      }}
        onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.borderColor = 'var(--border-medium)'; }}
        onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.borderColor = 'var(--glass-border)'; }}
      >
        <Bell size={16} />
        {notifications > 0 && (
          <span style={{
            position: 'absolute', top: 6, right: 6,
            width: 8, height: 8,
            background: '#f87171',
            borderRadius: '50%',
            border: '2px solid var(--bg-primary)',
          }} />
        )}
      </button>

      {/* Settings */}
      <button style={{
        background: 'var(--glass-bg)',
        border: '1px solid var(--glass-border)',
        borderRadius: 10,
        width: 40, height: 40,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer',
        color: 'var(--text-secondary)',
        transition: 'all 0.2s',
      }}
        onMouseEnter={e => { e.currentTarget.style.color = 'white'; e.currentTarget.style.borderColor = 'var(--border-medium)'; }}
        onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.borderColor = 'var(--glass-border)'; }}
      >
        <Settings size={16} />
      </button>

      {/* User */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        background: 'var(--glass-bg)',
        border: '1px solid var(--glass-border)',
        borderRadius: 10,
        padding: '6px 12px',
        cursor: 'pointer',
        transition: 'all 0.2s',
      }}>
        <div style={{
          width: 28, height: 28, borderRadius: '50%',
          background: 'linear-gradient(135deg, #00D4FF, #7B2FFF)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 11, fontWeight: 700, color: 'var(--text-primary)',
        }}>MK</div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Mete K.</div>
          <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Yönetici</div>
        </div>
        <ChevronDown size={12} color="var(--text-muted)" />
      </div>
    </motion.header>
  );
}
