import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, LayoutGrid, List, Filter, X, Edit2 } from 'lucide-react';
import { ProjectCard } from '../components/Cards/Cards';
import useERP from '../store/useERP';

const COLUMNS = [
  { id: 'planlama', label: 'Planlama', color: '#fbbf24' },
  { id: 'devam', label: 'Devam Ediyor', color: '#3b82f6' },
  { id: 'tamamlandı', label: 'Tamamlandı', color: '#34d399' },
];

export default function Projects() {
  const { projects, updateProjectStatus, addProject, updateProject } = useERP();
  const [viewMode, setViewMode] = useState('kanban');
  const [draggingId, setDraggingId] = useState(null);
  const [overColumn, setOverColumn] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [formData, setFormData] = useState({ name: '', konum: '', butce: '', personel: '', status: 'planlama', manager: '', startDate: '', endDate: '', description: '', priority: 'orta' });

  const handleEditClick = (project) => {
    setFormData({
      name: project.name || '',
      konum: project.location || '',
      butce: project.budget || '',
      personel: project.workers || '',
      status: project.status || 'planlama',
      manager: project.manager || '',
      startDate: project.startDate || '',
      endDate: project.endDate || '',
      description: project.description || '',
      priority: project.priority || 'orta'
    });
    setEditingProjectId(project.id);
    setShowModal(true);
  };

  const handleModalSubmit = (e) => {
    e.preventDefault();
    if (formData.name) {
      if (editingProjectId) {
        updateProject(editingProjectId, formData);
      } else {
        addProject(formData);
      }
      setShowModal(false);
      setEditingProjectId(null);
      setFormData({ name: '', konum: '', butce: '', personel: '', status: 'planlama', manager: '', startDate: '', endDate: '', description: '', priority: 'orta' });
    }
  };

  const handleDragStart = (e, projectId) => {
    setDraggingId(projectId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', projectId);
  };

  const handleDragEnd = () => {
    setDraggingId(null);
    setOverColumn(null);
  };

  const handleDragOver = (e, colId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setOverColumn(colId);
  };

  const handleDrop = (e, colId) => {
    e.preventDefault();
    const projectId = e.dataTransfer.getData('text/plain');
    if (projectId) {
      updateProjectStatus(projectId, colId);
    }
    setDraggingId(null);
    setOverColumn(null);
  };

  const getColumnProjects = (colId) =>
    projects.filter(p => p.status === colId);

  const totalBudget = projects.reduce((s, p) => s + p.budget, 0);

  return (
    <div>
      {/* Header Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 className="page-title">Projeler</h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
            {projects.length} proje · Toplam bütçe ₺{(totalBudget / 1000000).toFixed(0)}M
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          {/* View Toggle */}
          <div style={{
            display: 'flex', background: 'var(--glass-bg)',
            border: '1px solid var(--glass-border)', borderRadius: 10, padding: 3,
          }}>
            <button
              onClick={() => setViewMode('kanban')}
              style={{
                padding: '6px 12px', borderRadius: 7, border: 'none', cursor: 'pointer',
                background: viewMode === 'kanban' ? 'rgba(0,212,255,0.15)' : 'transparent',
                color: viewMode === 'kanban' ? 'var(--accent-cyan)' : 'var(--text-muted)',
                fontSize: 13, display: 'flex', alignItems: 'center', gap: 6,
                transition: 'all 0.2s',
              }}
            >
              <LayoutGrid size={14} /> Kanban
            </button>
            <button
              onClick={() => setViewMode('list')}
              style={{
                padding: '6px 12px', borderRadius: 7, border: 'none', cursor: 'pointer',
                background: viewMode === 'list' ? 'rgba(0,212,255,0.15)' : 'transparent',
                color: viewMode === 'list' ? 'var(--accent-cyan)' : 'var(--text-muted)',
                fontSize: 13, display: 'flex', alignItems: 'center', gap: 6,
                transition: 'all 0.2s',
              }}
            >
              <List size={14} /> Liste
            </button>
          </div>
          <button className="btn btn-ghost" style={{ gap: 6 }} onClick={() => alert('Filtreleme özelliği yakında eklenecektir.')}>
            <Filter size={14} /> Filtrele
          </button>
          <button className="btn btn-primary" onClick={() => {
            setEditingProjectId(null);
            setFormData({ name: '', konum: '', butce: '', personel: '', status: 'planlama', manager: '', startDate: '', endDate: '', description: '', priority: 'orta' });
            setShowModal(true);
          }}>
            <Plus size={14} /> Yeni Proje
          </button>
        </div>
      </div>

      {/* KANBAN VIEW */}
      {viewMode === 'kanban' && (
        <div className="kanban-board">
          {COLUMNS.map((col) => {
            const colProjects = getColumnProjects(col.id);
            const isOver = overColumn === col.id;
            return (
              <div
                key={col.id}
                className={`kanban-column`}
                onDragOver={(e) => handleDragOver(e, col.id)}
                onDrop={(e) => handleDrop(e, col.id)}
                style={{
                  borderTop: `2px solid ${col.color}`,
                  transition: 'all 0.2s',
                  background: isOver ? `${col.color}08` : 'var(--glass-bg)',
                  boxShadow: isOver ? `0 0 20px ${col.color}20` : 'none',
                }}
              >
                <div className="kanban-column-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: col.color, boxShadow: `0 0 8px ${col.color}` }} />
                    <span className="kanban-column-title" style={{ color: col.color }}>{col.label}</span>
                  </div>
                  <div style={{
                    background: `${col.color}20`,
                    color: col.color,
                    borderRadius: '9999px',
                    padding: '2px 8px',
                    fontSize: 11,
                    fontWeight: 700,
                  }}>{colProjects.length}</div>
                </div>

                <div className="kanban-cards">
                  <AnimatePresence>
                    {colProjects.map((project, i) => (
                      <ProjectCard
                        key={project.id}
                        project={project}
                        onDragStart={(e) => handleDragStart(e, project.id)}
                        onDragEnd={handleDragEnd}
                        onDragOver={(e) => e.preventDefault()}
                        isDragging={draggingId === project.id}
                        onEdit={handleEditClick}
                      />
                    ))}
                  </AnimatePresence>
                  {colProjects.length === 0 && (
                    <div style={{
                      textAlign: 'center', padding: '30px 0',
                      color: 'var(--text-muted)', fontSize: 12,
                      border: `2px dashed ${col.color}30`,
                      borderRadius: 10,
                    }}>
                      Buraya sürükle
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* LIST VIEW */}
      {viewMode === 'list' && (
        <motion.div
          className="glass-card"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ padding: 0, overflow: 'hidden' }}
        >
          <table className="erp-table" style={{ margin: 0 }}>
            <thead>
              <tr>
                <th>Proje Adı</th>
                <th>Konum</th>
                <th>Durum</th>
                <th>İlerleme</th>
                <th>Bütçe</th>
                <th>Personel</th>
                <th>Öncelik</th>
                <th>İşlem</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project, i) => (
                <motion.tr
                  key={project.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 4, height: 32, borderRadius: 2, background: project.color }} />
                      <div>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: 13 }}>{project.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{project.code}</div>
                      </div>
                    </div>
                  </td>
                  <td>{project.location}</td>
                  <td><span className={`badge badge-${project.status}`}>{project.status}</span></td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 80 }}>
                        <div className="progress-bar" style={{ height: 4 }}>
                          <div className="progress-fill" style={{ width: `${project.progress}%`, background: project.color }} />
                        </div>
                      </div>
                      <span style={{ fontSize: 12, color: project.color, fontWeight: 600 }}>{project.progress}%</span>
                    </div>
                  </td>
                  <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>₺{(project.budget / 1000000).toFixed(0)}M</td>
                  <td>{project.workers > 0 ? `${project.workers} kişi` : '—'}</td>
                  <td><span className={`badge badge-${project.priority}`}>{project.priority}</span></td>
                  <td>
                    <button onClick={() => handleEditClick(project)} className="btn btn-ghost" style={{ padding: 4 }}>
                      <Edit2 size={14} color="var(--text-secondary)" />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}

      {/* New Project Modal */}
      <AnimatePresence>
        {showModal && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)' }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 16, width: 600, padding: 24, boxShadow: 'var(--shadow-lg)' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h3 style={{ margin: 0, color: 'var(--text-primary)', fontSize: 18, fontFamily: 'Outfit, sans-serif' }}>
                  {editingProjectId ? 'Projeyi Düzenle' : 'Yeni Proje Ekle'}
                </h3>
                <button onClick={() => setShowModal(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex' }}><X size={20} /></button>
              </div>

              <form onSubmit={handleModalSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6 }}>Proje Adı</label>
                    <input required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="search-input" style={{ width: '100%', padding: '10px 14px' }} placeholder="Örn: Kuzey Yaka Rezidans" />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6 }}>Proje Yöneticisi</label>
                    <input type="text" value={formData.manager} onChange={e => setFormData({ ...formData, manager: e.target.value })} className="search-input" style={{ width: '100%', padding: '10px 14px' }} placeholder="Ad Soyad" />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6 }}>Açıklama</label>
                  <input type="text" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="search-input" style={{ width: '100%', padding: '10px 14px' }} placeholder="Kısa proje özeti" />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6 }}>Lokasyon</label>
                    <input type="text" value={formData.konum} onChange={e => setFormData({ ...formData, konum: e.target.value })} className="search-input" style={{ width: '100%', padding: '10px 14px' }} placeholder="İl, İlçe" />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6 }}>Bütçe (₺)</label>
                    <input type="number" value={formData.butce} onChange={e => setFormData({ ...formData, butce: e.target.value })} className="search-input" style={{ width: '100%', padding: '10px 14px' }} placeholder="50000000" />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6 }}>Personel Sayısı</label>
                    <input type="number" value={formData.personel} onChange={e => setFormData({ ...formData, personel: e.target.value })} className="search-input" style={{ width: '100%', padding: '10px 14px' }} placeholder="10" />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 16 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6 }}>Başlangıç Durumu</label>
                    <select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })} className="search-input" style={{ width: '100%', padding: '10px 14px', appearance: 'none' }}>
                      <option value="planlama">Planlama</option>
                      <option value="devam">Devam Ediyor</option>
                      <option value="tamamlandı">Tamamlandı</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6 }}>Öncelik</label>
                    <select value={formData.priority} onChange={e => setFormData({ ...formData, priority: e.target.value })} className="search-input" style={{ width: '100%', padding: '10px 14px', appearance: 'none' }}>
                      <option value="yüksek">Yüksek</option>
                      <option value="orta">Orta</option>
                      <option value="düşük">Düşük</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6 }}>Başlangıç Tarihi</label>
                    <input type="date" value={formData.startDate} onChange={e => setFormData({ ...formData, startDate: e.target.value })} className="search-input" style={{ width: '100%', padding: '10px 14px' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6 }}>Hedef Bitiş</label>
                    <input type="date" value={formData.endDate} onChange={e => setFormData({ ...formData, endDate: e.target.value })} className="search-input" style={{ width: '100%', padding: '10px 14px' }} />
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 10 }}>
                  <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>İptal</button>
                  <button type="submit" className="btn btn-primary">{editingProjectId ? 'Güncelle' : 'Projeyi Kaydet'}</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
