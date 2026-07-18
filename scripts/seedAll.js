import { neon } from '@neondatabase/serverless';
import 'dotenv/config';

import {
  hakedisler, personnel, materials, kpiData, activities,
  butceKalemleri, ihaleler, teklifler, sozlesmeler,
  santiyeGunlukleri, metrajPozlari, onaylar, dokumanlar,
  kaliteKontroller, uygunsuzluklar, isgOlaylar, isgEgitimler,
  riskMatrisi, daireler, musteriler, birimFiyatlar, sablonlar,
  mesajKanallari, ganttTasks
} from '../src/data/mockData.js';

const sql = neon(process.env.DATABASE_URL);

const fleetList = [
  { id: 'f1', plaka: '34 XYZ 123', marka: 'Ford', model: 'Transit', surucu: 'Ahmet Yılmaz', durum: 'Aktif', yakit: 'Yarım Depo', konum: 'Şantiye A' },
  { id: 'f2', plaka: '34 ABC 456', marka: 'JCB', model: 'Bekoloder', surucu: 'Mehmet Demir', durum: 'Bakımda', yakit: 'Boş', konum: 'Kademe' },
  { id: 'f3', plaka: '06 KML 89', marka: 'Volvo', model: 'Ekskavatör', surucu: 'Can Kaya', durum: 'Aktif', yakit: 'Tam Depo', konum: 'Şantiye B' }
];

const maintenanceList = [
  { id: 'm1', plaka: '34 ABC 456', tip: 'Periyodik (10.000 Saat)', durum: 'Devam Ediyor', tarih: '2024-05-15', maliyet: '12.500 ₺' },
  { id: 'm2', plaka: '34 XYZ 123', tip: 'Fren Balata Değişimi', durum: 'Planlandı', tarih: '2024-05-20', maliyet: '3.200 ₺' }
];

const allCollections = {
  hakedisler, personnel, materials, activities,
  butceKalemleri, ihaleler, teklifler, sozlesmeler,
  santiyeGunlukleri, metrajPozlari, onaylar, dokumanlar,
  kaliteKontroller, uygunsuzluklar, isgOlaylar, isgEgitimler,
  riskMatrisi, daireler, musteriler, birimFiyatlar, sablonlar,
  mesajKanallari, ganttTasks,
  fleetList, maintenanceList
};

async function seed() {
  console.log("JSONB tablosu oluşturuluyor (erp_collections)...");
  
  await sql`
    CREATE TABLE IF NOT EXISTS erp_collections (
      id VARCHAR(255) PRIMARY KEY,
      collection_type VARCHAR(100) NOT NULL,
      data JSONB NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  await sql`DELETE FROM erp_collections`;
  console.log("Tüm modüller Neon veritabanına JSONB olarak aktarılıyor...");

  let totalItems = 0;

  for (const [collectionName, dataArray] of Object.entries(allCollections)) {
    if (Array.isArray(dataArray)) {
      for (const item of dataArray) {
        const recordId = item.id || `${collectionName}-${Date.now()}-${Math.random()}`;
        const dataToSave = { ...item, id: recordId };

        await sql`
          INSERT INTO erp_collections (id, collection_type, data)
          VALUES (${recordId}, ${collectionName}, ${dataToSave}::jsonb)
        `;
        totalItems++;
      }
      console.log(`- ${collectionName}: ${dataArray.length} adet eklendi.`);
    }
  }

  if (kpiData) {
    await sql`
      INSERT INTO erp_collections (id, collection_type, data)
      VALUES ('kpi-main', 'kpiData', ${kpiData}::jsonb)
    `;
    totalItems++;
    console.log(`- kpiData: Obje eklendi.`);
  }

  console.log(`✅ Süper Seed Tamamlandı! Toplam ${totalItems} adet kayıt veritabanına JSONB olarak eklendi.`);
}

seed().catch(err => {
  console.error("Super Seed Hatası:", err);
  process.exit(1);
});
