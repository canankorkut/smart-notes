const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend çalışıyor!' });
});

// Gemini API endpoint
app.post('/api/gemini/analyze', async (req, res) => {
  try {
    const { text, action } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Metin gerekli' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'Gemini API key bulunamadı' });
    }

    let prompt = '';
    switch (action) {
      case 'summarize':
        prompt = `Aşağıdaki metni özetle:\n\n${text}`;
        break;
      case 'keywords':
        prompt = `Aşağıdaki metinden anahtar kelimeleri çıkar (virgülle ayırarak):\n\n${text}`;
        break;
      case 'questions':
        prompt = `Aşağıdaki metne dayalı olarak 5 önemli soru oluştur:\n\n${text}`;
        break;
      case 'expand':
        prompt = `Aşağıdaki metni daha detaylı şekilde genişlet:\n\n${text}`;
        break;
      default:
        prompt = `Aşağıdaki metni analiz et ve öneriler sun:\n\n${text}`;
    }

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
      {
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      },
      {
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );

    const result = response.data.candidates[0].content.parts[0].text;
    res.json({ result });

  } catch (error) {
    console.error('Gemini API Hatası:', error.response?.data || error.message);
    res.status(500).json({ 
      error: 'AI analizi sırasında hata oluştu',
      details: error.response?.data?.error?.message || error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server ${PORT} portunda çalışıyor`);
});