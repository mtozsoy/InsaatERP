import React, { Suspense, lazy, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';

import useERP from './store/useERP';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const Projects = lazy(() => import('./pages/Projects'));
const Finance = lazy(() => import('./pages/Finance'));
const Personnel = lazy(() => import('./pages/Personnel'));
const Materials = lazy(() => import('./pages/Materials'));
const RelationMap = lazy(() => import('./pages/RelationMap'));

// Yeni Sayfalar
const Budget = lazy(() => import('./pages/Budget'));
const Tender = lazy(() => import('./pages/Tender'));
const SiteLog = lazy(() => import('./pages/SiteLog'));
const Metraj = lazy(() => import('./pages/Metraj'));
const Schedule = lazy(() => import('./pages/Schedule'));
const Approvals = lazy(() => import('./pages/Approvals'));
const Documents = lazy(() => import('./pages/Documents'));
const Quality = lazy(() => import('./pages/Quality'));
const ISG = lazy(() => import('./pages/ISG'));
const Sales = lazy(() => import('./pages/Sales'));
const Messaging = lazy(() => import('./pages/Messaging'));
const Fleet = lazy(() => import('./pages/Fleet'));
const AI = lazy(() => import('./pages/AI'));
const LibraryPage = lazy(() => import('./pages/LibraryPage'));

const pages = {
  dashboard: Dashboard,
  projects: Projects,
  finance: Finance,
  personnel: Personnel,
  materials: Materials,
  relations: RelationMap,
  budget: Budget,
  tender: Tender,
  sitelog: SiteLog,
  metraj: Metraj,
  schedule: Schedule,
  approvals: Approvals,
  documents: Documents,
  quality: Quality,
  isg: ISG,
  sales: Sales,
  messaging: Messaging,
  fleet: Fleet,
  ai: AI,
  library: LibraryPage,
};

function PageLoader() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      height: '60vh', flexDirection: 'column', gap: 16,
    }}>
      <div style={{
        width: 40, height: 40, borderRadius: '50%',
        border: '2px solid transparent',
        borderTopColor: 'var(--accent-cyan)',
        borderRightColor: 'var(--accent-purple)',
        animation: 'spin 0.8s linear infinite',
      }} />
      <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>Yükleniyor...</span>
    </div>
  );
}

export default function App() {
  const { activePage, sidebarCollapsed, fetchProjects, fetchAllData } = useERP();
  
  useEffect(() => {
    fetchProjects();
    fetchAllData();
  }, []);
  
  const PageComponent = pages[activePage] || Dashboard;

  return (
    <div className="app-layout">


      {/* Sidebar */}
      <Sidebar />

      {/* Main */}
      <motion.main
        className="main-content"
        animate={{ marginLeft: sidebarCollapsed ? 72 : 260 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        style={{ position: 'relative', zIndex: 1 }}
      >
        <Header />

        <div className="page-content">
          <AnimatePresence mode="wait">
            <motion.div
              key={activePage}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            >
              <Suspense fallback={<PageLoader />}>
                <PageComponent />
              </Suspense>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.main>
    </div>
  );
}
