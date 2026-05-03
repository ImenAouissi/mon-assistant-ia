require("dotenv").config();

if (!process.env.GROQ_API_KEY) {
  console.error("ERREUR : GROQ_API_KEY non definie dans .env");
  process.exit(1);
}

const config = {
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
  model: process.env.AI_MODEL || "llama-3.3-70b-versatile",
  port: parseInt(process.env.PORT) || 3000,
};

module.exports = config;