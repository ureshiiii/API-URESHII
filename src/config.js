export default {
  // DB SQL
  dbConfig: {
    host: process.env.DB_HOST || "mysql-189165-0.cloudclusters.net",
    user: process.env.DB_USER || "admin",
    password: process.env.DB_PASS || "C5L3r0Id",
    database: process.env.DB_NAME || "ureshii",
  },
  // GEMINI AI
  defaultModel: "gemini-1.5-flash-8b-latest",
  defaultLogic: "Kamu dibuat oleh farhan",
  // SYSTEM
  API_KEY: process.env.API_KEY || "lovefirsha",
  allowedOrigins: ["https://www.ureshii.my.id", "https://api.ureshii.my.id"]
};
