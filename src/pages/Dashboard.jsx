import React, { useEffect, useState } from 'react';
import {
  AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FolderKanban, TrendingUp, Users, Package,
  Receipt, AlertTriangle, Activity, Clock,
  GripHorizontal, X, Plus, LayoutDashboard,
  Box, Truck, ClipboardList, CheckCircle
} from 'lucide-react';
import { KPICard } from '../components/Cards/Cards';
import useERP from '../store/useERP';
import { monthlyProgress, budgetBreakdown } from '../data/mockData';

// DND Kit
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, rectSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: '#ffffff',
        border: '1px solid var(--border-medium)',
        borderRadius: 8,
        padding: '12px 16px',
        fontSize: 14,
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        color: 'var(--text-primary)'
      }}>
        <div style={{ fontWeight: 700, marginBottom: 8, fontSize: 14 }}>{label}</div>
        {payload.map((p, i) => (
          <div key={i} style={{ color: p.color, marginBottom: 4, fontWeight: 500 }}>
            {p.name}: <strong>{p.value}</strong>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

// Sortable Widget Wrapper
const SortableWidget = ({ id, children, onRemove }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    position: 'relative',
    zIndex: isDragging ? 10 : 1,
    height: '100%'
  };

  return (
    <div ref={setNodeRef} style={style} className="widget-wrapper">
      <div style={{ 
        position: 'absolute', top: 8, right: 8, zIndex: 20, 
        display: 'flex', gap: 4, background: 'var(--bg-secondary)', 
        borderRadius: 8, padding: 2, boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
        border: '1px solid var(--border-subtle)'
      }}>
        <button {...attributes} {...listeners} style={{ background: 'transparent', border: 'none', cursor: 'grab', padding: 4, color: 'var(--text-muted)' }}>
          <GripHorizontal size={14} />
        </button>
        <button onClick={() => onRemove(id)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 4, color: 'var(--status-danger)' }}>
          <X size={14} />
        </button>
      </div>
      {children}
    </div>
  );
};

export default function Dashboard() {
  const { kpiData, projects, activities, dashboardLayout, setDashboardLayout, materials = [], fleetList = [], tasks = [], onaylar = [] } = useERP();
  const [counts, setCounts] = useState({ projects: 0, budget: 0, workers: 0, safety: 0 });
  const [showWidgetMenu, setShowWidgetMenu] = useState(false);

  // Available Widgets Registry
  const ALL_WIDGETS = [
    { id: 'kpi-projects', type: 'kpi', title: 'Toplam Proje KPI' },
    { id: 'kpi-budget', type: 'kpi', title: 'Toplam Bütçe KPI' },
    { id: 'kpi-workers', type: 'kpi', title: 'Aktif Personel KPI' },
    { id: 'kpi-hakedis', type: 'kpi', title: 'Bekleyen Hakediş KPI' },
    { id: 'kpi-safety', type: 'kpi', title: 'Güvenlik Skoru KPI' },
    { id: 'kpi-time', type: 'kpi', title: 'Zamanında Teslim KPI' },
    { id: 'chart-area', type: 'chart', title: 'Aylık İlerleme Grafiği' },
    { id: 'chart-pie', type: 'chart', title: 'Bütçe Dağılımı' },
    { id: 'widget-projects', type: 'chart', title: 'Proje Özeti Listesi' },
    { id: 'widget-activities', type: 'chart', title: 'Son Aktiviteler' },
    { id: 'widget-materials', type: 'chart', title: 'Kritik Stok Uyarıları' },
    { id: 'widget-fleet', type: 'chart', title: 'Makine & Araç Durumu' },
    { id: 'widget-tasks', type: 'chart', title: 'Yaklaşan Görevler' },
    { id: 'widget-approvals', type: 'chart', title: 'Onay Merkezi' }
  ];

  // Initialize Layout if Empty
  useEffect(() => {
    if (!dashboardLayout || dashboardLayout.length === 0) {
      setDashboardLayout(ALL_WIDGETS.map(w => w.id));
    }
  }, []);

  const layout = dashboardLayout || ALL_WIDGETS.map(w => w.id);
  const validLayout = layout.filter(id => ALL_WIDGETS.some(w => w.id === id));
  const kpiLayout = validLayout.filter(id => id.startsWith('kpi'));
  const chartLayout = validLayout.filter(id => !id.startsWith('kpi'));

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    if (!kpiData || projects.length === 0) return;
    const targets = {
      projects: kpiData.activeProjects || projects.filter(p => p.status === 'devam').length || 0,
      budget: Math.round((projects.reduce((sum, p) => sum + (Number(p.budget) || 0), 0)) / 1000000) || 0,
      workers: kpiData.totalWorkers || 0,
      safety: kpiData.safetyScore || 0,
    };
    
    const timer = setInterval(() => {
      setCounts({ projects: targets.projects, budget: targets.budget, workers: targets.workers, safety: targets.safety });
      clearInterval(timer);
    }, 50);
    return () => clearInterval(timer);
  }, [kpiData, projects]);

  const activeCount = projects.filter(p => p.status === 'devam').length;
  const totalBudget = projects.reduce((sum, p) => sum + Number(p.budget || 0), 0);
  const totalSpent = projects.reduce((sum, p) => sum + Number(p.spent || 0), 0);
  const utilization = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;

  const handleRemoveWidget = (id) => {
    setDashboardLayout(layout.filter(wId => wId !== id));
  };

  const handleAddWidget = (id) => {
    setDashboardLayout([...layout, id]);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      const oldIndex = layout.indexOf(active.id);
      const newIndex = layout.indexOf(over.id);
      setDashboardLayout(arrayMove(layout, oldIndex, newIndex));
    }
  };

  // Render specific widget content
  const renderWidgetContent = (id) => {
    switch (id) {
      case 'kpi-projects':
        return <KPICard icon={FolderKanban} label="Toplam Proje" value={counts.projects} sub={`${activeCount} aktif devam ediyor`} trend="up" trendVal="+2 bu yıl" color="#3b82f6" delay={0} />;
      case 'kpi-budget':
        return <KPICard icon={TrendingUp} label="Toplam Bütçe" value={`₺${counts.budget}M`} sub={`%${utilization} kullanıldı`} trend="up" trendVal="+₺28M" color="#818cf8" delay={0} />;
      case 'kpi-workers':
        return <KPICard icon={Users} label="Aktif Personel" value={counts.workers} sub="5 şantiyede" trend="up" trendVal="+24 bu ay" color="#fb923c" delay={0} />;
      case 'kpi-hakedis':
        return <KPICard icon={Receipt} label="Bekleyen Hakediş" value="₺31.5M" sub="3 hakediş onay bekliyor" trend="down" trendVal="-2 kapandı" color="#fbbf24" delay={0} />;
      case 'kpi-safety':
        return <KPICard icon={AlertTriangle} label="Güvenlik Skoru" value={`%${counts.safety}`} sub="Ay içinde sıfır kaza" trend="up" trendVal="+2 puan" color="#34d399" delay={0} />;
      case 'kpi-time':
        return <KPICard icon={Clock} label="Zamanında Teslim" value={`%${kpiData?.onTimeRate || 0}`} sub={`${kpiData?.completedTasks || 0} tamamlanan`} trend="up" trendVal="+5%" color="#fb923c" delay={0} />;
      
      case 'chart-area':
        return (
          <div className="glass-card" style={{ padding: 24, height: '100%' }}>
            <h3 className="section-title" style={{ fontSize: 16, marginBottom: 20 }}>Aylık İlerleme & Maliyet</h3>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={monthlyProgress} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradCyan" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.55} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.08} />
                  </linearGradient>
                  <linearGradient id="gradPurple" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#818cf8" stopOpacity={0.55} />
                    <stop offset="95%" stopColor="#818cf8" stopOpacity={0.08} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" stroke="#cbd5e1" vertical={false} strokeWidth={1.5} />
                <XAxis dataKey="month" tick={{ fill: 'var(--text-secondary)', fontSize: 13, fontWeight: 600 }} axisLine={false} tickLine={false} dy={10} />
                <YAxis tick={{ fill: 'var(--text-secondary)', fontSize: 13, fontWeight: 600 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', paddingTop: 20 }} />
                <Area type="monotone" dataKey="hedef" name="Hedef %" stroke="#3b82f6" strokeWidth={4} fill="url(#gradCyan)" dot={{ fill: '#3b82f6', r: 5, strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 8 }} />
                <Area type="monotone" dataKey="gercek" name="Gerçek %" stroke="#818cf8" strokeWidth={4} fill="url(#gradPurple)" dot={{ fill: '#818cf8', r: 5, strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 8 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        );
        
      case 'chart-pie':
        return (
          <div className="glass-card" style={{ padding: 24, height: '100%' }}>
            <h3 className="section-title" style={{ fontSize: 16, marginBottom: 20 }}>Bütçe Dağılımı</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              <ResponsiveContainer width="55%" height={230}>
                <PieChart>
                  <Pie
                    data={budgetBreakdown}
                    cx="50%" cy="50%"
                    innerRadius={55} outerRadius={95}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {budgetBreakdown.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => [`%${v}`, '']} contentStyle={{ background: '#ffffff', border: '1px solid var(--border-medium)', borderRadius: 8, fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 14 }}>
                {budgetBreakdown.map((item) => (
                  <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 14, height: 14, borderRadius: 4, background: item.color, flexShrink: 0 }} />
                    <span style={{ fontSize: 14, color: 'var(--text-secondary)', flex: 1, fontWeight: 600 }}>{item.name}</span>
                    <span style={{ fontSize: 15, fontWeight: 800, color: item.color }}>%{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
        
      case 'widget-projects':
        return (
          <div className="glass-card" style={{ padding: 24, height: '100%' }}>
            <h3 className="section-title" style={{ fontSize: 16, marginBottom: 16 }}>Proje Özeti</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {projects.slice(0,4).map((project, i) => (
                <div key={project.id} style={{
                  display: 'flex', gap: 16, alignItems: 'center', padding: '12px 16px',
                  background: 'var(--bg-secondary)', borderRadius: 10, borderLeft: `4px solid ${project.color}`,
                  border: '1px solid var(--border-subtle)'
                }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{project.name}</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: project.color }}>{project.progress}%</span>
                    </div>
                    <div className="progress-bar" style={{ height: 6, background: 'var(--border-subtle)' }}>
                      <div className="progress-fill" style={{ width: `${project.progress}%`, background: project.color, borderRadius: 3 }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'widget-activities':
        return (
          <div className="glass-card" style={{ padding: 24, height: '100%' }}>
            <h3 className="section-title" style={{ fontSize: 16, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Activity size={18} color="var(--accent-cyan)" /> Son Aktiviteler
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {activities.slice(0,5).map((activity, i) => (
                <div key={activity.id} style={{
                  display: 'flex', gap: 12, alignItems: 'flex-start', paddingBottom: 12,
                  borderBottom: i < 4 ? '1px solid var(--border-subtle)' : 'none'
                }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: activity.color, marginTop: 5, flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, color: 'var(--text-primary)', fontWeight: 500 }}>{activity.text}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{activity.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'widget-materials':
        const criticalStock = materials.filter(m => m.stock <= m.minStock).slice(0, 5);
        return (
          <div className="glass-card" style={{ padding: 24, height: '100%' }}>
            <h3 className="section-title" style={{ fontSize: 16, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Box size={18} color="var(--status-danger)" /> Kritik Stok Uyarıları
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {criticalStock.length === 0 ? (
                <div style={{ color: 'var(--text-muted)', fontSize: 13, textAlign: 'center', padding: 20 }}>Kritik seviyede malzeme yok.</div>
              ) : criticalStock.map((item, i) => (
                <div key={item.id} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 12,
                  borderBottom: i < criticalStock.length - 1 ? '1px solid var(--border-subtle)' : 'none'
                }}>
                  <div>
                    <div style={{ fontSize: 14, color: 'var(--text-primary)', fontWeight: 500 }}>{item.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--status-danger)', marginTop: 2 }}>Limit: {item.minStock} {item.unit}</div>
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--status-danger)' }}>{item.stock} {item.unit}</div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'widget-fleet':
        const activeFleet = fleetList.filter(f => f.durum === 'Sahada Aktif');
        const brokenFleet = fleetList.filter(f => f.durum !== 'Sahada Aktif');
        return (
          <div className="glass-card" style={{ padding: 24, height: '100%' }}>
            <h3 className="section-title" style={{ fontSize: 16, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Truck size={18} color="var(--accent-orange)" /> Araç & Makine Durumu
            </h3>
            <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
              <div style={{ flex: 1, background: 'rgba(52, 211, 153, 0.1)', border: '1px solid rgba(52, 211, 153, 0.2)', padding: 16, borderRadius: 12, textAlign: 'center' }}>
                <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--status-success)' }}>{activeFleet.length}</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Aktif Saha</div>
              </div>
              <div style={{ flex: 1, background: 'rgba(248, 113, 113, 0.1)', border: '1px solid rgba(248, 113, 113, 0.2)', padding: 16, borderRadius: 12, textAlign: 'center' }}>
                <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--status-danger)' }}>{brokenFleet.length}</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Pasif/Arızalı</div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {brokenFleet.slice(0, 3).map(f => (
                <div key={f.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, background: 'var(--bg-secondary)', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border-subtle)' }}>
                  <span style={{ color: 'var(--text-primary)' }}>{f.plaka} - {f.tur}</span>
                  <span style={{ color: 'var(--status-danger)', fontWeight: 500 }}>{f.durum}</span>
                </div>
              ))}
            </div>
          </div>
        );

      case 'widget-tasks':
        const pendingTasks = tasks.filter(t => t.durum !== 'Tamamlandı').slice(0, 5);
        return (
          <div className="glass-card" style={{ padding: 24, height: '100%' }}>
            <h3 className="section-title" style={{ fontSize: 16, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <ClipboardList size={18} color="#818cf8" /> Yaklaşan Görevler
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {pendingTasks.length === 0 ? (
                <div style={{ color: 'var(--text-muted)', fontSize: 13, textAlign: 'center', padding: 20 }}>Bekleyen görev yok.</div>
              ) : pendingTasks.map((t, i) => (
                <div key={t.id} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 12,
                  borderBottom: i < pendingTasks.length - 1 ? '1px solid var(--border-subtle)' : 'none'
                }}>
                  <div>
                    <div style={{ fontSize: 14, color: 'var(--text-primary)', fontWeight: 500 }}>{t.title}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>Bitiş: {t.endDate || 'Belirtilmedi'}</div>
                  </div>
                  <span style={{ fontSize: 11, padding: '4px 8px', borderRadius: 6, background: t.durum === 'Devam Ediyor' ? 'rgba(59,130,246,0.1)' : 'var(--bg-secondary)', color: t.durum === 'Devam Ediyor' ? '#3b82f6' : 'var(--text-secondary)' }}>
                    {t.durum}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );

      case 'widget-approvals':
        const pendingApprovals = onaylar.filter(o => o.status === 'beklemede').slice(0, 5);
        return (
          <div className="glass-card" style={{ padding: 24, height: '100%' }}>
            <h3 className="section-title" style={{ fontSize: 16, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <CheckCircle size={18} color="var(--status-warning)" /> Onay Bekleyenler
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {pendingApprovals.length === 0 ? (
                <div style={{ color: 'var(--text-muted)', fontSize: 13, textAlign: 'center', padding: 20 }}>Onay bekleyen kayıt yok.</div>
              ) : pendingApprovals.map((o, i) => (
                <div key={o.id} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 12,
                  borderBottom: i < pendingApprovals.length - 1 ? '1px solid var(--border-subtle)' : 'none'
                }}>
                  <div>
                    <div style={{ fontSize: 14, color: 'var(--text-primary)', fontWeight: 500 }}>{o.tur}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{o.title}</div>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>₺{(o.tutar/1000).toFixed(0)}K</div>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const missingWidgets = ALL_WIDGETS.filter(w => !validLayout.includes(w.id));

  return (
    <div style={{ paddingBottom: 40 }}>
      {/* Header Actions */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20 }}>
        <div style={{ position: 'relative' }}>
          <button 
            className="btn btn-secondary" 
            onClick={() => setShowWidgetMenu(!showWidgetMenu)}
            style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--bg-secondary)', border: '1px solid var(--border-medium)', padding: '8px 16px', borderRadius: 8, color: 'var(--text-primary)', fontWeight: 500, cursor: 'pointer' }}
          >
            <LayoutDashboard size={16} /> Widget Düzenle {missingWidgets.length > 0 && <span style={{ background: 'var(--status-danger)', color: '#fff', borderRadius: 10, padding: '2px 6px', fontSize: 10 }}>{missingWidgets.length}</span>}
          </button>
          
          <AnimatePresence>
            {showWidgetMenu && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                style={{ position: 'absolute', top: 45, right: 0, width: 280, background: 'var(--bg-secondary)', border: '1px solid var(--border-medium)', borderRadius: 12, boxShadow: '0 10px 25px rgba(0,0,0,0.1)', zIndex: 50, padding: 12 }}
              >
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 10, paddingBottom: 8, borderBottom: '1px solid var(--border-subtle)' }}>Gizlenmiş Öğeler</div>
                {missingWidgets.length === 0 ? (
                  <div style={{ fontSize: 13, color: 'var(--text-muted)', textAlign: 'center', padding: '10px 0' }}>Tüm öğeler sahnede.</div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {missingWidgets.map(w => (
                      <div key={w.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-primary)', padding: '8px 12px', borderRadius: 8 }}>
                        <span style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: 500 }}>{w.title}</span>
                        <button onClick={() => handleAddWidget(w.id)} style={{ background: 'var(--accent-cyan)', border: 'none', color: '#fff', borderRadius: '50%', width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                          <Plus size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        {/* KPI Row */}
        {kpiLayout.length > 0 && (
          <div className="kpi-grid" style={{ marginBottom: 24 }}>
            <SortableContext items={layout} strategy={rectSortingStrategy}>
              {kpiLayout.map(id => (
                <SortableWidget key={id} id={id} onRemove={handleRemoveWidget}>
                  {renderWidgetContent(id)}
                </SortableWidget>
              ))}
            </SortableContext>
          </div>
        )}

        {/* Charts Row */}
        {chartLayout.length > 0 && (
          <div className="content-grid">
            <SortableContext items={layout} strategy={rectSortingStrategy}>
              {chartLayout.map(id => (
                <SortableWidget key={id} id={id} onRemove={handleRemoveWidget}>
                  {renderWidgetContent(id)}
                </SortableWidget>
              ))}
            </SortableContext>
          </div>
        )}
      </DndContext>
    </div>
  );
}
