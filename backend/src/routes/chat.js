const express = require("express");
const OpenAI = require("openai");
const config = require("../config");

const router = express.Router();
const openai = new OpenAI({ apiKey: config.apiKey, baseURL: config.baseURL });

router.post("/", async (req, res) => {
  const { message } = req.body;
  if (!message || typeof message !== "string" || message.trim() === "") {
    return res.status(400).json({ error: "Validation", message: "message est requis" });
  }
  try {
    const completion = await openai.chat.completions.create({
      model: config.model,
      messages: [{ role: "user", content: message }],
      max_tokens: 1000,
      temperature: 0.7,
    });
    res.json({
      success: true,
      data: {
        message: completion.choices[0].message.content,
        usage: completion.usage,
        model: completion.model,
      },
    });
  } catch (error) {
    if (error.status === 401) return res.status(401).json({ error: "Cle API invalide" });
    if (error.status === 429) return res.status(429).json({ error: "Limite atteinte" });
    res.status(500).json({ error: "Erreur interne", message: error.message });
  }
});

router.post("/test-error", (req, res) => {
  const { type } = req.body;
  const erreurs = {
    400: { status: 400, body: { error: "Mauvaise requete", message: "Donnees invalides" } },
    401: { status: 401, body: { error: "Non autorise", message: "Cle API invalide" } },
    429: { status: 429, body: { error: "Trop de requetes", retry_after: 60 } },
    500: { status: 500, body: { error: "Erreur serveur" } },
  };
  const erreur = erreurs[type];
  if (!erreur) return res.status(400).json({ error: "Types disponibles: 400, 401, 429, 500" });
  res.status(erreur.status).json(erreur.body);
});

module.exports = router;
