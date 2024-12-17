export default {
  // DB SQL
  dbConfig: {
    host: process.env.DB_HOST || "sql12.freemysqlhosting.net",
    user: process.env.DB_USER || "sql12752627",
    password: process.env.DB_PASS || "9tivBBpSqD",
    database: process.env.DB_NAME || "sql12752627",
    port: process.env.DB_PORT || "3306",
  },
  // GEMINI AI
  defaultModel: "gemini-1.5-flash-8b-latest",
  defaultLogic: "Kamu dibuat oleh farhan",
  // SYSTEM
  API_KEY: process.env.API_KEY || "lovefirsha",
  allowedOrigins: ["https://www.ureshii.my.id", "https://ureshii.my.id", "https://api-ureshii.vercel.app", "https://api-ureshii.vercel.app/docs"]
};
