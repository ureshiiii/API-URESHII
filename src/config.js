export default {
  // DB SQL
  dbConfig: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
  },
  // GEMINI AI
  defaultModel: "gemini-1.5-flash-8b-latest",
  defaultLogic: "Kamu dibuat oleh farhan",
  // SYSTEM
  API_KEY: process.env.API_KEY || "lovefirsha",
  allowedOrigins: ["https://www.ureshii.my.id", "https://api.ureshii.my.id"]
};
