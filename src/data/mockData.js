// ============================
// İnşaat ERP — Mock Veri
// ============================

export const projects = [
  {
    id: "prj-001",
    name: "Maslak Rezidans Kulesi",
    code: "MRK-2024",
    status: "devam",
    progress: 68,
    budget: 45000000,
    spent: 30600000,
    startDate: "2024-01-15",
    endDate: "2026-08-30",
    location: "İstanbul, Maslak",
    manager: "Ahmet Kaya",
    workers: 142,
    category: "Konut",
    color: "#00D4FF",
    phase: "Kaba İnşaat",
    priority: "yüksek",
    hakedis: ["hak-001", "hak-002", "hak-003"],
    materials: ["mat-001", "mat-002", "mat-005"],
    personnel: ["per-001", "per-002", "per-003"],
  },
  {
    id: "prj-002",
    name: "Gebze Lojistik Merkezi",
    code: "GLM-2024",
    status: "devam",
    progress: 35,
    budget: 28000000,
    spent: 9800000,
    startDate: "2024-03-01",
    endDate: "2025-12-31",
    location: "Kocaeli, Gebze",
    manager: "Fatma Şahin",
    workers: 89,
    category: "Sanayi",
    color: "#7B2FFF",
    phase: "Temel",
    priority: "orta",
    hakedis: ["hak-004"],
    materials: ["mat-003", "mat-004"],
    personnel: ["per-004", "per-005"],
  },
  {
    id: "prj-003",
    name: "Ankara Metro Hattı G",
    code: "AMH-G-23",
    status: "devam",
    progress: 81,
    budget: 120000000,
    spent: 97200000,
    startDate: "2023-06-01",
    endDate: "2025-12-01",
    location: "Ankara",
    manager: "Mehmet Demir",
    workers: 310,
    category: "Altyapı",
    color: "#FF6B35",
    phase: "Tünel & Ray",
    priority: "kritik",
    hakedis: ["hak-005", "hak-006"],
    materials: ["mat-001", "mat-004", "mat-006"],
    personnel: ["per-006", "per-007", "per-008"],
  },
  {
    id: "prj-004",
    name: "Bodrum Otel Kompleksi",
    code: "BOK-2025",
    status: "planlama",
    progress: 12,
    budget: 18000000,
    spent: 2160000,
    startDate: "2025-04-01",
    endDate: "2027-04-01",
    location: "Muğla, Bodrum",
    manager: "Zeynep Arslan",
    workers: 0,
    category: "Turizm",
    color: "#00FFB3",
    phase: "Proje",
    priority: "orta",
    hakedis: [],
    materials: [],
    personnel: ["per-009"],
  },
  {
    id: "prj-005",
    name: "İzmir Hastane Binası",
    code: "İHB-2024",
    status: "tamamlandı",
    progress: 100,
    budget: 35000000,
    spent: 33250000,
    startDate: "2022-09-01",
    endDate: "2024-11-30",
    location: "İzmir, Bornova",
    manager: "Can Yıldız",
    workers: 0,
    category: "Sağlık",
    color: "#FFD93D",
    phase: "Tamamlandı",
    priority: "düşük",
    hakedis: ["hak-007", "hak-008", "hak-009"],
    materials: [],
    personnel: [],
  },
];

export const hakedisler = [
  {
    id: "hak-001",
    projectId: "prj-001",
    no: 1,
    title: "1. Hakediş — Temel İşleri",
    amount: 4200000,
    status: "ödendi",
    date: "2024-03-15",
    invoiceNo: "INV-2024-001",
  },
  {
    id: "hak-002",
    projectId: "prj-001",
    no: 2,
    title: "2. Hakediş — Kaba İnşaat",
    amount: 6800000,
    status: "ödendi",
    date: "2024-07-01",
    invoiceNo: "INV-2024-042",
  },
  {
    id: "hak-003",
    projectId: "prj-001",
    no: 3,
    title: "3. Hakediş — Çelik Konstrüksiyon",
    amount: 9500000,
    status: "beklemede",
    date: "2024-11-20",
    invoiceNo: "INV-2024-118",
  },
  {
    id: "hak-004",
    projectId: "prj-002",
    no: 1,
    title: "1. Hakediş — Zemin Etüdü",
    amount: 1200000,
    status: "onay-bekliyor",
    date: "2024-08-10",
    invoiceNo: "INV-2024-088",
  },
  {
    id: "hak-005",
    projectId: "prj-003",
    no: 5,
    title: "5. Hakediş — Tünel Segment",
    amount: 18500000,
    status: "ödendi",
    date: "2024-09-01",
    invoiceNo: "INV-2024-095",
  },
  {
    id: "hak-006",
    projectId: "prj-003",
    no: 6,
    title: "6. Hakediş — Ray Döşeme",
    amount: 22000000,
    status: "beklemede",
    date: "2024-12-15",
    invoiceNo: "INV-2024-152",
  },
  {
    id: "hak-007",
    projectId: "prj-005",
    no: 8,
    title: "8. Hakediş — Final",
    amount: 4500000,
    status: "ödendi",
    date: "2024-11-25",
    invoiceNo: "INV-2024-148",
  },
];

export const personnel = [
  {
    id: "per-001",
    name: "Ahmet Kaya",
    role: "Proje Müdürü",
    department: "Yönetim",
    projectId: "prj-001",
    dailyRate: 2500,
    status: "aktif",
    avatar: "AK",
    phone: "+90 532 111 22 33",
    skills: ["AutoCAD", "MS Project", "Beton"],
  },
  {
    id: "per-002",
    name: "Leyla Çetin",
    role: "Şantiye Şefi",
    department: "Saha",
    projectId: "prj-001",
    dailyRate: 1800,
    status: "aktif",
    avatar: "LÇ",
    phone: "+90 533 222 33 44",
    skills: ["Saha Yönetimi", "Güvenlik", "Raporlama"],
  },
  {
    id: "per-003",
    name: "Burak Yılmaz",
    role: "Mühendis",
    department: "Teknik",
    projectId: "prj-001",
    dailyRate: 1500,
    status: "aktif",
    avatar: "BY",
    phone: "+90 534 333 44 55",
    skills: ["Statik", "Beton", "Çelik"],
  },
  {
    id: "per-004",
    name: "Fatma Şahin",
    role: "Proje Müdürü",
    department: "Yönetim",
    projectId: "prj-002",
    dailyRate: 2500,
    status: "aktif",
    avatar: "FŞ",
    phone: "+90 535 444 55 66",
    skills: ["MS Project", "Lojistik", "Sözleşme"],
  },
  {
    id: "per-005",
    name: "Emre Koç",
    role: "Şantiye Şefi",
    department: "Saha",
    projectId: "prj-002",
    dailyRate: 1800,
    status: "aktif",
    avatar: "EK",
    phone: "+90 536 555 66 77",
    skills: ["Saha", "Ekipman", "İş Güvenliği"],
  },
  {
    id: "per-006",
    name: "Mehmet Demir",
    role: "Proje Müdürü",
    department: "Yönetim",
    projectId: "prj-003",
    dailyRate: 3000,
    status: "aktif",
    avatar: "MD",
    phone: "+90 537 666 77 88",
    skills: ["Tünel", "Metro", "Proje Yönetimi"],
  },
  {
    id: "per-007",
    name: "Selin Aydın",
    role: "Tünel Mühendisi",
    department: "Teknik",
    projectId: "prj-003",
    dailyRate: 2200,
    status: "aktif",
    avatar: "SA",
    phone: "+90 538 777 88 99",
    skills: ["TBM", "Tünel", "Zemin"],
  },
  {
    id: "per-008",
    name: "Oğuz Polat",
    role: "Elektrik Mühendisi",
    department: "Teknik",
    projectId: "prj-003",
    dailyRate: 1900,
    status: "aktif",
    avatar: "OP",
    phone: "+90 539 888 99 00",
    skills: ["Elektrik", "Enerji", "SCADA"],
  },
  {
    id: "per-009",
    name: "Zeynep Arslan",
    role: "Proje Müdürü",
    department: "Yönetim",
    projectId: "prj-004",
    dailyRate: 2500,
    status: "aktif",
    avatar: "ZA",
    phone: "+90 530 999 00 11",
    skills: ["Mimarlık", "Otel", "Tasarım"],
  },
];

export const materials = [
  {
    id: "mat-001",
    name: "C30/37 Hazır Beton",
    unit: "m³",
    stock: 1450,
    minStock: 500,
    unitPrice: 2800,
    supplier: "Beton A.Ş.",
    location: "Depo-1, Maslak",
    category: "Beton",
    projectIds: ["prj-001", "prj-003"],
    lastOrder: "2024-12-01",
  },
  {
    id: "mat-002",
    name: "S420 İnşaat Demiri",
    unit: "ton",
    stock: 320,
    minStock: 100,
    unitPrice: 28500,
    supplier: "Demir Metal Ltd.",
    location: "Depo-1, Maslak",
    category: "Çelik",
    projectIds: ["prj-001"],
    lastOrder: "2024-11-15",
  },
  {
    id: "mat-003",
    name: "Zemin Ankrajı",
    unit: "adet",
    stock: 850,
    minStock: 200,
    unitPrice: 450,
    supplier: "Ankraj Sis. A.Ş.",
    location: "Depo-2, Gebze",
    category: "Zemin",
    projectIds: ["prj-002"],
    lastOrder: "2024-10-20",
  },
  {
    id: "mat-004",
    name: "Tünel Segment Kalıbı",
    unit: "adet",
    stock: 48,
    minStock: 20,
    unitPrice: 125000,
    supplier: "Segma İnşaat",
    location: "Depo-3, Ankara",
    category: "Kalıp",
    projectIds: ["prj-002", "prj-003"],
    lastOrder: "2024-09-05",
  },
  {
    id: "mat-005",
    name: "Tuğla (Asmolen)",
    unit: "adet",
    stock: 52000,
    minStock: 10000,
    unitPrice: 8,
    supplier: "Tuğla Fab.",
    location: "Depo-1, Maslak",
    category: "Kagir",
    projectIds: ["prj-001"],
    lastOrder: "2024-12-10",
  },
  {
    id: "mat-006",
    name: "Ray (UIC 60)",
    unit: "metre",
    stock: 2400,
    minStock: 1000,
    unitPrice: 3200,
    supplier: "Rail Systems",
    location: "Depo-3, Ankara",
    category: "Altyapı",
    projectIds: ["prj-003"],
    lastOrder: "2024-11-01",
  },
];

export const kpiData = {
  totalProjects: 5,
  activeProjects: 3,
  totalBudget: 246000000,
  totalSpent: 173010000,
  totalWorkers: 541,
  completedThisYear: 1,
  onTimeRate: 78,
  safetyScore: 94,
};

export const monthlyProgress = [
  { month: "Tem", hedef: 65, gercek: 58, maliyet: 12 },
  { month: "Ağu", hedef: 68, gercek: 62, maliyet: 14 },
  { month: "Eyl", hedef: 72, gercek: 69, maliyet: 16 },
  { month: "Eki", hedef: 75, gercek: 74, maliyet: 18 },
  { month: "Kas", hedef: 78, gercek: 77, maliyet: 20 },
  { month: "Ara", hedef: 82, gercek: 80, maliyet: 22 },
];

export const budgetBreakdown = [
  { name: "İşçilik", value: 35, color: "#00D4FF" },
  { name: "Malzeme", value: 42, color: "#7B2FFF" },
  { name: "Ekipman", value: 13, color: "#FF6B35" },
  { name: "Genel Gider", value: 7, color: "#FFD93D" },
  { name: "Diğer", value: 3, color: "#00FFB3" },
];

export const activities = [
  { id: 1, type: "hakedis", text: "Maslak Rezidans 3. Hakediş onaylandı", time: "2 saat önce", color: "#00D4FF" },
  { id: 2, type: "personel", text: "Selin Aydın Ankara Metro'ya atandı", time: "4 saat önce", color: "#7B2FFF" },
  { id: 3, type: "malzeme", text: "C30/37 Beton siparişi verildi — 500 m³", time: "6 saat önce", color: "#FF6B35" },
  { id: 4, type: "proje", text: "Bodrum Otel Kompleksi planlamaya alındı", time: "Dün", color: "#00FFB3" },
  { id: 5, type: "uyari", text: "Gebze Lojistik: Zemin Ankrajı kritik stok!", time: "Dün", color: "#FFD93D" },
  { id: 6, type: "proje", text: "İzmir Hastane projesi tamamlandı ✓", time: "2 gün önce", color: "#00D4FF" },
];

// ============================
// e-İHALE & SÖZLEŞME
// ============================
export const ihaleler = [
  { id: "ihl-001", title: "Temel Kazı ve Hafriyat İşleri", projectId: "prj-001", status: "tamamlandı", teklifSayisi: 5, enDusukTeklif: 2850000, kazananFirma: "Kazı A.Ş.", baslangic: "2024-01-05", bitis: "2024-01-20", tur: "Açık İhale" },
  { id: "ihl-002", title: "Çelik Konstrüksiyon Montajı", projectId: "prj-001", status: "devam", teklifSayisi: 4, enDusukTeklif: 9200000, kazananFirma: null, baslangic: "2024-11-01", bitis: "2024-12-01", tur: "Kapalı Zarflı" },
  { id: "ihl-003", title: "Zemin İyileştirme Çalışmaları", projectId: "prj-002", status: "tamamlandı", teklifSayisi: 3, enDusukTeklif: 1450000, kazananFirma: "Zemin Pro", baslangic: "2024-03-10", bitis: "2024-03-25", tur: "Açık İhale" },
  { id: "ihl-004", title: "TBM Kiralama ve Operasyonu", projectId: "prj-003", status: "tamamlandı", teklifSayisi: 2, enDusukTeklif: 28500000, kazananFirma: "Tünel Sys.", baslangic: "2023-06-15", bitis: "2023-07-01", tur: "Pazarlık" },
  { id: "ihl-005", title: "İklimlendirme ve Havalandırma", projectId: "prj-003", status: "planlama", teklifSayisi: 0, enDusukTeklif: null, kazananFirma: null, baslangic: "2025-01-10", bitis: "2025-02-10", tur: "Açık İhale" },
  { id: "ihl-006", title: "Dış Cephe Kaplama", projectId: "prj-001", status: "devam", teklifSayisi: 6, enDusukTeklif: 4100000, kazananFirma: null, baslangic: "2024-12-01", bitis: "2024-12-20", tur: "Kapalı Zarflı" },
];

export const teklifler = [
  { id: "tkl-001", ihaleId: "ihl-002", firma: "Çelik A.Ş.", tutar: 9200000, sure: 45, puan: 92, durum: "değerlendirme" },
  { id: "tkl-002", ihaleId: "ihl-002", firma: "Metal Pro", tutar: 9850000, sure: 40, puan: 88, durum: "değerlendirme" },
  { id: "tkl-003", ihaleId: "ihl-002", firma: "Konstrükt Ltd.", tutar: 10200000, sure: 38, puan: 85, durum: "değerlendirme" },
  { id: "tkl-004", ihaleId: "ihl-002", firma: "Demir İnş.", tutar: 11500000, sure: 35, puan: 79, durum: "değerlendirme" },
  { id: "tkl-005", ihaleId: "ihl-006", firma: "Cephe A.Ş.", tutar: 4100000, sure: 60, puan: 94, durum: "değerlendirme" },
  { id: "tkl-006", ihaleId: "ihl-006", firma: "Fasad Pro", tutar: 4350000, sure: 55, puan: 90, durum: "değerlendirme" },
];

export const sozlesmeler = [
  { id: "szl-001", title: "Temel Kazı Sözleşmesi", firma: "Kazı A.Ş.", tutar: 2850000, imzaTarihi: "2024-01-22", bitisTarihi: "2024-06-30", status: "aktif", projectId: "prj-001", tip: "Götürü Bedel" },
  { id: "szl-002", title: "TBM Kiralama Sözleşmesi", firma: "Tünel Sys.", tutar: 28500000, imzaTarihi: "2023-07-05", bitisTarihi: "2025-06-30", status: "aktif", projectId: "prj-003", tip: "Hizmet" },
  { id: "szl-003", title: "Zemin İyileştirme Sözleşmesi", firma: "Zemin Pro", tutar: 1450000, imzaTarihi: "2024-03-28", bitisTarihi: "2024-09-30", status: "tamamlandı", projectId: "prj-002", tip: "Götürü Bedel" },
  { id: "szl-004", title: "Proje Danışmanlık Sözleşmesi", firma: "Konsult Ltd.", tutar: 850000, imzaTarihi: "2024-02-01", bitisTarihi: "2026-12-31", status: "aktif", projectId: "prj-001", tip: "Danışmanlık" },
  { id: "szl-005", title: "Sigorta Poliçesi — Tüm Riskler", firma: "Güvence Sig.", tutar: 420000, imzaTarihi: "2024-01-10", bitisTarihi: "2026-01-09", status: "aktif", projectId: "prj-001", tip: "Sigorta" },
];

// ============================
// BÜTÇE & MALİYET
// ============================
export const butceKalemleri = [
  { id: "btc-001", kategori: "İşçilik", alt: "Vasıflı İşçi", butce: 8500000, harcanan: 6200000, taahhut: 7800000, projectId: "prj-001" },
  { id: "btc-002", kategori: "İşçilik", alt: "Vasıfsız İşçi", butce: 3200000, harcanan: 2100000, taahhut: 2900000, projectId: "prj-001" },
  { id: "btc-003", kategori: "Malzeme", alt: "Beton", butce: 9500000, harcanan: 7800000, taahhut: 9000000, projectId: "prj-001" },
  { id: "btc-004", kategori: "Malzeme", alt: "Demir-Çelik", butce: 6800000, harcanan: 4200000, taahhut: 6500000, projectId: "prj-001" },
  { id: "btc-005", kategori: "Ekipman", alt: "Vinç Kiralama", butce: 2200000, harcanan: 1900000, taahhut: 2100000, projectId: "prj-001" },
  { id: "btc-006", kategori: "Ekipman", alt: "Kalıp Sistemi", butce: 1800000, harcanan: 1650000, taahhut: 1750000, projectId: "prj-001" },
  { id: "btc-007", kategori: "Taşeron", alt: "Elektrik", butce: 4500000, harcanan: 2100000, taahhut: 4200000, projectId: "prj-001" },
  { id: "btc-008", kategori: "Taşeron", alt: "Mekanik", butce: 3800000, harcanan: 1800000, taahhut: 3600000, projectId: "prj-001" },
  { id: "btc-009", kategori: "Genel Gider", alt: "Şantiye Masrafları", butce: 1200000, harcanan: 980000, taahhut: 1100000, projectId: "prj-001" },
  { id: "btc-010", kategori: "Genel Gider", alt: "Sigorta & İzinler", butce: 500000, harcanan: 500000, taahhut: 500000, projectId: "prj-001" },
];

export const aylikMaliyet = [
  { ay: "Oca", butce: 2.8, gercek: 2.6, tahmin: 2.8 },
  { ay: "Şub", butce: 3.2, gercek: 3.5, tahmin: 3.2 },
  { ay: "Mar", butce: 4.1, gercek: 3.9, tahmin: 4.0 },
  { ay: "Nis", butce: 4.5, gercek: 4.8, tahmin: 4.6 },
  { ay: "May", butce: 5.0, gercek: 4.6, tahmin: 4.8 },
  { ay: "Haz", butce: 5.2, gercek: 5.5, tahmin: 5.3 },
  { ay: "Tem", butce: 4.8, gercek: 5.1, tahmin: 5.0 },
  { ay: "Ağu", butce: 4.2, gercek: null, tahmin: 4.5 },
  { ay: "Eyl", butce: 3.8, gercek: null, tahmin: 4.1 },
];

// ============================
// ŞANTİYE GÜNLÜĞÜ
// ============================
export const santiyeGunlukleri = [
  { id: "sg-001", tarih: "2024-12-18", projectId: "prj-001", havaDurumu: "Güneşli", sicaklik: 12, personelSayisi: 138, ekipmanSayisi: 8, vardiya: "Gündüz", yapılanIsler: ["Kat-14 döşeme betonu döküldü", "Çelik kolon montajı tamamlandı", "İskele kontrol yapıldı"], sorunlar: ["Beton pompası 2 saat arızalı"], fotografSayisi: 12, olusturan: "Leyla Çetin" },
  { id: "sg-002", tarih: "2024-12-17", projectId: "prj-001", havaDurumu: "Bulutlu", sicaklik: 9, personelSayisi: 142, ekipmanSayisi: 9, vardiya: "Gündüz", yapılanIsler: ["Kat-13 kalıp söküldü", "Demir bağlama devam etti", "Güvenlik tatbikatı yapıldı"], sorunlar: [], fotografSayisi: 8, olusturan: "Leyla Çetin" },
  { id: "sg-003", tarih: "2024-12-16", projectId: "prj-001", havaDurumu: "Yağmurlu", sicaklik: 7, personelSayisi: 95, ekipmanSayisi: 5, vardiya: "Gündüz", yapılanIsler: ["Kapalı alanlarda iç sıva devam etti"], sorunlar: ["Hava koşulları nedeniyle dış çalışma durduruldu"], fotografSayisi: 4, olusturan: "Ahmet Kaya" },
  { id: "sg-004", tarih: "2024-12-15", projectId: "prj-001", havaDurumu: "Güneşli", sicaklik: 14, personelSayisi: 145, ekipmanSayisi: 10, vardiya: "Gündüz", yapılanIsler: ["Kat-14 demir bağlama tamamlandı", "Vinç bakımı yapıldı", "Malzeme teslimiyatı"], sorunlar: [], fotografSayisi: 15, olusturan: "Leyla Çetin" },
  { id: "sg-005", tarih: "2024-12-14", projectId: "prj-003", havaDurumu: "Kapalı", sicaklik: 8, personelSayisi: 312, ekipmanSayisi: 18, vardiya: "24 Saat", yapılanIsler: ["Tünel km 4.2-4.5 ilerlendi", "Ray döşeme devam etti", "Elektrik tesisatı"], sorunlar: ["Yeraltı su sızıntısı — kontrol altında"], fotografSayisi: 22, olusturan: "Mehmet Demir" },
];

// ============================
// METRAJ & KEŞİF
// ============================
export const metrajPozlari = [
  { id: "poz-001", pozNo: "23.001/1", tanim: "Hazır Beton C25/30 — Temel", birim: "m³", miktar: 1250, birimFiyat: 3200, tutar: 4000000, kategori: "Beton İşleri", projectId: "prj-001" },
  { id: "poz-002", pozNo: "23.001/2", tanim: "Hazır Beton C30/37 — Kolon-Kiriş", birim: "m³", miktar: 2840, birimFiyat: 3500, tutar: 9940000, kategori: "Beton İşleri", projectId: "prj-001" },
  { id: "poz-003", pozNo: "23.001/3", tanim: "Hazır Beton C25/30 — Döşeme", birim: "m³", miktar: 3200, birimFiyat: 3100, tutar: 9920000, kategori: "Beton İşleri", projectId: "prj-001" },
  { id: "poz-004", pozNo: "23.002/1", tanim: "S420 Beton Çeliği — Ø8-Ø32", birim: "ton", miktar: 420, birimFiyat: 32000, tutar: 13440000, kategori: "Demir İşleri", projectId: "prj-001" },
  { id: "poz-005", pozNo: "23.002/2", tanim: "Çelik Hasır — Q335", birim: "m²", miktar: 12500, birimFiyat: 185, tutar: 2312500, kategori: "Demir İşleri", projectId: "prj-001" },
  { id: "poz-006", pozNo: "23.003/1", tanim: "Tuğla Duvar — 19cm", birim: "m²", miktar: 18400, birimFiyat: 320, tutar: 5888000, kategori: "Kagir İşleri", projectId: "prj-001" },
  { id: "poz-007", pozNo: "23.003/2", tanim: "Gazbeton Blok — 20cm", birim: "m²", miktar: 6200, birimFiyat: 280, tutar: 1736000, kategori: "Kagir İşleri", projectId: "prj-001" },
  { id: "poz-008", pozNo: "23.004/1", tanim: "Tek Kat İç Sıva", birim: "m²", miktar: 42000, birimFiyat: 145, tutar: 6090000, kategori: "Sıva-Alçı", projectId: "prj-001" },
  { id: "poz-009", pozNo: "23.005/1", tanim: "Su Yalıtımı — Bitümlü Membran", birim: "m²", miktar: 8500, birimFiyat: 420, tutar: 3570000, kategori: "Yalıtım", projectId: "prj-001" },
  { id: "poz-010", pozNo: "23.006/1", tanim: "Granit Merdiven Basamağı", birim: "adet", miktar: 840, birimFiyat: 850, tutar: 714000, kategori: "Kaplama", projectId: "prj-001" },
];

// ============================
// ONAY MERKEZİ
// ============================
export const onaylar = [
  { id: "onay-001", tip: "hakediş", baslik: "Maslak 3. Hakediş — ₺9.5M", aciklama: "Çelik konstrüksiyon imalat bedeli", talipci: "Ahmet Kaya", tarih: "2024-12-15", oncelik: "yüksek", adimlar: ["Şantiye Şefi", "Proje Müdürü", "Mali İşler", "Genel Müdür"], mevcutAdim: 2, status: "beklemede", projectId: "prj-001" },
  { id: "onay-002", tip: "satınalma", baslik: "Demir Alımı — 150 ton", aciklama: "S420 inşaat demiri acil sipariş", talipci: "Leyla Çetin", tarih: "2024-12-17", oncelik: "kritik", adimlar: ["Şantiye Şefi", "Satınalma", "Mali İşler"], mevcutAdim: 1, status: "beklemede", projectId: "prj-001" },
  { id: "onay-003", tip: "sözleşme", baslik: "Dış Cephe Taşeron Sözleşmesi", aciklama: "Cephe A.Ş. ile ₺4.1M sözleşme", talipci: "Fatma Şahin", tarih: "2024-12-14", oncelik: "orta", adimlar: ["Hukuk", "Proje Müdürü", "Genel Müdür"], mevcutAdim: 1, status: "beklemede", projectId: "prj-001" },
  { id: "onay-004", tip: "hakediş", baslik: "Gebze 1. Hakediş — ₺1.2M", aciklama: "Zemin etüdü ve hazırlık işleri", talipci: "Emre Koç", tarih: "2024-12-10", oncelik: "orta", adimlar: ["Şantiye Şefi", "Proje Müdürü", "Mali İşler"], mevcutAdim: 2, status: "onaylandı", projectId: "prj-002" },
  { id: "onay-005", tip: "satınalma", baslik: "Tünel Segment — 24 adet", aciklama: "Tünel açılımı için segment alımı", talipci: "Selin Aydın", tarih: "2024-12-08", oncelik: "kritik", adimlar: ["Şantiye Şefi", "Satınalma", "Proje Müdürü", "Genel Müdür"], mevcutAdim: 4, status: "onaylandı", projectId: "prj-003" },
  { id: "onay-006", tip: "sözleşme", baslik: "Güvenlik Şirketi Sözleşmesi", aciklama: "12 aylık şantiye güvenlik hizmeti", talipci: "Zeynep Arslan", tarih: "2024-12-05", oncelik: "düşük", adimlar: ["Proje Müdürü", "Hukuk"], mevcutAdim: 0, status: "reddedildi", projectId: "prj-004" },
];

// ============================
// DOKÜMANLAR
// ============================
export const dokumanlar = [
  { id: "dok-001", ad: "Zemin Etüdü Raporu", kategori: "Teknik Rapor", versiyon: "v3.1", boyut: "4.2 MB", format: "PDF", yukleme: "2024-11-20", yukleyen: "Burak Yılmaz", projectId: "prj-001", durum: "onaylı", etiketler: ["zemin", "etüd", "temel"] },
  { id: "dok-002", ad: "Mimari Proje — Kat Planları", kategori: "Çizim", versiyon: "v5.0", boyut: "18.7 MB", format: "DWG", yukleme: "2024-10-15", yukleyen: "Ahmet Kaya", projectId: "prj-001", durum: "onaylı", etiketler: ["mimari", "kat planı"] },
  { id: "dok-003", ad: "Statik Proje Hesapları", kategori: "Teknik Rapor", versiyon: "v2.0", boyut: "6.1 MB", format: "PDF", yukleme: "2024-09-01", yukleyen: "Burak Yılmaz", projectId: "prj-001", durum: "onaylı", etiketler: ["statik", "hesap"] },
  { id: "dok-004", ad: "İnşaat Ruhsatı", kategori: "Resmi Belge", versiyon: "v1.0", boyut: "0.8 MB", format: "PDF", yukleme: "2024-01-08", yukleyen: "Ahmet Kaya", projectId: "prj-001", durum: "onaylı", etiketler: ["ruhsat", "resmi"] },
  { id: "dok-005", ad: "Şantiye Güvenlik Planı", kategori: "İSG", versiyon: "v4.2", boyut: "2.3 MB", format: "PDF", yukleme: "2024-12-01", yukleyen: "Leyla Çetin", projectId: "prj-001", durum: "revizyon", etiketler: ["isg", "güvenlik"] },
  { id: "dok-006", ad: "Tünel TBM Teknik Şartnamesi", kategori: "Teknik Rapor", versiyon: "v1.5", boyut: "9.4 MB", format: "PDF", yukleme: "2023-06-10", yukleyen: "Selin Aydın", projectId: "prj-003", durum: "onaylı", etiketler: ["tbm", "tünel", "şartname"] },
  { id: "dok-007", ad: "Malzeme Test Raporları — Beton", kategori: "Test Raporu", versiyon: "v12.0", boyut: "1.8 MB", format: "PDF", yukleme: "2024-12-10", yukleyen: "Burak Yılmaz", projectId: "prj-001", durum: "onaylı", etiketler: ["test", "beton", "kalite"] },
  { id: "dok-008", ad: "Çelik Konstrüksiyon Detayları", kategori: "Çizim", versiyon: "v2.3", boyut: "12.4 MB", format: "DWG", yukleme: "2024-10-20", yukleyen: "Burak Yılmaz", projectId: "prj-001", durum: "taslak", etiketler: ["çelik", "konstrüksiyon"] },
];

// ============================
// KALİTE KONTROL
// ============================
export const kaliteKontroller = [
  { id: "kk-001", baslik: "Beton Basınç Dayanım Testi", kategori: "Malzeme", projectId: "prj-001", tarih: "2024-12-15", sorumlu: "Burak Yılmaz", durum: "geçti", sonuc: "C35 → 38.2 MPa ✓", oncelik: "yüksek" },
  { id: "kk-002", baslik: "Demir Çapı ve Bindirme Kontrol", kategori: "İmalat", projectId: "prj-001", tarih: "2024-12-14", sorumlu: "Leyla Çetin", durum: "uygunsuz", sonuc: "Kat-13 kolonlarında yetersiz bindirme boyu", oncelik: "kritik" },
  { id: "kk-003", baslik: "Kalıp Düzlük ve Hizalama", kategori: "İmalat", projectId: "prj-001", tarih: "2024-12-13", sorumlu: "Leyla Çetin", durum: "geçti", sonuc: "Tolerans dahilinde ±5mm ✓", oncelik: "orta" },
  { id: "kk-004", baslik: "Su Yalıtım Tabaka Kontrolü", kategori: "Yalıtım", projectId: "prj-001", tarih: "2024-12-12", sorumlu: "Burak Yılmaz", durum: "beklemede", sonuc: null, oncelik: "yüksek" },
  { id: "kk-005", baslik: "Kaynak Dikişi UT Testi", kategori: "Çelik", projectId: "prj-001", tarih: "2024-12-10", sorumlu: "Burak Yılmaz", durum: "geçti", sonuc: "24/24 kaynak kabul edildi ✓", oncelik: "yüksek" },
  { id: "kk-006", baslik: "Tünel Segment Tolerans Ölçümü", kategori: "İmalat", projectId: "prj-003", tarih: "2024-12-08", sorumlu: "Selin Aydın", durum: "geçti", sonuc: "Ovalite ±8mm ✓", oncelik: "kritik" },
];

export const uygunsuzluklar = [
  { id: "uyu-001", baslik: "Kat-13 Demir Bindirme Boyu Yetersiz", kaynak: "kk-002", projectId: "prj-001", acilis: "2024-12-14", kapanisBeklenen: "2024-12-21", status: "açık", sorumlu: "Taşeron A", aksiyon: "Eksik demirlerin tamamlanması" },
  { id: "uyu-002", baslik: "Beton Yüzey Çatlağı — B Blok Bodrum", kaynak: null, projectId: "prj-001", acilis: "2024-12-01", kapanisBeklenen: "2024-12-15", status: "kapalı", sorumlu: "Burak Yılmaz", aksiyon: "Epoksi enjeksiyon tamamlandı" },
  { id: "uyu-003", baslik: "Güneybatı Cephe Ankraj Hizasızlığı", kaynak: null, projectId: "prj-001", acilis: "2024-11-28", kapanisBeklenen: "2024-12-10", status: "kapalı", sorumlu: "Leyla Çetin", aksiyon: "Düzeltme tamamlandı" },
];

// ============================
// İSG — İş Sağlığı & Güvenliği
// ============================
export const isgOlaylar = [
  { id: "isg-001", tip: "ramak-kala", baslik: "Yüksekte Çalışmada Güvensiz Durum", tarih: "2024-12-15", projectId: "prj-001", kategori: "Düşme Riski", agirlik: "orta", cozum: "Emniyet kemeri takılmadı, uyarı verildi", bildiren: "Leyla Çetin" },
  { id: "isg-002", tip: "kaza", baslik: "El Yaralanması — Kesik", tarih: "2024-12-08", projectId: "prj-001", kategori: "Kesici Alet", agirlik: "hafif", cozum: "İlk yardım uygulandı, rapor yazıldı", bildiren: "Leyla Çetin" },
  { id: "isg-003", tip: "ramak-kala", baslik: "Elektrik Çarpma Riski", tarih: "2024-11-25", projectId: "prj-003", kategori: "Elektrik", agirlik: "yüksek", cozum: "Hat izole edildi, elektrikçi uyarıldı", bildiren: "Oğuz Polat" },
  { id: "isg-004", tip: "denetim", baslik: "Aylık İSG Denetimi", tarih: "2024-12-01", projectId: "prj-001", kategori: "Denetim", agirlik: null, cozum: "12 madde incelendi, 3 aksiyon alındı", bildiren: "Ahmet Kaya" },
];

export const isgEgitimler = [
  { id: "eg-001", ad: "Yüksekte Çalışma Güvenliği", tarih: "2024-12-05", sure: 4, projectId: "prj-001", katilimcilar: ["per-001", "per-002", "per-003"], durum: "tamamlandı" },
  { id: "eg-002", ad: "İlk Yardım Sertifikası Yenileme", tarih: "2024-11-20", sure: 8, projectId: "prj-001", katilimcilar: ["per-001", "per-002"], durum: "tamamlandı" },
  { id: "eg-003", ad: "Elektrik Güvenliği", tarih: "2024-12-20", sure: 3, projectId: "prj-003", katilimcilar: ["per-008"], durum: "planlandı" },
  { id: "eg-004", ad: "Kazı Çalışmaları Güvenliği", tarih: "2025-01-10", sure: 4, projectId: "prj-002", katilimcilar: ["per-004", "per-005"], durum: "planlandı" },
];

export const riskMatrisi = [
  { olasilik: 3, siddet: 3, sayi: 2, baslik: "Yüksekte Çalışma" },
  { olasilik: 2, siddet: 3, sayi: 1, baslik: "Elektrik Riski" },
  { olasilik: 3, siddet: 2, sayi: 4, baslik: "Ergonomi" },
  { olasilik: 1, siddet: 3, sayi: 1, baslik: "Patlayıcı Gaz" },
  { olasilik: 2, siddet: 2, sayi: 3, baslik: "Toz / Gürültü" },
  { olasilik: 3, siddet: 1, sayi: 5, baslik: "Takılma / Düşme" },
];

// ============================
// SATIŞ MERKEZİ
// ============================
export const daireler = [
  { id: "d-101", blok: "A", kat: 1, no: "101", tip: "1+1", m2: 68, fiyat: 5200000, durum: "satıldı", musteri: "Zeynep Kara", tarih: "2024-08-15" },
  { id: "d-102", blok: "A", kat: 1, no: "102", tip: "2+1", m2: 95, fiyat: 7400000, durum: "rezerve", musteri: "Murat Aydın", tarih: "2024-12-01" },
  { id: "d-103", blok: "A", kat: 1, no: "103", tip: "3+1", m2: 138, fiyat: 10800000, durum: "boş", musteri: null, tarih: null },
  { id: "d-201", blok: "A", kat: 2, no: "201", tip: "1+1", m2: 68, fiyat: 5400000, durum: "satıldı", musteri: "Ali Demir", tarih: "2024-09-20" },
  { id: "d-202", blok: "A", kat: 2, no: "202", tip: "2+1", m2: 95, fiyat: 7600000, durum: "boş", musteri: null, tarih: null },
  { id: "d-203", blok: "A", kat: 2, no: "203", tip: "3+1", m2: 138, fiyat: 11000000, durum: "boş", musteri: null, tarih: null },
  { id: "d-301", blok: "B", kat: 3, no: "301", tip: "2+1", m2: 98, fiyat: 8200000, durum: "satıldı", musteri: "Fatma Doğan", tarih: "2024-10-05" },
  { id: "d-302", blok: "B", kat: 3, no: "302", tip: "2+1", m2: 98, fiyat: 8200000, durum: "rezerve", musteri: "Hasan Kılıç", tarih: "2024-12-10" },
  { id: "d-303", blok: "B", kat: 3, no: "303", tip: "4+1", m2: 178, fiyat: 14500000, durum: "boş", musteri: null, tarih: null },
  { id: "d-401", blok: "B", kat: 4, no: "401", tip: "2+1", m2: 100, fiyat: 8500000, durum: "satıldı", musteri: "Seda Yıldız", tarih: "2024-07-18" },
  { id: "d-402", blok: "B", kat: 4, no: "402", tip: "3+1", m2: 142, fiyat: 12000000, durum: "boş", musteri: null, tarih: null },
  { id: "d-403", blok: "B", kat: 4, no: "403", tip: "4+1 Penthouse", m2: 220, fiyat: 22000000, durum: "rezerve", musteri: "İbrahim Çelik", tarih: "2024-11-30" },
];

export const musteriler = [
  { id: "mst-001", ad: "Zeynep Kara", telefon: "+90 532 111 22 33", email: "zeynep@mail.com", daire: "d-101", odeme: "peşin", tahsilat: 5200000, kalan: 0 },
  { id: "mst-002", ad: "Murat Aydın", telefon: "+90 533 222 33 44", email: "murat@mail.com", daire: "d-102", odeme: "taksit", tahsilat: 1850000, kalan: 5550000 },
  { id: "mst-003", ad: "Ali Demir", telefon: "+90 534 333 44 55", email: "ali@mail.com", daire: "d-201", odeme: "banka", tahsilat: 5400000, kalan: 0 },
  { id: "mst-004", ad: "Fatma Doğan", telefon: "+90 535 444 55 66", email: "fatma@mail.com", daire: "d-301", odeme: "taksit", tahsilat: 4100000, kalan: 4100000 },
];

// ============================
// MESAJLAŞMA
// ============================
export const mesajKanallari = [
  { id: "k-001", ad: "🏗️ Genel", tip: "genel", projectId: null, uyeSayisi: 12, sonMesaj: "2 dak önce" },
  { id: "k-002", ad: "📋 Maslak Rezidans", tip: "proje", projectId: "prj-001", uyeSayisi: 6, sonMesaj: "5 dak önce" },
  { id: "k-003", ad: "🚇 Ankara Metro", tip: "proje", projectId: "prj-003", uyeSayisi: 8, sonMesaj: "1 saat önce" },
  { id: "k-004", ad: "💰 Finans & Hakediş", tip: "departman", projectId: null, uyeSayisi: 4, sonMesaj: "Dün" },
  { id: "k-005", ad: "⚠️ İSG Uyarıları", tip: "departman", projectId: null, uyeSayisi: 12, sonMesaj: "3 saat önce" },
  { id: "k-006", ad: "📦 Satınalma", tip: "departman", projectId: null, uyeSayisi: 5, sonMesaj: "2 gün önce" },
];

export const mesajlar = {
  "k-001": [
    { id: "m-001", kanalId: "k-001", gonderen: "Ahmet Kaya", avatar: "AK", icerik: "Bugünkü toplantı saat 14:00'te başlıyor. Tüm proje müdürleri katılmalı.", zaman: "10:30", benim: false, renk: "#00D4FF" },
    { id: "m-002", kanalId: "k-001", gonderen: "Fatma Şahin", avatar: "FŞ", icerik: "Gebze projesinden katılacağım.", zaman: "10:32", benim: false, renk: "#7B2FFF" },
    { id: "m-003", kanalId: "k-001", gonderen: "Mete K.", avatar: "MK", icerik: "Gündem maddelerine bakabilir miyim?", zaman: "10:35", benim: true, renk: "#00D4FF" },
    { id: "m-004", kanalId: "k-001", gonderen: "Ahmet Kaya", avatar: "AK", icerik: "1. Hakediş onayları\n2. Q1 bütçe revizyonu\n3. İSG raporu", zaman: "10:36", benim: false, renk: "#00D4FF" },
    { id: "m-005", kanalId: "k-001", gonderen: "Mehmet Demir", avatar: "MD", icerik: "Metro hattında önemli bir gelişme var, toplantıda paylaşacağım 🚇", zaman: "10:45", benim: false, renk: "#FF6B35" },
    { id: "m-006", kanalId: "k-001", gonderen: "Mete K.", avatar: "MK", icerik: "Harika, bekliyoruz!", zaman: "10:46", benim: true, renk: "#00D4FF" },
  ],
  "k-002": [
    { id: "m-010", kanalId: "k-002", gonderen: "Leyla Çetin", avatar: "LÇ", icerik: "Kat-14 dökümü başarıyla tamamlandı! 💪", zaman: "09:15", benim: false, renk: "#00FFB3" },
    { id: "m-011", kanalId: "k-002", gonderen: "Burak Yılmaz", avatar: "BY", icerik: "Beton numuneleri alındı, sonuçlar yarın.", zaman: "09:20", benim: false, renk: "#7B2FFF" },
    { id: "m-012", kanalId: "k-002", gonderen: "Mete K.", avatar: "MK", icerik: "Demir teslimatı onaylandi mı?", zaman: "09:45", benim: true, renk: "#00D4FF" },
    { id: "m-013", kanalId: "k-002", gonderen: "Leyla Çetin", avatar: "LÇ", icerik: "Evet, 150 ton demir yarın öğlen teslim ediliyor.", zaman: "09:47", benim: false, renk: "#00FFB3" },
  ],
};

// ============================
// KÜTÜPHANE
// ============================
export const birimFiyatlar = [
  { id: "bf-001", pozNo: "Y.22.001", tanim: "Beton Demiri — Bükülerek Yerine Konulmuş S420", birim: "ton", fiyat: 32500, kategori: "Demir İşleri", kaynak: "Birim Fiyat 2024", guncel: true },
  { id: "bf-002", pozNo: "Y.21.001", tanim: "Hazır Beton Dökülmesi — C25/30", birim: "m³", fiyat: 3200, kategori: "Beton İşleri", kaynak: "Birim Fiyat 2024", guncel: true },
  { id: "bf-003", pozNo: "Y.21.002", tanim: "Hazır Beton Dökülmesi — C30/37", birim: "m³", fiyat: 3500, kategori: "Beton İşleri", kaynak: "Birim Fiyat 2024", guncel: true },
  { id: "bf-004", pozNo: "Y.16.001", tanim: "Tuğla Duvar — 19cm Boşluklu", birim: "m²", fiyat: 320, kategori: "Kagir İşleri", kaynak: "Birim Fiyat 2024", guncel: true },
  { id: "bf-005", pozNo: "Y.23.001", tanim: "Kalıp — Ahşap Panelli", birim: "m²", fiyat: 285, kategori: "Kalıp İşleri", kaynak: "Birim Fiyat 2024", guncel: true },
  { id: "bf-006", pozNo: "Y.08.001", tanim: "Kazı — Makine ile Gevşek Zemin", birim: "m³", fiyat: 185, kategori: "Toprak İşleri", kaynak: "Birim Fiyat 2024", guncel: true },
  { id: "bf-007", pozNo: "Y.41.001", tanim: "Bitümlü Membran Su Yalıtımı — 4mm", birim: "m²", fiyat: 420, kategori: "Yalıtım", kaynak: "Birim Fiyat 2024", guncel: true },
  { id: "bf-008", pozNo: "Y.52.001", tanim: "Granit Kaplama — 3cm", birim: "m²", fiyat: 850, kategori: "Kaplama", kaynak: "Birim Fiyat 2024", guncel: true },
];

export const sablonlar = [
  { id: "sb-001", ad: "Konut Projesi Metraj Şablonu", kategori: "Metraj", kullanim: 234, guncelleme: "2024-10", aciklama: "Standart konut projesi için hazır poz listesi" },
  { id: "sb-002", ad: "Hakediş Raporu Şablonu", kategori: "Hakediş", kullanim: 412, guncelleme: "2024-11", aciklama: "Kamu ihalelerine uygun hakediş raporu formatı" },
  { id: "sb-003", ad: "Şantiye Günlüğü Formu", kategori: "Saha", kullanim: 189, guncelleme: "2024-09", aciklama: "Günlük saha kaydı ve personel puantaj formu" },
  { id: "sb-004", ad: "İSG Risk Değerlendirme Formu", kategori: "İSG", kullanim: 156, guncelleme: "2024-10", aciklama: "5x5 risk matrisi ile detaylı tehlike analizi" },
  { id: "sb-005", ad: "Kalite Kontrol Checklist", kategori: "Kalite", kullanim: 98, guncelleme: "2024-08", aciklama: "Beton, demir, kalıp kontrol listeleri" },
  { id: "sb-006", ad: "Taşeron Sözleşme Şablonu", kategori: "Sözleşme", kullanim: 67, guncelleme: "2024-11", aciklama: "KİK uyumlu taşeron iş sözleşmesi" },
];

// ============================
// GANTT TASKS (SÜREÇ & PLANLAMA)
// ============================
export const ganttTasks = [
  { id: "t-001", projectId: "prj-001", name: "Zemin Etüdü ve Hafriyat", start: "2024-05-01", end: "2024-05-20", progress: 100, assignee: "per-002", status: "tamamlandı", color: "#34d399", dependencies: [] },
  { id: "t-002", projectId: "prj-001", name: "Temel Beton Dökümü", start: "2024-05-22", end: "2024-06-10", progress: 100, assignee: "per-003", status: "tamamlandı", color: "#34d399", dependencies: ["t-001"] },
  { id: "t-003", projectId: "prj-001", name: "Karkas ve Kolon İmalatı (1-5 Katlar)", start: "2024-06-15", end: "2024-08-30", progress: 60, assignee: "per-003", status: "devam-ediyor", color: "#3b82f6", dependencies: ["t-002"] },
  { id: "t-004", projectId: "prj-001", name: "Dış Cephe Kaplama", start: "2024-08-15", end: "2024-10-30", progress: 15, assignee: "per-001", status: "devam-ediyor", color: "#3b82f6", dependencies: ["t-003"] },
  { id: "t-005", projectId: "prj-001", name: "İnce İşçilik (Elektrik/Su/Alçıpan)", start: "2024-09-01", end: "2024-11-20", progress: 0, assignee: "per-002", status: "bekliyor", color: "#818cf8", dependencies: ["t-003"] },
  { id: "t-006", projectId: "prj-001", name: "Peyzaj ve Çevre Düzenlemesi", start: "2024-11-01", end: "2024-12-15", progress: 0, assignee: "per-001", status: "bekliyor", color: "#fb923c", dependencies: ["t-004", "t-005"] },
];
