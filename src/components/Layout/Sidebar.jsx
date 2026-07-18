import React, { useState } from 'react';
import {
  LayoutDashboard, FolderKanban, Receipt, Users, Package,
  GitBranch, ChevronLeft, ChevronRight, HardHat,
  Gavel, TrendingDown, BookOpen, CalendarDays, Ruler,
  CheckSquare, FileText, ClipboardCheck, ShieldAlert,
  Home, MessageSquare, Sparkles, Library, ChevronDown, ChevronUp, Calendar, Truck
} from 'lucide-react';
import useERP from '../../store/useERP';
import { motion, AnimatePresence } from 'framer-motion';

const navGroups = [
  {
    id: 'yonetim',
    label: '📊 Yönetim',
    color: '#3b82f6',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'budget', label: 'Bütçe & Maliyet', icon: TrendingDown },
      { id: 'approvals', label: 'Onay Merkezi', icon: CheckSquare },
    ]
  },
  {
    id: 'saha',
    label: '🏗️ Saha & Teknik',
    color: '#fb923c',
    items: [
      { id: 'projects', label: 'Projeler', icon: FolderKanban },
      { id: 'fleet', label: 'Araç & Ekipman', icon: Truck },
      { id: 'schedule', label: 'Süreç & Planlama', icon: Calendar },
      { id: 'sitelog', label: 'Şantiye Günlüğü', icon: CalendarDays },
      { id: 'metraj', label: 'Metraj & Keşif', icon: Ruler },
      { id: 'quality', label: 'Kalite Kontrol', icon: ClipboardCheck },
      { id: 'isg', label: 'İSG', icon: ShieldAlert },
    ]
  },
  {
    id: 'finans',
    label: '💰 Finans & Satınalma',
    color: '#34d399',
    items: [
      { id: 'finance', label: 'Hakediş & İmalat', icon: Receipt },
      { id: 'tender', label: 'e-İhale & Sözleşme', icon: Gavel },
      { id: 'materials', label: 'Satınalma & Stok', icon: Package },
    ]
  },
  {
    id: 'insan',
    label: '👥 İnsan & Veri',
    color: '#818cf8',
    items: [
      { id: 'personnel', label: 'Personel & Bordro', icon: Users },
      { id: 'sales', label: 'Satış Merkezi', icon: Home },
      { id: 'documents', label: 'Dokümanlar', icon: FileText },
      { id: 'messaging', label: 'Mesajlaşma', icon: MessageSquare },
      { id: 'ai', label: 'Saha AI', icon: Sparkles },
      { id: 'library', label: 'Kütüphane', icon: Library },
      { id: 'relations', label: 'İlişki Haritası', icon: GitBranch },
    ]
  },
];

export default function Sidebar() {
  const { activePage, setActivePage, sidebarCollapsed, toggleSidebar, onaylar = [] } = useERP();
  const [collapsedGroups, setCollapsedGroups] = useState({});
  const pendingApprovals = onaylar.filter(o => o.status === 'beklemede').length;

  const toggleGroup = (groupId) => {
    setCollapsedGroups(prev => ({ ...prev, [groupId]: !prev[groupId] }));
  };

  return (
    <motion.aside
      animate={{ width: sidebarCollapsed ? 72 : 240 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      style={{
        position: 'fixed',
        left: 0, top: 0, bottom: 0,
        background: 'var(--bg-sidebar)',
        borderRight: '1px solid var(--border-subtle)',
        backdropFilter: 'blur(24px)',
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Logo */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '18px 14px',
        borderBottom: '1px solid var(--border-subtle)',
        flexShrink: 0,
      }}>
        <div style={{
          width: 38, height: 38, borderRadius: 10,
          background: 'linear-gradient(135deg, #00D4FF, #7B2FFF)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
          boxShadow: '0 0 20px rgba(0, 212, 255, 0.3)',
        }}>
          <HardHat size={18} color="#fff" />
        </div>
        <AnimatePresence>
          {!sidebarCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: 15, color: 'var(--text-primary)', lineHeight: 1.2 }}>
                İnşaat ERP
              </div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 500 }}>Pro v3.0 · 16 Modül</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Nav Groups */}
      <nav style={{ flex: 1, padding: '8px 6px', overflowY: 'auto', overflowX: 'hidden' }}>
        {navGroups.map((group) => (
          <div key={group.id} style={{ marginBottom: 4 }}>
            {/* Group Header */}
            {!sidebarCollapsed && (
              <button
                onClick={() => toggleGroup(group.id)}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  width: '100%', padding: '6px 10px 4px',
                  background: 'transparent', border: 'none', cursor: 'pointer',
                  color: 'var(--text-muted)',
                }}
              >
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.8px', textTransform: 'uppercase' }}>
                  {group.label}
                </span>
                {collapsedGroups[group.id]
                  ? <ChevronDown size={10} />
                  : <ChevronUp size={10} />
                }
              </button>
            )}

            {/* Group Items */}
            <AnimatePresence>
              {(!collapsedGroups[group.id]) && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  style={{ overflow: 'hidden' }}
                >
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = activePage === item.id;
                    return (
                      <motion.button
                        key={item.id}
                        onClick={() => setActivePage(item.id)}
                        whileHover={{ x: 2 }}
                        whileTap={{ scale: 0.98 }}
                        title={sidebarCollapsed ? item.label : ''}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 10,
                          width: '100%', padding: sidebarCollapsed ? '10px' : '9px 10px',
                          borderRadius: 8, border: 'none', cursor: 'pointer',
                          marginBottom: 2,
                          fontFamily: 'Inter, sans-serif', fontSize: 13,
                          fontWeight: isActive ? 600 : 400,
                          color: isActive ? group.color : 'var(--text-secondary)',
                          background: isActive ? `${group.color}12` : 'transparent',
                          transition: 'all 0.15s',
                          position: 'relative',
                          overflow: 'hidden',
                          whiteSpace: 'nowrap',
                          justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                        }}
                        onMouseEnter={e => { if (!isActive) { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.background = 'var(--bg-card-hover)'; } }}
                        onMouseLeave={e => { if (!isActive) { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.background = 'transparent'; } }}
                      >
                        {isActive && (
                          <motion.div
                            layoutId={`activeBar-${group.id}`}
                            style={{
                              position: 'absolute', left: 0, top: 0, bottom: 0,
                              width: 2.5, background: group.color, borderRadius: '0 2px 2px 0',
                            }}
                          />
                        )}
                        <Icon size={15} style={{ flexShrink: 0, opacity: isActive ? 1 : 0.7 }} />
                        <AnimatePresence>
                          {!sidebarCollapsed && (
                            <motion.span
                              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                              style={{ overflow: 'hidden', textOverflow: 'ellipsis', flex: 1 }}
                            >
                              {item.label}
                            </motion.span>
                          )}
                        </AnimatePresence>
                        {item.id === 'approvals' && pendingApprovals > 0 && (
                          <span style={{ background: '#ef4444', color: '#fff', borderRadius: 10, padding: '1px 6px', fontSize: 10, fontWeight: 700, flexShrink: 0 }}>
                            {pendingApprovals}
                          </span>
                        )}
                      </motion.button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Separator */}
            {!sidebarCollapsed && (
              <div style={{ height: 1, background: 'var(--border-subtle)', margin: '4px 0 6px' }} />
            )}
          </div>
        ))}
      </nav>

      {/* Collapse Button */}
      <div style={{ padding: '10px 6px', borderTop: '1px solid var(--border-subtle)' }}>
        <button
          onClick={toggleSidebar}
          style={{
            display: 'flex', alignItems: 'center', gap: 10,
            width: '100%', padding: '8px 10px',
            borderRadius: 8, border: 'none', cursor: 'pointer',
            background: 'transparent', color: 'var(--text-muted)',
            fontSize: 12, fontFamily: 'Inter, sans-serif',
            transition: 'all 0.2s',
            justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
          }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
        >
          {sidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          <AnimatePresence>
            {!sidebarCollapsed && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                Daralt
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.aside>
  );
}
