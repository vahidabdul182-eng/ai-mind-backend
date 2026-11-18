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

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`AI MIND server running on port ${PORT}`);
});
