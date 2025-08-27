import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = 5000;

// Fix for __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static frontend files
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors());
app.use(express.json());

// Translator logic
const BASE_URL = 'https://translate.googleapis.com/translate_a/single';

app.post('/translate', async (req, res) => {
  const { q, source, target } = req.body;

  if (!q || source === target) {
    return res.status(400).json({ error: 'Invalid translation request' });
  }

  try {
    const url = `${BASE_URL}?client=gtx&sl=${source}&tl=${target}&dt=t&q=${encodeURIComponent(q)}`;
    const response = await fetch(url);
    const data = await response.json();
    const translatedText = data[0]?.map(segment => segment[0]).join('') || '';
    res.json({ translatedText });

  } catch (err) {
    res.status(500).json({ error: "OOPS! YOU'RE OFFLINE 😏." });
  }
});

app.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});