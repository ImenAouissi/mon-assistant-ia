const express = require("express");
const cors = require("cors");
const config = require("./config");

const chatRouter = require("./routes/chat");
const conversationRouter = require("./routes/conversation");
const streamRouter = require("./routes/stream");
const personaRouter = require("./routes/persona");

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/chat", chatRouter);
app.use("/api/conversation", conversationRouter);
app.use("/api/stream", streamRouter);
app.use("/api/persona", personaRouter);

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Le serveur tourne correctement",
    timestamp: new Date().toISOString(),
    model: config.model,
  });
});

// ← CORRECTION ICI : plus de "*"
app.use((req, res) => {
  res.status(404).json({
    error: "Route non trouvée",
    message: `La route ${req.originalUrl} n'existe pas`,
  });
});

app.listen(config.port, () => {
  console.log(`\n✅ Serveur démarré sur http://localhost:${config.port}`);
  console.log(`🤖 Modèle IA : ${config.model}`);
  console.log(`\nRoutes disponibles :`);
  console.log(`  GET  /health`);
  console.log(`  POST /api/chat`);
  console.log(`  POST /api/conversation`);
  console.log(`  POST /api/stream`);
  console.log(`  POST /api/persona\n`);
});

module.exports = app;
