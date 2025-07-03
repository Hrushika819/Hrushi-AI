require('dotenv').config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;

app.post('/ask', async (req, res) => {
  const { question } = req.body;

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: question,
              },
            ],
          },
        ],
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    res.status(200).json(response.data);

  } catch (error) {
    if (error.response) {
      console.error("Google API error status:", error.response.status);
      console.error("Google API error data:", error.response.data);
    } else if (error.request) {
      console.error("No response received from Google API:", error.request);
    } else {
      console.error("Error in setting up request:", error.message);
    }
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
