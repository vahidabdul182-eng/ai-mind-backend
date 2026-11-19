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

// AI MIND - OpenAI Chat
app.post("/chat", async (req, res) => {
  try {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        status: "error",
        message: "OpenAI API Key is missing"
      });
    }

    const { message } = req.body;

    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({
        status: "error",
        message: "Please enter a message"
      });
    }

    const response = await fetch(
      "https://api.openai.com/v1/responses",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
          instructions: "You are AI MIND, a helpful, friendly and intelligent AI assistant. Answer clearly and accurately.",
          input: message.trim()
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("OpenAI API Error:", data);
      return res.status(502).json({
        status: "error",
        message: "AI service request failed"
      });
    }

    const answer = (data.output || [])
      .filter(item => item.type === "message")
      .flatMap(item => item.content || [])
      .filter(item => item.type === "output_text")
      .map(item => item.text)
      .join("\n");

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