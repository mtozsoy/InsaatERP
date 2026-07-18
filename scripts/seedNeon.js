import { neon } from '@neondatabase/serverless';
import 'dotenv/config';
import { projects } from '../src/data/mockData.js';

const sql = neon(process.env.DATABASE_URL);

async function seed() {
  console.log("Tablolar oluşturuluyor...");
  
  await sql`
    CREATE TABLE IF NOT EXISTS projects (
      id VARCHAR(255) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      code VARCHAR(50),
      status VARCHAR(50),
      progress INTEGER DEFAULT 0,
      budget NUMERIC DEFAULT 0,
      spent NUMERIC DEFAULT 0,
      "startDate" VARCHAR(50),
      "endDate" VARCHAR(50),
      location VARCHAR(255),
      manager VARCHAR(255),
      workers INTEGER DEFAULT 0,
      category VARCHAR(100),
      color VARCHAR(50),
      phase VARCHAR(100),
      priority VARCHAR(50)
    );
  `;
  console.log("Tablo oluşturuldu.");

  // Opsiyonel: Mevcut projeleri temizle
  await sql`DELETE FROM projects`;

  console.log(`${projects.length} adet proje ekleniyor...`);
  
  for (const p of projects) {
    await sql`
      INSERT INTO projects (
        id, name, code, status, progress, budget, spent, "startDate", "endDate", 
        location, manager, workers, category, color, phase, priority
      ) VALUES (
        ${p.id || `prj-${Date.now()}`}, ${p.name || ''}, ${p.code || ''}, ${p.status || 'planlama'}, 
        ${p.progress || 0}, ${p.budget || 0}, ${p.spent || 0}, ${p.startDate || ''}, 
        ${p.endDate || ''}, ${p.location || ''}, ${p.manager || ''}, ${p.workers || 0}, 
        ${p.category || ''}, ${p.color || '#3b82f6'}, ${p.phase || ''}, ${p.priority || 'orta'}
      )
    `;
  }
  
  console.log("Veri aktarımı başarıyla tamamlandı! 🚀");
}

seed().catch(err => {
  console.error("Veri aktarım hatası:", err);
  process.exit(1);
});
