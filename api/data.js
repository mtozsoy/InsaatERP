import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  try {
    const sql = neon(process.env.DATABASE_URL);
    
    // collection_type is essential for routing
    const type = req.query.type;
    const id = req.query.id;

    if (req.method === 'GET') {
      if (!type) {
        const records = await sql`SELECT collection_type, data FROM erp_collections ORDER BY created_at ASC`;
        const grouped = {};
        records.forEach(r => {
           if(!grouped[r.collection_type]) grouped[r.collection_type] = [];
           grouped[r.collection_type].push(r.data);
        });
        return res.status(200).json(grouped);
      }
      
      const records = await sql`
        SELECT data FROM erp_collections 
        WHERE collection_type = ${type}
        ORDER BY created_at DESC
      `;
      // Veritabanındaki 'data' objelerini dönüyoruz
      const items = records.map(r => r.data);
      return res.status(200).json(items);
    } 
    
    else if (req.method === 'POST') {
      if (!type) return res.status(400).json({ error: 'type parametresi gerekli' });
      
      const payload = req.body;
      const recordId = payload.id || `${type}-${Date.now()}`;
      
      // Gelen datanın içine id'yi de enjekte edelim ki frontend her zaman id'yi bulabilsin
      const dataToSave = { ...payload, id: recordId };

      await sql`
        INSERT INTO erp_collections (id, collection_type, data) 
        VALUES (${recordId}, ${type}, ${dataToSave}::jsonb)
      `;
      return res.status(201).json(dataToSave);
    }
    
    else if (req.method === 'PUT') {
      if (!id) return res.status(400).json({ error: 'id parametresi gerekli (?id=...)' });
      
      const payload = req.body;
      const dataToSave = { ...payload, id }; // id değişmesin

      await sql`
        UPDATE erp_collections 
        SET data = ${dataToSave}::jsonb
        WHERE id = ${id}
      `;
      return res.status(200).json(dataToSave);
    }

    else if (req.method === 'DELETE') {
      if (!id) return res.status(400).json({ error: 'id parametresi gerekli (?id=...)' });

      await sql`
        DELETE FROM erp_collections WHERE id = ${id}
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
