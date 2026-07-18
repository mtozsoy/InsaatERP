import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  try {
    const sql = neon(process.env.DATABASE_URL);
    
    if (req.method === 'GET') {
      const projects = await sql`SELECT * FROM projects ORDER BY "startDate" DESC`;
      return res.status(200).json(projects);
    } 
    
    else if (req.method === 'POST') {
      const p = req.body;
      const id = p.id || `prj-${Date.now()}`;
      await sql`
        INSERT INTO projects (
          id, name, code, status, progress, budget, spent, "startDate", "endDate", 
          location, manager, workers, category, color, phase, priority
        ) VALUES (
          ${id}, ${p.name || ''}, ${p.code || ''}, ${p.status || 'planlama'}, 
          ${p.progress || 0}, ${p.budget || 0}, ${p.spent || 0}, ${p.startDate || ''}, 
          ${p.endDate || ''}, ${p.location || ''}, ${p.manager || ''}, ${p.workers || 0}, 
          ${p.category || ''}, ${p.color || '#3b82f6'}, ${p.phase || ''}, ${p.priority || 'orta'}
        )
      `;
      return res.status(201).json({ success: true, id });
    }
    
    else if (req.method === 'PUT') {
      const { id, ...p } = req.body;
      if (!id) return res.status(400).json({ error: 'ID gerekli' });
      
      await sql`
        UPDATE projects SET
          name = ${p.name || ''},
          status = ${p.status || 'planlama'},
          progress = ${p.progress || 0},
          budget = ${p.budget || 0},
          location = ${p.location || ''},
          manager = ${p.manager || ''},
          workers = ${p.workers || 0},
          "startDate" = ${p.startDate || ''},
          "endDate" = ${p.endDate || ''},
          priority = ${p.priority || 'orta'}
        WHERE id = ${id}
      `;
      return res.status(200).json({ success: true });
    }
    
    else {
      return res.status(405).json({ error: 'Method Not Allowed' });
    }
  } catch (error) {
    console.error("API Hatası:", error);
    return res.status(500).json({ error: error.message });
  }
}
