import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Calendar, Filter, Users, GitBranch, Download } from 'lucide-react';
import useERP from '../store/useERP';

const getDayOfYear = (dateString) => {
  const date = new Date(dateString);
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = (date - start) + ((start.getTimezoneOffset() - date.getTimezoneOffset()) * 60 * 1000);
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
};

export default function Schedule() {
  const { tasks, projects, personnel, addTask, updateTask } = useERP();
  const [selectedProject, setSelectedProject] = useState('prj-001');
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', start: '', end: '', assignee: '' });

  const projectTasks = tasks.filter(t => t.projectId === selectedProject);
  const filteredTasks = projectTasks.filter(t => t.name.toLowerCase().includes(search.toLowerCase()));

  const handleModalSubmit = (e) => {
    e.preventDefault();
    if (formData.name && formData.start && formData.end) {
      addTask({ ...formData, projectId: selectedProject });
      setShowModal(false);
      setFormData({ name: '', start: '', end: '', assignee: '' });
    }
  };

  const months = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];
  const totalDays = 366; // 2024 is a leap year

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 className="page-title">Süreç & Planlama (Gantt)</h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>Projelerin zaman çizelgeleri ve süreç yönetimi</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <select value={selectedProject} onChange={e => setSelectedProject(e.target.value)} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 10, padding: '9px 14px', color: 'var(--text-primary)', fontSize: 13, fontFamily: 'Inter, sans-serif', outline: 'none' }}>
            {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={14} /> Yeni Görev Ekle
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        <div className="glass-card" style={{ padding: 18 }}>
          <Calendar size={16} color="#3b82f6" style={{ marginBottom: 8 }} />
          <div style={{ fontSize: 26, fontWeight: 700, color: '#3b82f6', fontFamily: 'Outfit, sans-serif' }}>{projectTasks.length}</div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Toplam Görev</div>
        </div>
        <div className="glass-card" style={{ padding: 18 }}>
          <GitBranch size={16} color="#34d399" style={{ marginBottom: 8 }} />
          <div style={{ fontSize: 26, fontWeight: 700, color: '#34d399', fontFamily: 'Outfit, sans-serif' }}>{projectTasks.filter(t => t.status === 'tamamlandı').length}</div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Tamamlanan Görevler</div>
        </div>
        <div className="glass-card" style={{ padding: 18 }}>
          <div style={{ fontSize: 26, fontWeight: 700, color: '#f59e0b', fontFamily: 'Outfit, sans-serif' }}>
            %{projectTasks.length ? Math.round(projectTasks.reduce((s, t) => s + t.progress, 0) / projectTasks.length) : 0}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Proje İlerlemesi</div>
        </div>
      </div>

      <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: 16, borderBottom: '1px solid var(--border-subtle)', display: 'flex', gap: 16 }}>
          <div className="search-wrapper" style={{ flex: 1, maxWidth: 300 }}>
            <Search size={14} className="search-icon" />
            <input className="search-input" placeholder="Görev ara..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <button className="btn btn-ghost"><Filter size={14} /> Filtrele</button>
          <button className="btn btn-ghost"><Download size={14} /> Dışa Aktar</button>
        </div>

        {/* Gantt Chart Container */}
        <div style={{ display: 'flex', overflowX: 'auto', minHeight: 400 }}>
          {/* Left Column (Task Names) */}
          <div style={{ width: 300, flexShrink: 0, borderRight: '1px solid var(--border-subtle)', background: 'var(--bg-card)' }}>
            <div style={{ height: 40, borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', padding: '0 16px', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Görev ve Sorumlu
            </div>
            {filteredTasks.map(task => {
              const person = personnel.find(p => p.id === task.assignee);
              return (
                <div key={task.id} style={{ height: 50, borderBottom: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 16px' }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{task.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Users size={10} /> {person ? person.name : 'Atanmadı'}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column (Timeline) */}
          <div style={{ flex: 1, minWidth: 800, position: 'relative' }}>
            {/* Months Header */}
            <div style={{ height: 40, borderBottom: '1px solid var(--border-subtle)', display: 'flex', background: 'rgba(255,255,255,0.01)' }}>
              {months.map((m, i) => (
                <div key={m} style={{ flex: 1, borderRight: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600, color: 'var(--text-muted)' }}>
                  {m}
                </div>
              ))}
            </div>

            {/* Grid Background */}
            <div style={{ position: 'absolute', top: 40, left: 0, right: 0, bottom: 0, display: 'flex', pointerEvents: 'none' }}>
              {months.map((m, i) => (
                <div key={m} style={{ flex: 1, borderRight: '1px dashed var(--border-subtle)' }} />
              ))}
            </div>

            {/* Task Bars */}
            <div style={{ position: 'relative', paddingTop: 10 }}>
              {filteredTasks.map((task, index) => {
                const startDay = getDayOfYear(task.start);
                const endDay = Math.max(getDayOfYear(task.end), startDay + 1); // Minimum 1 day width
                const leftPercent = (startDay / totalDays) * 100;
                const widthPercent = ((endDay - startDay) / totalDays) * 100;

                return (
                  <div key={task.id} style={{ height: 50, position: 'relative' }}>
                    <motion.div
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: `${widthPercent}%` }}
                      transition={{ duration: 0.5, delay: index * 0.05 }}
                      style={{
                        position: 'absolute',
                        left: `${leftPercent}%`,
                        top: 10,
                        height: 28,
                        background: `linear-gradient(90deg, ${task.color}80, ${task.color}40)`,
                        border: `1px solid ${task.color}`,
                        borderRadius: 6,
                        overflow: 'hidden',
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                      }}
                    >
                      {/* Progress Fill */}
                      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${task.progress}%`, background: task.color, opacity: 0.3 }} />
                      
                      <div style={{ position: 'absolute', left: 8, top: 0, bottom: 0, display: 'flex', alignItems: 'center', fontSize: 11, fontWeight: 600, color: task.color, whiteSpace: 'nowrap' }}>
                        {task.progress}%
                      </div>
                    </motion.div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)' }}>
          <div className="glass-card" style={{ width: 400, padding: 24, position: 'relative' }}>
            <h3 style={{ marginTop: 0, marginBottom: 20 }}>Yeni Görev (Süreç) Ekle</h3>
            <form onSubmit={handleModalSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, marginBottom: 6, color: 'var(--text-secondary)' }}>Görev Adı</label>
                <input required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="search-input" style={{ width: '100%', padding: '10px 14px' }} />
              </div>
              <div style={{ display: 'flex', gap: 16 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: 12, marginBottom: 6, color: 'var(--text-secondary)' }}>Başlangıç</label>
                  <input type="date" required value={formData.start} onChange={e => setFormData({ ...formData, start: e.target.value })} className="search-input" style={{ width: '100%', padding: '10px 14px' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: 12, marginBottom: 6, color: 'var(--text-secondary)' }}>Bitiş</label>
                  <input type="date" required value={formData.end} onChange={e => setFormData({ ...formData, end: e.target.value })} className="search-input" style={{ width: '100%', padding: '10px 14px' }} />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, marginBottom: 6, color: 'var(--text-secondary)' }}>Atanan Personel</label>
                <select value={formData.assignee} onChange={e => setFormData({ ...formData, assignee: e.target.value })} className="search-input" style={{ width: '100%', padding: '10px 14px' }}>
                  <option value="">Seçiniz...</option>
                  {personnel.map(p => <option key={p.id} value={p.id}>{p.name} ({p.role})</option>)}
                </select>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10 }}>
                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>İptal</button>
                <button type="submit" className="btn btn-primary">Kaydet</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
