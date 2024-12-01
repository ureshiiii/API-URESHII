const { GoogleGenerativeAI } = require('@google/generative-ai');
const config = require('../config');

exports.scrapeData = async (req, res) => {
  try {
    const { text, logic } = req.query;
    const Used_Apikey = process.env.GOOGLE_API_KEY;
    
    if (!text || typeof text !== 'string' || text.trim() === '') {
      return res.status(400).json({ error: "Parameter 'text' harus berupa string dan tidak boleh kosong." });
    }
    if (!Used_Apikey) {
      return res.status(400).json({ error: "API Key tidak ditemukan. Pastikan variabel 'GOOGLE_API_KEY' telah diatur di .env." });
    }

    const genAI = new GoogleGenerativeAI(Used_Apikey);
    const systemLogic = logic || config.defaultLogic;
    const modell = genAI.getGenerativeModel({
      model: config.defaultModel,
      systemInstruction: systemLogic,
    });

    const resultp = await modell.generateContent(text);

    if (!resultp.response || !resultp.response.candidates || resultp.response.candidates.length === 0) {
      return res.status(400).json({ error: "Respons dari layanan AI tidak valid." });
    }

    const responseText = resultp.response.candidates[0]?.content?.parts?.[0]?.text?.trimEnd() || "";

    res.json({
      success: true,
      data: responseText,
      metadata: {
        modelUsed: config.defaultModel,
        logicUsed: systemLogic,
        length: responseText.length,
      },
    });
  } catch (err) {
    console.error('Error processing text:', err);

    if (err.message.includes('API key not valid')) {
      return res.status(401).json({ error: "API Key tidak valid." }); 
    } else if (err.message.includes('Request failed with status code')) {
      return res.status(400).json({ 
        error: "Request ke layanan AI gagal.",
        details: { message: err.message }
      });
    } else {
      return res.status(500).json({ 
        error: "Terjadi kesalahan server.",
        details: { message: err.message }
      });
    }
  }
};
