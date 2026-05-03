const express = require("express");
const OpenAI = require("openai");
const config = require("../config");

const router = express.Router();
const openai = new OpenAI({ apiKey: config.apiKey, baseURL: config.baseURL });

router.post("/", async (req, res) => {
  const { messages } = req.body;
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: "messages doit etre un tableau non vide" });
  }
  const rolesValides = ["user", "assistant", "system"];
  for (const [i, msg] of messages.entries()) {
    if (!msg.role || !rolesValides.includes(msg.role)) {
      return res.status(400).json({ error: "Message " + i + " : role invalide" });
    }
    if (!msg.content) {
      return res.status(400).json({ error: "Message " + i + " : content requis" });
    }
  }
  if (messages[messages.length - 1].role !== "user") {
    return res.status(400).json({ error: "Le dernier message doit etre user" });
  }
  try {
    const completion = await openai.chat.completions.create({
      model: config.model,
      messages: messages,
      max_tokens: 1000,
      temperature: 0.7,
    });
    const aiResponse = completion.choices[0].message;
    res.json({
      success: true,
      data: {
        reply: aiResponse.content,
        new_message: { role: "assistant", content: aiResponse.content },
        conversation_length: messages.length + 1,
        usage: completion.usage,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Erreur interne", message: error.message });
  }
});

module.exports = router;
