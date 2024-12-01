const { GoogleGenerativeAI } = require('@google/generative-ai');
const config = require('../config');

exports.gemini = async (req, res) => {
  try {
    const { text, logic } = req.query;
    const Used_Apikey = process.env.GOOGLE_API_KEY;
        
    if (!text || typeof text !== 'string' || text.trim() === '') {
      return res.status(400).send("Parameter 'text' harus berupa string dan tidak boleh kosong.");
    }

    const genAI = new GoogleGenerativeAI(Used_Apikey);
    const systemLogic = logic || config.defaultLogic;
    const modell = genAI.getGenerativeModel({
      model: config.defaultModel,
      systemInstruction: systemLogic,
    });
    const resultp = await modell.generateContent(text);

    if (!resultp.response || !resultp.response.candidates || resultp.response.candidates.length === 0) {
      return res.status(500).send("Respons dari layanan AI tidak valid.");
    }
    
    const responseText = resultp.response.candidates[0]?.content?.parts?.[0]?.text?.trimEnd() || "";
    res.send(responseText);
  } catch (err) {
    console.error('Error processing text:', err);
    res.status(500).send("Terjadi kesalahan server.");
  }
};
      
