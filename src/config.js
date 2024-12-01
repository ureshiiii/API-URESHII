module.exports = {
  // DB SQL
  dbConfig: {
    host: process.env.DB_HOST || "sql12.freemysqlhosting.net",
    user: process.env.DB_USER || "sql12748811",
    password: process.env.DB_PASS || "Yy4ZX9LqDI",
    database: process.env.DB_NAME || "sql12748811",
  },
  // GEMINI AI
  defaultModel: "gemini-1.5-flash-8b-latest",
  defaultLogic: "Kamu dibuat oleh farhan",
  
  // SYSTEM
  API_KEY: process.env.API_KEY || "lovefirsha",
  allowedOrigins: ["https://www.ureshii.my.id", "https://ureshii.my.id", "https://api-ureshii.vercel.app"]
};