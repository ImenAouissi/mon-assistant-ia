const express = require("express");
const OpenAI = require("openai");
const config = require("../config");

const router = express.Router();
const openai = new OpenAI({ apiKey: config.apiKey, baseURL: config.baseURL });

const PERSONAS = {
  assistant_general: {
    name: "Assistant General",
    system: "Tu es un assistant IA serviable et precis. Tu reponds toujours en francais.",
  },
  professeur_maths: {
    name: "Professeur de Mathematiques",
    system: "Tu es un professeur de maths patient. Tu expliques avec des exemples simples.",
  },
  expert_code: {
    name: "Expert en Developpement",
    system: "Tu es un developpeur senior. Tu donnes des conseils precis avec des exemples de code commentes.",
  },
  chef_cuisinier: {
    name: "Chef Cuisinier",
    system: "Tu es un chef cuisinier passionne. Tu partages des recettes avec des astuces professionnelles.",
  },
};

router.get("/", (req, res) => {
  res.json({
    success: true,
    data: {
      personas: Object.entries(PERSONAS).map(function(entry) {
        return { id: entry[0], name: entry[1].name };
      }),
    },
  });
});

router.post("/", async (req, res) => {
  const { persona_id, message, custom_system } = req.body;
  if (!message) return res.status(400).json({ error: "message est requis" });

  let systemMessage, personaName;
  if (custom_system) {
    systemMessage = custom_system;
    personaName = "Persona personnalisee";
  } else if (persona_id) {
    const persona = PERSONAS[persona_id];
    if (!persona) {
      return res.status(400).json({
        error: "Persona introuvable. Disponibles: " + Object.keys(PERSONAS).join(", "),
      });
    }
    systemMessage = persona.system;
    personaName = persona.name;
  } else {
    return res.status(400).json({ error: "Fournir persona_id ou custom_system" });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: config.model,
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: message },
      ],
      max_tokens: 1000,
      temperature: 0.8,
    });
    res.json({
      success: true,
      data: {
        persona: personaName,
        message: completion.choices[0].message.content,
        usage: completion.usage,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Erreur interne", message: error.message });
  }
});

module.exports = router;
