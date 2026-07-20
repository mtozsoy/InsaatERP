import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Calendar, Filter, Users, GitBranch, Download, X, ChevronUp, ChevronDown } from 'lucide-react';
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
  const [formData, setFormData] = useState({ name: '', start: '', end: '', assignee: '', progress: 0 });

  // Inline progress editor state
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingProgress, setEditingProgress] = useState(0);

  const projectTasks = tasks.filter(t => t.projectId === selectedProject);
  const filteredTasks = projectTasks.filter(t => t.name.toLowerCase().includes(search.toLowerCase()));

  const handleModalSubmit = (e) => {
    e.preventDefault();
    if (formData.name && formData.start && formData.end) {
      addTask({ ...formData, progress: Number(formData.progress), projectId: selectedProject });
      setShowModal(false);
      setFormData({ name: '', start: '', end: '', assignee: '', progress: 0 });
    }
  };

  const handleBarClick = (task) => {
    setEditingTaskId(task.id);
    setEditingProgress(task.progress);
  };

  const handleProgressSave = (taskId) => {
    updateTask(taskId, { progress: Number(editingProgress) });
    setEditingTaskId(null);
  };

  const months = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];
  const totalDays = 366;

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
            %{projectTasks.length ? Math.round(projectTasks.reduce((s, t) => s + (t.progress || 0), 0) / projectTasks.length) : 0}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Proje İlerlemesi</div>
        </div>
        <div className="glass-card" style={{ padding: 18 }}>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>Gantt çubuğuna tıkla →</div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500 }}>İlerleme yüzdesini güncelle</div>
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
                <div key={task.id} style={{ height: 60, borderBottom: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 16px' }}>
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
              {months.map((m) => (
                <div key={m} style={{ flex: 1, borderRight: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600, color: 'var(--text-muted)' }}>
                  {m}
                </div>
              ))}
            </div>

            {/* Grid Background */}
            <div style={{ position: 'absolute', top: 40, left: 0, right: 0, bottom: 0, display: 'flex', pointerEvents: 'none' }}>
              {months.map((m) => (
                <div key={m} style={{ flex: 1, borderRight: '1px dashed var(--border-subtle)' }} />
              ))}
            </div>

            {/* Task Bars */}
            <div style={{ position: 'relative', paddingTop: 10 }}>
              {filteredTasks.map((task, index) => {
                const startDay = getDayOfYear(task.start);
                const endDay = Math.max(getDayOfYear(task.end), startDay + 1);
                const leftPercent = (startDay / totalDays) * 100;
                const widthPercent = ((endDay - startDay) / totalDays) * 100;
                const isEditing = editingTaskId === task.id;

                return (
                  <div key={task.id} style={{ height: 60, position: 'relative' }}>
                    <motion.div
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: `${widthPercent}%` }}
                      transition={{ duration: 0.5, delay: index * 0.05 }}
                      onClick={() => !isEditing && handleBarClick(task)}
                      style={{
                        position: 'absolute',
                        left: `${leftPercent}%`,
                        top: 10,
                        height: 34,
                        background: `linear-gradient(90deg, ${task.color}90, ${task.color}50)`,
                        border: `1.5px solid ${task.color}`,
                        borderRadius: 8,
                        overflow: 'visible',
                        cursor: 'pointer',
                        boxShadow: isEditing ? `0 0 0 2px ${task.color}60, 0 4px 16px rgba(0,0,0,0.1)` : '0 4px 12px rgba(0,0,0,0.05)',
                        transition: 'box-shadow 0.2s',
                      }}
                    >
                      {/* Progress Fill */}
                      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${task.progress || 0}%`, background: task.color, opacity: 0.35, borderRadius: '6px 0 0 6px', transition: 'width 0.3s' }} />

                      <div style={{ position: 'absolute', left: 8, top: 0, bottom: 0, display: 'flex', alignItems: 'center', fontSize: 11, fontWeight: 700, color: task.color, whiteSpace: 'nowrap', zIndex: 1 }}>
                        %{task.progress || 0}
                      </div>
                    </motion.div>

                    {/* Inline Progress Editor Popup */}
                    <AnimatePresence>
                      {isEditing && (
                        <motion.div
                          initial={{ opacity: 0, y: -8, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -8, scale: 0.95 }}
                          transition={{ duration: 0.15 }}
                          style={{
                            position: 'absolute',
                            left: `calc(${leftPercent}% + 4px)`,
                            top: 48,
                            zIndex: 100,
                            background: '#ffffff',
                            border: `1.5px solid ${task.color}`,
                            borderRadius: 12,
                            padding: '12px 16px',
                            boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
                            minWidth: 240,
                          }}
                          onClick={e => e.stopPropagation()}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                            <span style={{ fontSize: 13, fontWeight: 700, color: task.color }}>{task.name}</span>
                            <button onClick={() => setEditingTaskId(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 2 }}>
                              <X size={14} />
                            </button>
                          </div>

                          {/* Percentage display */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                            <span style={{ fontSize: 28, fontWeight: 800, color: task.color, fontFamily: 'Outfit, sans-serif', minWidth: 60 }}>
                              %{editingProgress}
                            </span>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                              <button
                                onClick={() => setEditingProgress(Math.min(100, Number(editingProgress) + 5))}
                                style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', borderRadius: 4, padding: '2px 6px', cursor: 'pointer', color: 'var(--text-primary)' }}
                              >
                                <ChevronUp size={12} />
                              </button>
                              <button
                                onClick={() => setEditingProgress(Math.max(0, Number(editingProgress) - 5))}
                                style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', borderRadius: 4, padding: '2px 6px', cursor: 'pointer', color: 'var(--text-primary)' }}
                              >
                                <ChevronDown size={12} />
                              </button>
                            </div>
                          </div>

                          {/* Slider */}
                          <input
                            type="range"
                            min={0}
                            max={100}
                            step={5}
                            value={editingProgress}
                            onChange={e => setEditingProgress(e.target.value)}
                            style={{ width: '100%', marginBottom: 10, accentColor: task.color }}
                          />

                          {/* Quick presets */}
                          <div style={{ display: 'flex', gap: 4, marginBottom: 10, flexWrap: 'wrap' }}>
                            {[0, 25, 50, 75, 100].map(v => (
                              <button
                                key={v}
                                onClick={() => setEditingProgress(v)}
                                style={{
                                  padding: '3px 8px', borderRadius: 6, border: `1px solid ${Number(editingProgress) === v ? task.color : 'var(--border-subtle)'}`,
                                  background: Number(editingProgress) === v ? `${task.color}15` : 'transparent',
                                  color: Number(editingProgress) === v ? task.color : 'var(--text-secondary)',
                                  fontSize: 11, fontWeight: 600, cursor: 'pointer'
                                }}
                              >
                                %{v}
                              </button>
                            ))}
                          </div>

                          <button
                            onClick={() => handleProgressSave(task.id)}
                            style={{ width: '100%', padding: '8px', borderRadius: 8, border: 'none', background: task.color, color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}
                          >
                            Kaydet
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Add Task Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(5px)' }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="glass-card"
            style={{ width: 440, padding: 28, position: 'relative' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>Yeni Görev (Süreç) Ekle</h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleModalSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, marginBottom: 6, color: 'var(--text-secondary)', fontWeight: 600 }}>Görev Adı</label>
                <input required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="search-input" style={{ width: '100%', padding: '10px 14px' }} placeholder="Örn: Zemin Etüdü" />
              </div>
              <div style={{ display: 'flex', gap: 16 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: 12, marginBottom: 6, color: 'var(--text-secondary)', fontWeight: 600 }}>Başlangıç</label>
                  <input type="date" required value={formData.start} onChange={e => setFormData({ ...formData, start: e.target.value })} className="search-input" style={{ width: '100%', padding: '10px 14px' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: 12, marginBottom: 6, color: 'var(--text-secondary)', fontWeight: 600 }}>Bitiş</label>
                  <input type="date" required value={formData.end} onChange={e => setFormData({ ...formData, end: e.target.value })} className="search-input" style={{ width: '100%', padding: '10px 14px' }} />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, marginBottom: 6, color: 'var(--text-secondary)', fontWeight: 600 }}>Atanan Personel</label>
                <select value={formData.assignee} onChange={e => setFormData({ ...formData, assignee: e.target.value })} className="search-input" style={{ width: '100%', padding: '10px 14px' }}>
                  <option value="">Seçiniz...</option>
                  {personnel.map(p => <option key={p.id} value={p.id}>{p.name} ({p.role})</option>)}
                </select>
              </div>

              {/* Progress Slider */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <label style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 600 }}>Başlangıç İlerlemesi</label>
                  <span style={{ fontSize: 20, fontWeight: 800, color: '#3b82f6', fontFamily: 'Outfit, sans-serif' }}>%{formData.progress}</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={5}
                  value={formData.progress}
                  onChange={e => setFormData({ ...formData, progress: e.target.value })}
                  style={{ width: '100%', accentColor: '#3b82f6' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--text-muted)', marginTop: 4 }}>
                  <span>%0</span>
                  <span>%25</span>
                  <span>%50</span>
                  <span>%75</span>
                  <span>%100</span>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 4 }}>
                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>İptal</button>
                <button type="submit" className="btn btn-primary">Kaydet</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
