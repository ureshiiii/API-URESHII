import config from '../config.js';
import * as aiFunctions from './fungsi-ai.js';

export const process = async (req, res) => {
  try {
    const engine = req.params.engine;
    const { text, logic, url } = req.query;

    if (!engine || typeof engine !== 'string' || engine.trim() === '') {
      return res.status(400).json({ error: "Parameter 'engine' harus berupa string dan tidak boleh kosong." });
    }

    const availableEngines = Object.keys(aiFunctions);

    if (!availableEngines.includes(engine)) {
      return res.status(400).json({
        error: `Input jenis ai di Parameter dengan benar!. List: ${availableEngines.join(', ')}`
      });
    }
    
    if (engine === 'removebg') {
      if (!url || typeof url !== 'string' || url.trim() === '') {
        return res.status(400).json({ error: "Parameter 'url' harus berupa string dan tidak boleh kosong." });
      }
    
      try {
        const cdnUrl = await aiFunctions.removebg(url.trim());
        return res.json({ success: true, data: { url: cdnUrl } });
      } catch (error) {
        return res.status(500).json({
          error: "Gagal memproses gambar.",
          details: error.message,
        });
      }
    }
    
    if (!text || typeof text !== 'string' || text.trim() === '') {
      return res.status(400).json({ error: "Parameter 'text' harus berupa string dan tidak boleh kosong." });
    }

    const aiFunction = aiFunctions[engine];
    const logicToUse = logic || config.defaultLogic; 
    const modelToUse = req.query.model || config.defaultModel; 
    const result = await aiFunction(text, logicToUse, modelToUse);
    return res.json({ success: true, data: result }); 

  } catch (err) {
    console.error('Error processing request:', err);
    res.status(500).json({ error: "Terjadi kesalahan server." });
  }
};
