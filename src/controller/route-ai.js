import config from '../config.js';
import * as aiFunctions from './function-ai.js';

export const process = async (req, res) => {
  try {
    const engine = req.params.engine;
    const { text, logic, url, lang } = req.query;

    if (!engine || typeof engine !== 'string' || engine.trim() === '') {
      return res.status(400).json({ error: "Parameter 'engine' harus berupa string dan tidak boleh kosong." });
    }

    const availableEngines = Object.keys(aiFunctions);

    if (!availableEngines.includes(engine)) {
      return res.status(400).json({
        error: `Jenis AI yang diminta tidak valid. List yang tersedia: ${availableEngines.join(', ')}`
      });
    }
    
    // untuk removebg
    if (engine === 'removebg') {
      if (!url || typeof url !== 'string' || url.trim() === '') {
        return res.status(400).json({ error: "Parameter 'url' harus berupa string dan tidak boleh kosong." });
      }
    
      try {
        const imageBuffer = await aiFunctions.removebg(url.trim());
        res.set('Content-Type', 'image/png'); 
        res.send(imageBuffer); 
      } catch (error) {
        return res.status(500).json({
          error: "Gagal memproses gambar.",
          details: error.message,
        });
      }
    }
    
    // untuk googletts
    if (engine === 'googletts') { 
      if (!text || typeof text !== 'string' || text.trim() === '') {
        return res.status(400).json({ error: "Parameter 'text' harus berupa string dan tidak boleh kosong." });
      }

      const language = lang || 'id';
      try {
        const audioBuffer = await aiFunctions.googletts(text, language); 
        res.set('Content-Type', 'audio/wav'); 
        res.send(audioBuffer);
      } catch (error) {
        return res.status(500).json({
          error: "Gagal memproses audio.",
          details: error.message,
        });
      }
    }
    
    // ai text
    if (!text || typeof text !== 'string' || text.trim() === '') {
      return res.status(400).json({ error: "Parameter 'text' harus berupa string dan tidak boleh kosong." });
    }
    const aiFunction = aiFunctions[engine];
    const logicToUse = logic || config.defaultLogic; 
    const modelToUse = req.query.model || config.defaultModel; 

    const result = await aiFunction(text, logicToUse, modelToUse);
    return res.json({
      success: true,
      data: result.data,
      metadata: result.metadata || {},
    }); 

  } catch (err) {
    console.error('Error processing request:', err);
    res.status(500).json({ error: "Terjadi kesalahan server." });
  }
};
      
