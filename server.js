const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("AI MIND Backend is Running Successfully!");
});

app.get("/health", (req, res) => {
  res.json({
    status: "success",
    message: "AI MIND is healthy!"
  });
});

// AI MIND - Gemini AI Chat
app.post("/chat", async (req, res) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        status: "error",
        message: "Gemini API Key is missing"
      });
    }

    const { message } = req.body;

    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({
        status: "error",
        message: "Please enter a message"
      });
    }

    const model = process.env.GEMINI_MODEL || "gemini-3.8-flash";

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey
        },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{
              text: "You are AI MIND, a helpful, friendly and intelligent AI assistant. Answer clearly and accurately."
            }]
          },
          contents: [{
            role: "user",
            parts: [{
              text: message.trim()
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1024
          }
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Gemini API Error:", data);

      return res.status(502).json({
        status: "error",
        message: "Gemini AI request failed"
      });
    }

    const answer = (data.candidates?.[0]?.content?.parts || [])
      .map(part => part.text || "")
      .join("\n")
      .trim();

    if (!answer) {
      return res.status(502).json({
        status: "error",
        message: "AI response not found"
      });
    }

    res.json({
      status: "success",
      answer: answer
    });

  } catch (error) {
    console.error("Server Error:", error);

    res.status(500).json({
      status: "error",
      message: "Something went wrong"
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`AI MIND server running on port ${PORT}`);
});