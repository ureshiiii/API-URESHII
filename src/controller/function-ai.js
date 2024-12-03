import { GoogleGenerativeAI } from '@google/generative-ai';
import fetch from 'node-fetch'
import config from '../config.js';
import axios from 'axios';
import FormData from 'form-data';
import mime from 'mime-types';

const createSuccessResponse = (data, modelUsed, logicUsed) => ({
  success: true,
  creator: "Parhan cina",
  data,
  metadata: {
    modelUsed,
    logicUsed: logicUsed || config.defaultLogic,
    length: data.length,
  },
});

async function callAPI(url, method, data, headers) {
  try {
    const response = await axios({
      url,
      method,
      data,
      headers
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("API Error:", error.response.status, error.response.data);
      throw new Error(`API Error: ${error.response.status} - ${error.response.data}`);
    } else if (error.request) {
      console.error("API Error:", error.request);
      throw new Error(`API Error: No response received`);
    } else {
      console.error('API Error:', error.message);
      throw new Error(`API Error: ${error.message}`);
    }
  }
}

async function blackbox(text, logic, model) {
  try {
    const prompt = `${logic ? `${logic}\n` : ''}${text}`;
    const url = 'https://api.blackbox.ai/api/chat';
    const data = {
      "messages": [{ "role": "user", "content": prompt, "id": "QgaYVnl" }],
      "id": "ugrC6k4",
      "previewToken": null,
      "userId": null,
      "codeModelMode": true,
      "agentMode": {},
      "trendingAgentMode": {},
      "isMicMode": false,
      "userSystemPrompt": null,
      "maxTokens": 1024,
      "playgroundTopP": 0.9,
      "playgroundTemperature": 0.5,
      "isChromeExt": false,
      "githubToken": "",
      "clickedAnswer2": false,
      "clickedAnswer3": false,
      "clickedForceWebSearch": false,
      "visitFromDelta": false,
      "mobileClient": false,
      "userSelectedModel": null,
      "validated": "00f37b34-a166-4efb-bce5-1312d87f2f94"
    };
    const headers = { 'Content-Type': 'application/json' };
    const result = await callAPI(url, 'POST', data, headers);
    const cleanedResult = result.replace("Generated by BLACKBOX.AI, try unlimited chat https://www.blackbox.ai", "").trim();
    return createSuccessResponse(cleanedResult, model || "Blackbox", logic); 
  } catch (error) {
    console.error('Error processing with Blackbox:', error);
    throw new Error(`Blackbox Error: ${error.message}`);
  }
}

async function gemini(text, logic, model) {
  try {
    const usedApiKey = process.env.GOOGLE_API_KEY;
    const genAI = new GoogleGenerativeAI(usedApiKey);
    const systemLogic = logic || config.defaultLogic;
    const modell = genAI.getGenerativeModel({
      model: model || config.defaultModel,
      systemInstruction: systemLogic,
    });
    const resultp = await modell.generateContent(text);
    if (!resultp.response || !resultp.response.candidates || resultp.response.candidates.length === 0) {
      throw new Error("Respons dari layanan AI tidak valid. Mungkin API Gemini sedang down");
    }
    const responseText = resultp.response.candidates[0]?.content?.parts?.[0]?.text?.trimEnd() || "";
    return createSuccessResponse(responseText, model || config.defaultModel, logic);
  } catch (err) {
    console.error('Error processing with Gemini:', err);
    throw new Error(`Gemini Error: ${err.message}`);
  }
}

async function removebg(imageURL) {
  try {
    const imageResponse = await axios.get(imageURL, { responseType: 'arraybuffer' });
    const mimeType = mime.lookup(imageURL) || 'image/jpeg';
    const imageBuffer = Buffer.from(imageResponse.data);

    const formData = new FormData();
    formData.append('size', 'auto');
    formData.append('image_file', imageBuffer, {
      filename: 'upload.jpg',
      contentType: mimeType
    });

    const response = await fetch("https://api.remove.bg/v1.0/removebg", {
        method: "POST",
        headers: { "X-Api-Key": "SgEo63fvZ7XaBWbbc3J925Hd" },
        body: formData,
    });
    if (response.status === 200) { 
      return Buffer.from(await response.data); 
    } else {
      const errorDetails = await response.data;
      throw new Error(`Remove.bg API Error: ${response.status} - ${errorDetails}`);
    }
  } catch (error) {
    console.error('Error in removebg:', error);
    throw new Error(`Remove BG Error: ${error.message}`);
  }
}

export {
  blackbox,
  gemini,
  removebg,
};
