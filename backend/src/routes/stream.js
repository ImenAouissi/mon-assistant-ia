const express = require("express");
const OpenAI = require("openai");
const config = require("../config");

const router = express.Router();
const openai = new OpenAI({ apiKey: config.apiKey, baseURL: config.baseURL });

router.post("/", async (req, res) => {
  const { message } = req.body;
  if (!message || typeof message !== "string" || message.trim() === "") {
    return res.status(400).json({ error: "message est requis" });
  }
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const sendEvent = (type, data) => {
    res.write("event: " + type + "\ndata: " + JSON.stringify(data) + "\n\n");
  };

  try {
    const stream = await openai.chat.completions.create({
      model: config.model,
      messages: [{ role: "user", content: message }],
      max_tokens: 1000,
      stream: true,
    });
    let fullResponse = "";
    for await (const chunk of stream) {
      const delta = chunk.choices[0] && chunk.choices[0].delta;
      if (delta && delta.content) {
        fullResponse += delta.content;
        sendEvent("message", { content: delta.content, done: false });
      }
      if (chunk.choices[0] && chunk.choices[0].finish_reason === "stop") {
        sendEvent("done", { done: true, full_response: fullResponse });
      }
    }
    res.end();
  } catch (error) {
    sendEvent("error", { error: error.message });
    res.end();
  }
});

module.exports = router;
