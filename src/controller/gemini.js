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
      return res.status(500).json({ error: "API Key tidak ditemukan. Pastikan variabel 'GOOGLE_API_KEY' telah diatur di .env." });
    }

    const genAI = new GoogleGenerativeAI(Used_Apikey);
    const systemLogic = logic || config.defaultLogic;
    const modell = genAI.getGenerativeModel({
      model: config.defaultModel,
      systemInstruction: systemLogic,
    });

    const resultp = await modell.generateContent(text);

    if (!resultp.response || !resultp.response.candidates || resultp.response.candidates.length === 0) {
      return res.status(500).json({ error: "Respons dari layanan AI tidak valid." });
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

    res.status(500).json({
      error: "Terjadi kesalahan server.",
      detail: err.message,
    });
  }
};
  
