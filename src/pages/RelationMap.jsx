import React, { useCallback, useMemo } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  Handle,
  Position,
  Panel,
  applyNodeChanges,
  applyEdgeChanges,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { motion } from 'framer-motion';
import useERP from '../store/useERP';
import { FolderKanban, Receipt, Users, Package, GitBranch } from 'lucide-react';

const NODE_TYPES_CONFIG = {
  project: { color: '#3b82f6', icon: FolderKanban, label: 'Proje' },
  hakedis: { color: '#34d399', icon: Receipt, label: 'Hakediş' },
  personnel: { color: '#818cf8', icon: Users, label: 'Personel' },
  material: { color: '#fb923c', icon: Package, label: 'Malzeme' },
};

function CustomNode({ data }) {
  const config = NODE_TYPES_CONFIG[data.nodeType] || NODE_TYPES_CONFIG.project;
  const Icon = config.icon;

  return (
    <div style={{
      background: 'var(--bg-card)',
      border: `1.5px solid ${config.color}50`,
      borderRadius: 12,
      padding: '10px 14px',
      minWidth: 160,
      boxShadow: `0 0 20px ${config.color}15`,
      backdropFilter: 'blur(20px)',
      transition: 'all 0.2s',
    }}>
      <Handle type="target" position={Position.Top} style={{ background: config.color, width: 8, height: 8, border: 'none' }} />

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
        <div style={{
          width: 26, height: 26, borderRadius: 6,
          background: `${config.color}20`,
          border: `1px solid ${config.color}40`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon size={12} color={config.color} />
        </div>
        <span style={{ fontSize: 9, color: config.color, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.8 }}>
          {config.label}
        </span>
      </div>

      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.3, marginBottom: 4 }}>
        {data.label}
      </div>

      {data.sub && (
        <div style={{ fontSize: 10, color: 'var(--text-secondary)' }}>{data.sub}</div>
      )}

      {data.progress !== undefined && (
        <div style={{ marginTop: 8 }}>
          <div style={{ height: 3, background: 'rgba(255,255,255,0.1)', borderRadius: 2, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${data.progress}%`, background: config.color, borderRadius: 2 }} />
          </div>
          <div style={{ fontSize: 9, color: config.color, marginTop: 3 }}>{data.progress}%</div>
        </div>
      )}

      <Handle type="source" position={Position.Bottom} style={{ background: config.color, width: 8, height: 8, border: 'none' }} />
    </div>
  );
}

const nodeTypes = { custom: CustomNode };

function buildGraph(projects, hakedisler, personnel, materials) {
  const nodes = [];
  const edges = [];
  let x = 0;

  // Projects row
  projects.forEach((p, i) => {
    nodes.push({
      id: p.id, type: 'custom',
      position: { x: i * 220, y: 0 },
      data: { label: p.name, sub: p.code, nodeType: 'project', progress: p.progress },
    });
  });

  // Hakedis row
  hakedisler.forEach((h, i) => {
    nodes.push({
      id: h.id, type: 'custom',
      position: { x: i * 220, y: 180 },
      data: { label: h.title, sub: h.invoiceNo, nodeType: 'hakedis' },
    });
    edges.push({
      id: `e-${h.projectId}-${h.id}`,
      source: h.projectId, target: h.id,
      animated: h.status !== 'ödendi',
      style: { stroke: '#34d399', strokeWidth: 1.5, opacity: 0.6 },
      type: 'smoothstep',
    });
  });

  // Personnel row
  personnel.forEach((p, i) => {
    nodes.push({
      id: p.id, type: 'custom',
      position: { x: i * 200, y: 360 },
      data: { label: p.name, sub: p.role, nodeType: 'personnel' },
    });
    if (p.projectId) {
      edges.push({
        id: `e-${p.projectId}-${p.id}`,
        source: p.projectId, target: p.id,
        style: { stroke: '#818cf8', strokeWidth: 1.5, opacity: 0.5 },
        type: 'smoothstep',
      });
    }
  });

  // Materials row
  materials.forEach((m, i) => {
    nodes.push({
      id: m.id, type: 'custom',
      position: { x: i * 220, y: 540 },
      data: { label: m.name, sub: `${m.stock} ${m.unit}`, nodeType: 'material' },
    });
    m.projectIds?.forEach(pid => {
      edges.push({
        id: `e-${pid}-${m.id}`,
        source: pid, target: m.id,
        style: { stroke: '#fb923c', strokeWidth: 1.5, opacity: 0.4 },
        type: 'smoothstep',
      });
    });
  });

  return { nodes, edges };
}

export default function RelationMap() {
  const { projects, hakedisler, personnel, materials } = useERP();
  const { nodes: initNodes, edges: initEdges } = useMemo(
    () => buildGraph(projects, hakedisler, personnel, materials),
    [projects, hakedisler, personnel, materials]
  );

  const [nodes, setNodes] = React.useState(initNodes);
  const [edges, setEdges] = React.useState(initEdges);

  React.useEffect(() => {
    setNodes(initNodes);
    setEdges(initEdges);
  }, [initNodes, initEdges]);

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onConnect = useCallback(
    (params) => setEdges(eds => [...eds, { ...params, style: { stroke: '#3b82f6', strokeWidth: 1.5 }, type: 'smoothstep' }]),
    [setEdges]
  );

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h1 className="page-title">İlişki Haritası</h1>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
          Proje, Hakediş, Personel ve Malzeme bağlantıları · Sürükle, bağla, keşfet
        </p>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
        {Object.entries(NODE_TYPES_CONFIG).map(([key, cfg]) => {
          const Icon = cfg.icon;
          return (
            <div key={key} style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: 'var(--glass-bg)',
              border: `1px solid ${cfg.color}30`,
              borderRadius: 8, padding: '6px 12px',
            }}>
              <Icon size={12} color={cfg.color} />
              <span style={{ fontSize: 11, color: cfg.color, fontWeight: 600 }}>{cfg.label}</span>
            </div>
          );
        })}
        <div style={{
          fontSize: 11, color: 'var(--text-muted)',
          display: 'flex', alignItems: 'center', gap: 6,
          marginLeft: 'auto',
        }}>
          <GitBranch size={12} />
          Düğümleri sürükleyebilir, yeni bağlantı çizebilirsiniz
        </div>
      </div>

      <div style={{
        height: 620, borderRadius: 16,
        border: '1px solid var(--glass-border)',
        overflow: 'hidden',
      }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          style={{ background: 'transparent' }}
          proOptions={{ hideAttribution: true }}
        >
          <Background
            color="rgba(0,0,0,0.1)"
            gap={32}
            size={1}
            variant="dots"
          />
          <Controls
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 10,
            }}
          />
          <MiniMap
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 10,
            }}
            nodeColor={node => NODE_TYPES_CONFIG[node.data?.nodeType]?.color || '#3b82f6'}
          />
        </ReactFlow>
      </div>
    </div>
  );
}
