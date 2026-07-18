import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Package, AlertTriangle, TrendingDown, Search, X, Mail, Send, CheckCircle, FileText, Check, Clock } from 'lucide-react';
import { MaterialCard } from '../components/Cards/Cards';
import useERP from '../store/useERP';

const mockRequests = [
  { id: 'req1', title: 'C30 Hazır Beton', amount: '2000 m³', project: 'Maslak Rezidans', date: '2024-05-18', status: 'Teklif Bekliyor', urgency: 'Yüksek', supplierCount: 0 },
  { id: 'req2', title: 'Nervürlü İnşaat Demiri', amount: '150 Ton', project: 'Maslak Rezidans', date: '2024-05-19', status: 'Değerlendirmede', urgency: 'Orta', supplierCount: 3 },
  { id: 'req3', title: 'Seramik Yer Kaplaması', amount: '5000 m²', project: 'Kadıköy İş Merkezi', date: '2024-05-20', status: 'Onaylandı', urgency: 'Düşük', supplierCount: 5 }
];

export default function Materials() {
  const { materials, updateStock, addMaterial } = useERP();
  const [activeTab, setActiveTab] = useState('stok');
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showRfqModal, setShowRfqModal] = useState(false);
  const [rfqStatus, setRfqStatus] = useState('idle'); // idle, sending, success
  const [formData, setFormData] = useState({ name: '', category: 'Yapı Malzemesi', stock: '', minStock: '', unit: 'Adet', unitPrice: '' });
  const [filterCritical, setFilterCritical] = useState(false);

  const handleModalSubmit = (e) => {
    e.preventDefault();
    if (formData.name) {
      addMaterial(formData);
      setShowModal(false);
      setFormData({ name: '', category: 'Yapı Malzemesi', stock: '', minStock: '', unit: 'Adet', unitPrice: '' });
    }
  };

  const handleSendRFQ = () => {
    setRfqStatus('sending');
    setTimeout(() => {
      setRfqStatus('success');
      setTimeout(() => {
        setShowRfqModal(false);
        setRfqStatus('idle');
      }, 2500);
    }, 2000);
  };

  const filteredMaterials = materials.filter(m => {
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.category.toLowerCase().includes(search.toLowerCase());
    const matchCritical = filterCritical ? m.stock <= m.minStock : true;
    return matchSearch && matchCritical;
  });

  const criticalCount = materials.filter(m => m.stock <= m.minStock).length;
  const totalValue = materials.reduce((s, m) => s + m.stock * m.unitPrice, 0);
  const categories = [...new Set(materials.map(m => m.category))];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 className="page-title">Satınalma & Stok</h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
            Şantiye talepleri, public e-posta teklifleri (RFQ) ve depo takibi
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          {activeTab === 'stok' ? (
            <button className="btn btn-primary" onClick={() => setShowModal(true)}>
              <Plus size={14} /> Malzeme Ekle
            </button>
          ) : (
            <button className="btn btn-primary" onClick={() => setShowRfqModal(true)}>
              <Send size={14} /> Tedarikçilere E-Posta Daveti (RFQ)
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        <button onClick={() => setActiveTab('stok')} style={{ background: activeTab === 'stok' ? 'var(--bg-card)' : 'transparent', border: activeTab === 'stok' ? '1px solid var(--border-subtle)' : '1px solid transparent', padding: '8px 16px', borderRadius: 8, color: activeTab === 'stok' ? '#3b82f6' : 'var(--text-secondary)', fontSize: 13, fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}><Package size={14} /> Stok & Depo Yönetimi</button>
        <button onClick={() => setActiveTab('rfq')} style={{ background: activeTab === 'rfq' ? 'var(--bg-card)' : 'transparent', border: activeTab === 'rfq' ? '1px solid var(--border-subtle)' : '1px solid transparent', padding: '8px 16px', borderRadius: 8, color: activeTab === 'rfq' ? '#3b82f6' : 'var(--text-secondary)', fontSize: 13, fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}><FileText size={14} /> Talep & Tedarik (RFQ)</button>
      </div>

      {activeTab === 'stok' ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {/* Summary */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
            {[
              { label: 'Toplam Kalem', value: materials.length, color: '#3b82f6', icon: Package },
              { label: 'Kritik Stok', value: criticalCount, color: '#f87171', icon: AlertTriangle },
              { label: 'Kategori', value: categories.length, color: '#818cf8', icon: Package },
              { label: 'Stok Değeri', value: `₺${(totalValue / 1000000).toFixed(1)}M`, color: '#34d399', icon: TrendingDown },
            ].map((item, i) => {
              const ItemIcon = item.icon;
              return (
                <motion.div key={item.label} className="glass-card" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} style={{ padding: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 38, height: 38, borderRadius: 10, background: `${item.color}18`, border: `1px solid ${item.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ItemIcon size={16} color={item.color} />
                  </div>
                  <div>
                    <div style={{ fontSize: 22, fontWeight: 700, color: item.color, fontFamily: 'Outfit, sans-serif' }}>{item.value}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{item.label}</div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Filters */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 20, alignItems: 'center' }}>
            <div className="search-wrapper" style={{ width: 280 }}>
              <Search size={14} className="search-icon" />
              <input className="search-input" placeholder="Malzeme ara..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <button onClick={() => setFilterCritical(!filterCritical)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 16px', borderRadius: 10, cursor: 'pointer', background: filterCritical ? 'rgba(255,77,109,0.15)' : 'var(--glass-bg)', color: filterCritical ? '#f87171' : 'var(--text-muted)', fontSize: 13, border: filterCritical ? '1px solid rgba(255,77,109,0.3)' : '1px solid var(--glass-border)', transition: 'all 0.2s' }}>
              <AlertTriangle size={14} /> Sadece Kritik
            </button>
          </div>

          {/* Materials Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16, marginBottom: 24 }}>
            {filteredMaterials.map((material, i) => (
              <motion.div key={material.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}>
                <MaterialCard material={material} />
              </motion.div>
            ))}
          </div>

          {/* Detail Table */}
          <motion.div className="glass-card" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)' }}><h3 className="section-title" style={{ margin: 0 }}>Detay Tablosu</h3></div>
            <table className="erp-table" style={{ margin: 0 }}>
              <thead><tr><th>Malzeme</th><th>Kategori</th><th>Stok</th><th>Min. Stok</th><th>Birim Fiyat</th><th>Tedarikçi</th><th>Son Sipariş</th><th>İşlem</th></tr></thead>
              <tbody>
                {filteredMaterials.map((m, i) => {
                  const ratio = m.stock / m.minStock;
                  const stockColor = ratio <= 1 ? '#f87171' : ratio <= 2 ? '#fbbf24' : '#34d399';
                  return (
                    <motion.tr key={m.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}>
                      <td>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: 13 }}>{m.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{m.location}</div>
                      </td>
                      <td><span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 6, background: 'var(--glass-bg)', color: 'var(--text-secondary)' }}>{m.category}</span></td>
                      <td style={{ fontWeight: 700, color: stockColor }}>{m.stock.toLocaleString('tr-TR')} {m.unit}</td>
                      <td style={{ color: 'var(--text-muted)' }}>{m.minStock.toLocaleString('tr-TR')} {m.unit}</td>
                      <td style={{ color: 'var(--text-secondary)' }}>₺{m.unitPrice.toLocaleString('tr-TR')}</td>
                      <td style={{ color: 'var(--text-secondary)' }}>{m.supplier}</td>
                      <td style={{ color: 'var(--text-muted)', fontSize: 12 }}>{new Date(m.lastOrder).toLocaleDateString('tr-TR')}</td>
                      <td>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button onClick={() => updateStock(m.id, 100)} style={{ padding: '4px 8px', fontSize: 11, borderRadius: 6, background: 'rgba(0,212,255,0.1)', color: 'var(--accent-cyan)', border: '1px solid rgba(0,212,255,0.2)', cursor: 'pointer' }}>+100</button>
                          <button onClick={() => updateStock(m.id, -50)} style={{ padding: '4px 8px', fontSize: 11, borderRadius: 6, background: 'rgba(255,107,53,0.1)', color: 'var(--accent-orange)', border: '1px solid rgba(255,107,53,0.2)', cursor: 'pointer' }}>-50</button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </motion.div>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: 20 }}>
            <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 className="section-title" style={{ margin: 0 }}>Şantiye Satınalma Talepleri</h3>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Onay zincirindeki veya teklif toplanan talepler</span>
              </div>
              <table className="erp-table">
                <thead><tr><th>Talep No</th><th>Malzeme/Hizmet</th><th>Proje</th><th>Miktar</th><th>Durum</th><th>Teklifler</th></tr></thead>
                <tbody>
                  {mockRequests.map(r => (
                    <tr key={r.id}>
                      <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>#{r.id.toUpperCase()}</td>
                      <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                        {r.title}
                        {r.urgency === 'Yüksek' && <span style={{ marginLeft: 6, fontSize: 10, padding: '2px 6px', background: 'rgba(248,113,113,0.15)', color: '#f87171', borderRadius: 4 }}>ACİL</span>}
                      </td>
                      <td style={{ color: 'var(--text-secondary)' }}>{r.project}</td>
                      <td style={{ fontWeight: 600 }}>{r.amount}</td>
                      <td>
                        <span style={{ fontSize: 11, padding: '4px 8px', borderRadius: 6, background: r.status === 'Onaylandı' ? 'rgba(52,211,153,0.1)' : r.status === 'Teklif Bekliyor' ? 'rgba(251,191,36,0.1)' : 'rgba(59,130,246,0.1)', color: r.status === 'Onaylandı' ? '#34d399' : r.status === 'Teklif Bekliyor' ? '#fbbf24' : '#3b82f6' }}>
                          {r.status}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <span style={{ fontSize: 12, fontWeight: 600, color: r.supplierCount > 0 ? '#34d399' : 'var(--text-muted)' }}>{r.supplierCount}</span>
                          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Teklif</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="glass-card" style={{ padding: 20 }}>
              <h3 className="section-title" style={{ marginBottom: 16 }}>Çoklu Teklif Kıyaslama</h3>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 20 }}>
                Aşağıdaki tablo, "Nervürlü İnşaat Demiri" talebi için sisteme giren teklifleri kıyaslar.
              </div>
              <div style={{ background: 'var(--bg-card)', padding: 12, borderRadius: 10, border: '1px solid var(--border-subtle)', marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Erdemir A.Ş.</span>
                  <span style={{ fontSize: 13, color: '#34d399', fontWeight: 600 }}>₺14.500 / Ton</span>
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
                  <span>Vade: 30 Gün</span>
                  <span>Teslim: 2 Gün</span>
                </div>
              </div>
              <div style={{ background: 'var(--bg-card)', padding: 12, borderRadius: 10, border: '1px solid var(--border-subtle)', marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Kardemir</span>
                  <span style={{ fontSize: 13, color: '#f87171', fontWeight: 600 }}>₺15.200 / Ton</span>
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
                  <span>Vade: 45 Gün</span>
                  <span>Teslim: 5 Gün</span>
                </div>
              </div>
              <div style={{ background: 'var(--bg-card)', padding: 12, borderRadius: 10, border: '1px solid var(--border-subtle)', marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>İcdas</span>
                  <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 600 }}>₺14.800 / Ton</span>
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
                  <span>Vade: Peşin</span>
                  <span>Teslim: Hemen</span>
                </div>
              </div>
              <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 10 }}>En Uygun Teklifi Onayla</button>
            </div>
          </div>
        </motion.div>
      )}

      {/* New Material Modal */}
      <AnimatePresence>
        {showModal && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)' }}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 16, width: 450, padding: 24, boxShadow: 'var(--shadow-lg)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h3 style={{ margin: 0, color: 'var(--text-primary)', fontSize: 18, fontFamily: 'Outfit, sans-serif' }}>Yeni Malzeme Ekle</h3>
                <button onClick={() => setShowModal(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex' }}><X size={20} /></button>
              </div>
              <form onSubmit={handleModalSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6 }}>Malzeme Adı</label>
                  <input required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="search-input" style={{ width: '100%', padding: '10px 14px' }} placeholder="Örn: C30 Beton" />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6 }}>Kategori</label>
                    <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="search-input" style={{ width: '100%', padding: '10px 14px', appearance: 'none' }}>
                      <option value="Yapı Malzemesi">Yapı Malzemesi</option>
                      <option value="İnce İşçilik">İnce İşçilik</option>
                      <option value="Tesisat">Tesisat</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6 }}>Birim</label>
                    <select value={formData.unit} onChange={e => setFormData({ ...formData, unit: e.target.value })} className="search-input" style={{ width: '100%', padding: '10px 14px', appearance: 'none' }}>
                      <option value="Adet">Adet</option>
                      <option value="m³">m³</option>
                      <option value="Ton">Ton</option>
                    </select>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 10 }}>
                  <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>İptal</button>
                  <button type="submit" className="btn btn-primary">Kaydet</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* Public RFQ Modal */}
        {showRfqModal && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 16, width: 450, padding: 32, boxShadow: 'var(--shadow-lg)', textAlign: 'center' }}>
              {rfqStatus === 'idle' && (
                <>
                  <div style={{ width: 64, height: 64, borderRadius: 32, background: 'rgba(59,130,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                    <Mail size={32} color="#3b82f6" />
                  </div>
                  <h3 style={{ margin: '0 0 10px 0', fontSize: 20 }}>Tedarikçilere Teklif Daveti</h3>
                  <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 24, lineHeight: 1.5 }}>
                    Sistemde kayıtlı 45 tedarikçiye "C30 Hazır Beton" talebiniz için benzersiz bir teklif giriş linki (Public RFQ) gönderilecektir.
                  </p>
                  <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                    <button className="btn btn-ghost" onClick={() => setShowRfqModal(false)}>İptal</button>
                    <button className="btn btn-primary" onClick={handleSendRFQ}>Davetleri Gönder</button>
                  </div>
                </>
              )}
              {rfqStatus === 'sending' && (
                <div style={{ padding: '20px 0' }}>
                  <div className="spinner" style={{ borderTopColor: '#3b82f6', width: 40, height: 40, margin: '0 auto 20px', borderRadius: '50%', border: '3px solid rgba(255,255,255,0.1)', borderTop: '3px solid #3b82f6', animation: 'spin 1s linear infinite' }} />
                  <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
                  <h3 style={{ margin: 0, fontSize: 16 }}>E-postalar Gönderiliyor...</h3>
                </div>
              )}
              {rfqStatus === 'success' && (
                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                  <div style={{ width: 64, height: 64, borderRadius: 32, background: 'rgba(52,211,153,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                    <CheckCircle size={32} color="#34d399" />
                  </div>
                  <h3 style={{ margin: '0 0 10px 0', fontSize: 20, color: '#34d399' }}>Başarıyla Gönderildi!</h3>
                  <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0 }}>
                    Tedarikçiler e-posta üzerinden tekliflerini sisteme girdikçe Kıyaslama Tablosuna düşecektir.
                  </p>
                </motion.div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
