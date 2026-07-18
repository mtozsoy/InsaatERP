import { create } from 'zustand';

const useERP = create((set, get) => ({
  // State
  projects: [],
  isLoadingProjects: false,
  fetchProjects: async () => {
    set({ isLoadingProjects: true });
    try {
      const res = await fetch('/api/projects');
      if (res.ok) {
        const data = await res.json();
        set({ projects: data });
      }
    } catch (err) {
      console.error(err);
    } finally {
      set({ isLoadingProjects: false });
    }
  },

  // Collections (JSONB DB)
  hakedisler: [],
  personnel: [],
  materials: [],
  kpiData: {
    activeProjects: 0,
    totalWorkers: 0,
    completedTasks: 0,
    delayedTasks: 0,
    revenue: 0,
    expense: 0,
    profit: 0,
    onTimeRate: 0,
    efficiency: 0,
    safetyScore: 0
  },
  activities: [],
  butceKalemleri: [],
  ihaleler: [],
  teklifler: [],
  sozlesmeler: [],
  santiyeGunlukleri: [],
  metrajPozlari: [],
  onaylar: [],
  dokumanlar: [],
  kaliteKontroller: [],
  uygunsuzluklar: [],
  isgOlaylar: [],
  isgEgitimler: [],
  riskMatrisi: [],
  daireler: [],
  musteriler: [],
  birimFiyatlar: [],
  sablonlar: [],
  mesajKanallari: [],
  mesajlar: {},
  tasks: [],
  fleetList: [],
  maintenanceList: [],

  isLoadingGlobal: false,
  fetchAllData: async () => {
    set({ isLoadingGlobal: true });
    try {
      const res = await fetch('/api/data');
      if (res.ok) {
        const data = await res.json();

        // kpiData db'den gruplanırken array'e giriyor, onu geri obje yapmalıyız
        if (data.kpiData && Array.isArray(data.kpiData) && data.kpiData.length > 0) {
          data.kpiData = data.kpiData[0];
        }

        set(state => ({ ...state, ...data }));
      }
    } catch (e) {
      console.error("Fetch Data Error:", e);
    } finally {
      set({ isLoadingGlobal: false });
    }
  },

  _syncItem: async (collection, method, payload) => {
    try {
      const url = payload.id ? `/api/data?type=${collection}&id=${payload.id}` : `/api/data?type=${collection}`;
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch (e) { console.error("Sync Error:", e); }
  },

  activePage: 'dashboard',
  selectedProject: null,
  sidebarCollapsed: false,
  notifications: 3,

  // UI Actions
  setActivePage: (page) => set({ activePage: page }),
  setSelectedProject: (project) => set({ selectedProject: project }),
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

  dashboardLayout: ['kpi-projects', 'kpi-budget', 'kpi-workers', 'kpi-hakedis', 'kpi-safety', 'kpi-time', 'chart-area', 'chart-bar', 'chart-pie'],
  setDashboardLayout: (layout) => set({ dashboardLayout: layout }),

  addFleetVehicle: async (vehicle) => {
    set(state => ({ fleetList: [...state.fleetList, vehicle] }));
    await get()._syncItem('fleetList', 'POST', vehicle);
  },
  updateMaintenanceStatus: async (id, durum) => {
    let updatedMaintenance = null;
    set(state => {
      const newMaintenanceList = state.maintenanceList.map(m => {
        if (m.id === id) {
          updatedMaintenance = { ...m, durum };
          return updatedMaintenance;
        }
        return m;
      });
      return { maintenanceList: newMaintenanceList };
    });
    if (updatedMaintenance) {
      await get()._syncItem('maintenanceList', 'PUT', updatedMaintenance);
    }
  },

  // Core Entity Actions
  addProject: async (projectData) => {
    try {
      const isObj = typeof projectData === 'object';
      const name = isObj ? projectData.name : projectData;
      const payload = {
        name,
        status: isObj && projectData.status ? projectData.status : 'planlama',
        budget: isObj && projectData.butce ? Number(projectData.butce) : 50000000,
        location: isObj && projectData.konum ? projectData.konum : 'Bilinmiyor',
        workers: isObj && projectData.personel ? Number(projectData.personel) : 0,
        manager: isObj && projectData.manager ? projectData.manager : 'Atanmadı',
        startDate: isObj && projectData.startDate ? projectData.startDate : new Date().toISOString().split('T')[0],
        endDate: isObj && projectData.endDate ? projectData.endDate : '',
        description: isObj && projectData.description ? projectData.description : '',
        priority: isObj && projectData.priority ? projectData.priority : 'düşük',
        color: '#fbbf24'
      };

      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const data = await res.json();
        set(state => ({
          projects: [{ id: data.id, ...payload }, ...state.projects]
        }));
      }
    } catch (err) {
      console.error("Add Project Error", err);
    }
  },
  updateProject: async (id, projectData) => {
    try {
      const payload = {
        id,
        name: projectData.name,
        status: projectData.status,
        budget: projectData.butce ? Number(projectData.butce) : 0,
        location: projectData.konum,
        workers: projectData.personel ? Number(projectData.personel) : 0,
        manager: projectData.manager,
        startDate: projectData.startDate,
        endDate: projectData.endDate,
        description: projectData.description,
        priority: projectData.priority
      };

      const res = await fetch('/api/projects', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        set(state => ({
          projects: state.projects.map(p => p.id === id ? { ...p, ...payload } : p)
        }));
      }
    } catch (err) {
      console.error(err);
    }
  },
  addPersonnel: async (data) => {
    const payload = {
      id: `per-new-${Date.now()}`,
      name: data.name,
      role: data.role || 'Personel',
      department: data.department || 'Genel',
      dailyRate: Number(data.dailyRate) || 0,
      avatar: data.name.substring(0, 2).toUpperCase(),
      status: data.status || 'aktif',
      projectId: null,
      skills: []
    };
    set(state => ({ personnel: [...state.personnel, payload] }));
    await get()._syncItem('personnel', 'POST', payload);
  },
  addMaterial: async (data) => {
    const payload = {
      id: `mat-new-${Date.now()}`,
      name: data.name,
      code: `M-${Date.now().toString().slice(-4)}`,
      category: data.category || 'Genel',
      stock: Number(data.stock) || 0,
      unit: data.unit || 'Adet',
      unitPrice: Number(data.unitPrice) || 0,
      minStock: Number(data.minStock) || 10,
      status: 'stokta'
    };
    set(state => ({ materials: [...state.materials, payload] }));
    await get()._syncItem('materials', 'POST', payload);
  },
  updateProjectStatus: async (id, status) => {
    let updatedProject = null;
    set(state => {
      const newProjects = state.projects.map(p => {
        if (p.id === id) {
          updatedProject = { ...p, status };
          return updatedProject;
        }
        return p;
      });
      return { projects: newProjects };
    });

    if (updatedProject) {
      try {
        await fetch('/api/projects', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedProject)
        });
      } catch (err) {
        console.error("Project status sync failed:", err);
      }
    }
  },
  reorderProjects: (activeId, overId) => {
    set(state => {
      const items = [...state.projects];
      const oldIndex = items.findIndex(p => p.id === activeId);
      const newIndex = items.findIndex(p => p.id === overId);
      if (oldIndex === -1 || newIndex === -1) return state;
      const [removed] = items.splice(oldIndex, 1);
      items.splice(newIndex, 0, removed);
      return { projects: items };
    });
  },

  // Hakedis
  addHakedis: async (data) => {
    const payload = { id: `h-${Date.now()}`, projeId: 'prj-001', no: data.title || 'Yeni Hakediş', donem: data.date || 'Eklendi', amount: Number(data.amount) || 1500000, status: data.status || 'onay-bekliyor', ilerleme: 0 };
    set(state => ({ hakedisler: [...state.hakedisler, payload] }));
    await get()._syncItem('hakedisler', 'POST', payload);
  },
  updateHakedisStatus: async (id, status) => {
    let updatedObj;
    set(state => ({
      hakedisler: state.hakedisler.map(h => {
        if (h.id === id) { updatedObj = { ...h, status }; return updatedObj; }
        return h;
      })
    }));
    if (updatedObj) await get()._syncItem('hakedisler', 'PUT', updatedObj);
  },

  // Personnel
  assignPersonnel: async (personnelId, projectId) => {
    let updatedObj;
    set(state => ({
      personnel: state.personnel.map(p => {
        if (p.id === personnelId) { updatedObj = { ...p, projectId }; return updatedObj; }
        return p;
      })
    }));
    if (updatedObj) await get()._syncItem('personnel', 'PUT', updatedObj);
  },

  // Materials
  updateStock: async (id, amount) => {
    let updatedObj;
    set(state => ({
      materials: state.materials.map(m => {
        if (m.id === id) { updatedObj = { ...m, stock: Math.max(0, m.stock + amount) }; return updatedObj; }
        return m;
      })
    }));
    if (updatedObj) await get()._syncItem('materials', 'PUT', updatedObj);
  },

  // Approvals
  updateOnay: async (id, action) => {
    let updatedOnay = null;
    set(state => {
      const yeniOnaylar = state.onaylar.map(o => {
        if (o.id !== id) return o;

        let newStatus = o.status;
        let newAdim = o.mevcutAdim;

        if (action === 'reject') newStatus = 'reddedildi';
        if (action === 'approve') {
          newAdim = o.mevcutAdim + 1;
          if (newAdim >= o.adimlar.length) newStatus = 'onaylandı';
        }

        updatedOnay = { ...o, status: newStatus, mevcutAdim: newAdim };
        return updatedOnay;
      });
      return { onaylar: yeniOnaylar };
    });

    if (updatedOnay) {
      await get()._syncItem('onaylar', 'PUT', updatedOnay);
    }
  },

  // Metraj
  addMetrajPoz: async (data) => {
    const qty = parseFloat(data.quantity) || 0;
    const price = parseFloat(data.price) || 0;
    const payload = {
      id: `m-${Date.now()}`,
      projectId: 'prj-001',
      pozNo: `V.${Date.now().toString().slice(-4)}`,
      tanim: data.desc || 'Yeni Poz',
      kategori: data.category || 'Yeni Eklenenler',
      birim: data.unit || 'm²',
      miktar: qty,
      birimFiyat: price,
      tutar: qty * price
    };
    set(state => ({ metrajPozlari: [...state.metrajPozlari, payload] }));
    await get()._syncItem('metrajPozlari', 'POST', payload);
  },
  updateMetrajPoz: async (id, field, val) => {
    let updatedObj;
    set(state => ({
      metrajPozlari: state.metrajPozlari.map(p => {
        if (p.id !== id) return p;
        let parsedVal = val;
        if (field === 'miktar' || field === 'birimFiyat') {
          parsedVal = parseFloat(val);
          if (isNaN(parsedVal)) parsedVal = 0;
        }
        updatedObj = { ...p, [field]: parsedVal };
        if (field === 'miktar' || field === 'birimFiyat') {
          updatedObj.tutar = (updatedObj.miktar || 0) * (updatedObj.birimFiyat || 0);
        }
        return updatedObj;
      })
    }));
    if (updatedObj) await get()._syncItem('metrajPozlari', 'PUT', updatedObj);
  },

  // SiteLog
  addSantiyeGunlugu: async (data) => {
    const payload = {
      id: `sg-${Date.now()}`, projectId: 'prj-001', tarih: data.date || new Date().toISOString(), havaDurumu: data.weather || 'Güneşli', sicaklik: 22, personelSayisi: Number(data.workers) || 10, ekipmanSayisi: 3, fotografSayisi: 0, olusturan: 'Kullanıcı',
      yapılanIsler: data.notes ? data.notes.split('\n').filter(n => n.trim() !== '') : ['Yeni günlük eklendi'],
      sorunlar: data.sorunlar ? data.sorunlar.split('\n').filter(s => s.trim() !== '') : []
    };
    set(state => ({ santiyeGunlukleri: [...state.santiyeGunlukleri, payload] }));
    await get()._syncItem('santiyeGunlukleri', 'POST', payload);
  },
  updateSantiyeGunlugu: async (id, data) => {
    let updatedObj;
    set(state => ({
      santiyeGunlukleri: state.santiyeGunlukleri.map(log => {
        if (log.id === id) {
          updatedObj = {
            ...log,
            havaDurumu: data.weather || log.havaDurumu,
            personelSayisi: Number(data.workers) || log.personelSayisi,
            yapılanIsler: data.notes !== undefined ? data.notes.split('\n').filter(n => n.trim() !== '') : log.yapılanIsler,
            sorunlar: data.sorunlar !== undefined ? data.sorunlar.split('\n').filter(s => s.trim() !== '') : log.sorunlar
          };
          return updatedObj;
        }
        return log;
      })
    }));
    if (updatedObj) await get()._syncItem('santiyeGunlukleri', 'PUT', updatedObj);
  },

  // Quality (Uygunsuzluk Pipeline)
  updateUygunsuzlukStatus: async (id, status) => {
    let updatedObj;
    set(state => ({
      uygunsuzluklar: state.uygunsuzluklar.map(u => {
        if (u.id === id) { updatedObj = { ...u, status }; return updatedObj; }
        return u;
      })
    }));
    if (updatedObj) await get()._syncItem('uygunsuzluklar', 'PUT', updatedObj);
  },
  addKaliteKontrol: async (data) => {
    const payload = { id: `kk-${Date.now()}`, projectId: 'prj-001', baslik: data.title || 'Yeni Kontrol', kategori: data.category || 'Genel', durum: 'beklemede', oncelik: data.priority || 'orta', sorumlu: data.manager || 'Kullanıcı', tarih: 'Bugün', sonuc: '' };
    set(state => ({ kaliteKontroller: [...state.kaliteKontroller, payload] }));
    await get()._syncItem('kaliteKontroller', 'POST', payload);
  },

  // ISG
  addIsgOlay: async (data) => {
    const payload = { id: `io-${Date.now()}`, projectId: 'prj-001', tip: data.type || 'ramak-kala', agirlik: data.severity || 'hafif', baslik: data.title || 'Yeni Olay', kategori: 'Genel', bildiren: data.reporter || 'Kullanıcı', tarih: 'Bugün', cozum: 'İncelenecek' };
    set(state => ({ isgOlaylar: [...state.isgOlaylar, payload] }));
    await get()._syncItem('isgOlaylar', 'POST', payload);
  },

  // Tender
  addIhale: async (data) => {
    const payload = { id: `i-${Date.now()}`, title: data.title || 'Yeni İhale', tur: data.type || 'Mal Alımı', baslangic: data.start || 'Bugün', bitis: data.end || 'Gelecek Ay', teklifSayisi: 0, status: 'planlama' };
    set(state => ({ ihaleler: [...state.ihaleler, payload] }));
    await get()._syncItem('ihaleler', 'POST', payload);
  },

  // Documents
  addDokuman: async (data) => {
    const payload = { id: `doc-${Date.now()}`, ad: data.name || 'Yeni Dosya', kategori: data.category || 'Genel', format: data.format || 'PDF', boyut: data.size || '1.2 MB', yukleme: 'Az önce', yukleyen: 'Kullanıcı', durum: 'onaylı', versiyon: 'v1.0', etiketler: ['yeni'] };
    set(state => ({ dokumanlar: [...state.dokumanlar, payload] }));
    await get()._syncItem('dokumanlar', 'POST', payload);
  },

  // Messaging
  sendMessage: async (kanalId, text) => {
    const newMsg = { id: `m-new-${Date.now()}`, kanalId, gonderen: 'Mete K.', avatar: 'MK', icerik: text, zaman: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }), benim: true, renk: '#00D4FF' };
    set(state => ({ mesajlar: { ...state.mesajlar, [kanalId]: [...(state.mesajlar[kanalId] || []), newMsg] } }));
    // Dictionary olan mesajlar objesi API'de ayrı bir formatta tutulduğu veya güncellendiği için bunu pass geçebiliriz veya tam objeyi atarız.
  },

  // Tasks (Schedule / Gantt)
  addTask: async (data) => {
    const payload = { id: `t-new-${Date.now()}`, projectId: data.projectId || 'prj-001', name: data.name || 'Yeni Görev', start: data.start || new Date().toISOString().split('T')[0], end: data.end || new Date().toISOString().split('T')[0], progress: 0, assignee: data.assignee || null, status: 'bekliyor', color: data.color || '#3b82f6', dependencies: [] };
    set(state => ({ tasks: [...state.tasks, payload] }));
    await get()._syncItem('tasks', 'POST', payload);
  },
  updateTask: async (id, updates) => {
    let updatedObj;
    set(state => ({
      tasks: state.tasks.map(t => {
        if (t.id === id) { updatedObj = { ...t, ...updates }; return updatedObj; }
        return t;
      })
    }));
    if (updatedObj) await get()._syncItem('tasks', 'PUT', updatedObj);
  },
  removeTask: async (id) => {
    set(state => ({ tasks: state.tasks.filter(t => t.id !== id) }));
    await get()._syncItem('tasks', 'DELETE', { id });
  },
}));

export default useERP;
