import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Edit2 } from 'lucide-react';

export function KPICard({ icon: Icon, label, value, sub, trend, trendVal, color = '#3b82f6', delay = 0 }) {
  const isPositive = trend === 'up';

  return (
    <motion.div
      className="glass-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      style={{
        padding: 20,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Glow bg */}
      <div style={{
        position: 'absolute', top: -20, right: -20,
        width: 80, height: 80, borderRadius: '50%',
        background: color,
        opacity: 0.06,
        filter: 'blur(30px)',
        pointerEvents: 'none',
      }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <div style={{
          width: 40, height: 40, borderRadius: 10,
          background: `${color}18`,
          border: `1px solid ${color}30`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon size={18} color={color} />
        </div>

        {trendVal && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 4,
            fontSize: 12, fontWeight: 600,
            color: isPositive ? 'var(--status-success)' : 'var(--status-danger)',
          }}>
            {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {trendVal}
          </div>
        )}
      </div>

      <div className="stat-number" style={{ color, marginBottom: 4 }}>{value}</div>
      <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 4 }}>{label}</div>
      {sub && <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{sub}</div>}
    </motion.div>
  );
}

export function ProjectCard({ project, onDragStart, onDragEnd, onDragOver, onDrop, isDragging, isOver, onEdit }) {
  const progressColor = project.progress >= 80 ? '#34d399' : project.progress >= 50 ? '#3b82f6' : '#fb923c';

  return (
    <motion.div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      onDrop={onDrop}
      className={`draggable-card ${isDragging ? 'dragging' : ''} ${isOver ? 'over' : ''}`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      style={{
        borderLeft: `3px solid ${project.color}`,
        position: 'relative',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 3, letterSpacing: '-0.2px' }}>
            {project.name}
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 500 }}>{project.code}</div>
        </div>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          {onEdit && (
            <button onClick={() => onEdit(project)} className="btn btn-ghost" style={{ padding: 4 }}>
              <Edit2 size={12} color="var(--text-secondary)" />
            </button>
          )}
          <span className={`badge badge-${project.status}`}>{project.status}</span>
        </div>
      </div>

      <div style={{ marginBottom: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>İlerleme</span>
          <span style={{ fontSize: 11, fontWeight: 600, color: progressColor }}>{project.progress}%</span>
        </div>
        <div className="progress-bar">
          <motion.div
            className="progress-fill"
            initial={{ width: 0 }}
            animate={{ width: `${project.progress}%` }}
            transition={{ delay: 0.3, duration: 0.8 }}
            style={{ background: `linear-gradient(90deg, ${project.color}, ${progressColor})` }}
          />
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 4,
          fontSize: 11, fontWeight: 500,
          color: 'var(--text-primary)',
          background: 'var(--glass-bg)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 6, padding: '3px 8px',
        }}>👷 {project.workers > 0 ? `${project.workers} kişi` : 'Atanmadı'}</span>
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 4,
          fontSize: 11, fontWeight: 500,
          color: 'var(--text-primary)',
          background: 'var(--glass-bg)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 6, padding: '3px 8px',
        }}>📍 {project.location.split(',')[0]}</span>
        
        {project.manager && project.manager !== 'Atanmadı' && (
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            fontSize: 11, fontWeight: 500,
            color: 'var(--text-primary)',
            background: 'var(--glass-bg)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 6, padding: '3px 8px',
          }}>👤 {project.manager}</span>
        )}

        {project.endDate && (
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            fontSize: 11, fontWeight: 500,
            color: 'var(--text-primary)',
            background: 'var(--glass-bg)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 6, padding: '3px 8px',
          }}>📅 {project.endDate}</span>
        )}
        <span className={`badge badge-${project.priority}`} style={{ marginLeft: 'auto' }}>{project.priority}</span>
      </div>
    </motion.div>
  );
}

export function HakedisCard({ hakedis }) {
  const statusColors = {
    ödendi: '#34d399',
    beklemede: '#fb923c',
    'onay-bekliyor': '#fbbf24',
  };
  const color = statusColors[hakedis.status] || '#3b82f6';

  return (
    <div className="draggable-card" draggable style={{ borderTop: `2px solid ${color}` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{hakedis.title}</div>
        <span className={`badge badge-${hakedis.status}`}>{hakedis.status}</span>
      </div>
      <div style={{
        fontSize: 22, fontWeight: 700, color,
        fontFamily: 'Outfit, sans-serif',
        marginBottom: 6,
      }}>
        ₺{((Number(hakedis.amount) || Number(hakedis.tutar) || 0) / 1000000).toFixed(2)}M
      </div>
      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
        {hakedis.invoiceNo} · {new Date(hakedis.date).toLocaleDateString('tr-TR')}
      </div>
    </div>
  );
}

export function PersonnelCard({ person }) {
  const colors = ['#3b82f6', '#818cf8', '#fb923c', '#34d399', '#fbbf24'];
  const color = colors[person.id.charCodeAt(4) % colors.length];

  return (
    <div className="draggable-card" draggable style={{ background: 'var(--bg-card)' }}>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 10 }}>
        <div className="avatar" style={{ background: `${color}20`, color, border: `1px solid ${color}40` }}>
          {person.avatar}
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{person.name}</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{person.role}</div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
        {(person.skills || []).slice(0, 2).map(s => (
          <span key={s} style={{
            fontSize: 10, padding: '2px 6px', borderRadius: 4,
            background: 'var(--glass-bg)', color: 'var(--text-secondary)',
          }}>{s}</span>
        ))}
      </div>
      <div style={{ marginTop: 8, fontSize: 11, color: 'var(--text-muted)' }}>
        ₺{person.dailyRate.toLocaleString('tr-TR')}/gün
      </div>
    </div>
  );
}

export function MaterialCard({ material }) {
  const ratio = material.stock / material.minStock;
  const stockColor = ratio <= 1 ? '#f87171' : ratio <= 2 ? '#fbbf24' : '#34d399';

  return (
    <div className="draggable-card" draggable style={{ borderLeft: `3px solid ${stockColor}` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>
            {material.name}
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{material.supplier}</div>
        </div>
        {ratio <= 1 && (
          <span className="badge badge-kritik animate-pulse-glow">Kritik</span>
        )}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span style={{ fontSize: 20, fontWeight: 700, color: stockColor, fontFamily: 'Outfit, sans-serif' }}>
            {material.stock.toLocaleString('tr-TR')}
          </span>
          <span style={{ fontSize: 12, color: 'var(--text-muted)', marginLeft: 4 }}>{material.unit}</span>
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
          Min: {material.minStock.toLocaleString('tr-TR')}
        </div>
      </div>
      <div style={{ marginTop: 8 }}>
        <div className="progress-bar" style={{ height: 4 }}>
          <div className="progress-fill" style={{
            width: `${Math.min(100, (material.stock / (material.minStock * 3)) * 100)}%`,
            background: stockColor,
          }} />
        </div>
      </div>
    </div>
  );
}
