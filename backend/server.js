const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const fs = require('fs').promises;

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Multer konfigürasyonu - dosya yükleme için
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'text/plain',
      'application/pdf', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Desteklenmeyen dosya türü. Sadece TXT, PDF ve Word dosyaları yükleyebilirsiniz.'));
    }
  }
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend çalışıyor!' });
});

// Dosya içeriği çıkarma fonksiyonları
async function extractTextFromFile(file) {
  const { buffer, mimetype, originalname } = file;
  
  try {
    switch (mimetype) {
      case 'text/plain':
        return buffer.toString('utf-8');
        
      case 'application/pdf':
        const pdfData = await pdfParse(buffer);
        return pdfData.text;
        
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        const docxResult = await mammoth.extractRawText({ buffer });
        return docxResult.value;
        
      case 'application/msword':
        // .doc dosyaları için temel destek (sınırlı)
        return buffer.toString('utf-8').replace(/[^\x20-\x7E\n\r\t]/g, ' ');
        
      default:
        throw new Error('Desteklenmeyen dosya türü');
    }
  } catch (error) {
    throw new Error(`Dosya okuma hatası: ${error.message}`);
  }
}

// Dosya yükleme ve metin çıkarma endpoint'i
app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Dosya yüklenmedi' });
    }

    const extractedText = await extractTextFromFile(req.file);
    
    if (!extractedText || extractedText.trim().length === 0) {
      return res.status(400).json({ error: 'Dosyadan metin çıkarılamadı' });
    }

    res.json({ 
      text: extractedText,
      filename: req.file.originalname,
      size: req.file.size,
      type: req.file.mimetype
    });

  } catch (error) {
    console.error('Dosya yükleme hatası:', error);
    res.status(500).json({ 
      error: 'Dosya işleme hatası',
      details: error.message
    });
  }
});

// Geliştirilmiş prompts
const getPrompt = (action, text) => {
  const prompts = {
    summarize: `Aşağıdaki ders notunu/metni kısa ve öz bir şekilde özetle. Önemli noktaları kaçırma:

${text}

Lütfen özet formatında ver:`,

    concepts: `Aşağıdaki ders notundan/metinden en önemli anahtar kavramları çıkar ve her birini kısaca açıkla:

${text}

Format:
• Kavram 1: Açıklama
• Kavram 2: Açıklama
(En fazla 8 kavram)`,

    questions: `Aşağıdaki ders notuna/metnine dayalı olarak 5 adet çoktan seçmeli sınav sorusu oluştur:

${text}

Format:
1. Soru metni?
   a) Seçenek A
   b) Seçenek B  
   c) Seçenek C
   d) Seçenek D
   Doğru cevap: X

(Her soru için bu formatı kullan)`,

    gaps: `Aşağıdaki ders notunu/metni analiz et ve öğrencinin daha iyi anlaması için eksik olan veya derinleştirilmesi gereken konuları belirle:

${text}

Eksik/derinleştirilmesi gereken konular:
• 
• 
• 

Önerilen ek çalışma konuları:
• 
• 
•`,

    default: `Aşağıdaki metni analiz et ve öneriler sun:

${text}`
  };

  return prompts[action] || prompts.default;
};

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

    const prompt = getPrompt(action, text);

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent`,
      {
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-goog-api-key': apiKey
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

app.post('/api/gemini/analyze-bulk', async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Metin gerekli' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'Gemini API key bulunamadı' });
    }

    const bulkPrompt = `Aşağıdaki ders notunu/metni kapsamlı bir şekilde analiz et ve şu 4 bölümde sonuçları ver:

${text}

Lütfen cevabını şu formatta ver:

## ÖZET
[Metnin kısa özeti]

## ANAHTAR KAVRAMLAR  
• Kavram 1: Açıklama
• Kavram 2: Açıklama
[En fazla 8 kavram]

## QUIZ SORULARI
1. Soru?
   a) Seçenek A  b) Seçenek B  c) Seçenek C  d) Seçenek D
   Doğru: [harf]

[5 soru toplam]

## EKSİK KONULAR
• Derinleştirilmesi gereken konu 1
• Derinleştirilmesi gereken konu 2
[Öneriler]`;

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent`,
      {
        contents: [{
          parts: [{
            text: bulkPrompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        }
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-goog-api-key': apiKey
        }
      }
    );

    const fullResult = response.data.candidates[0].content.parts[0].text;
    
    // Sonuçları ayrıştır
    const sections = {
      summary: extractSection(fullResult, 'ÖZET'),
      concepts: extractSection(fullResult, 'ANAHTAR KAVRAMLAR'),
      questions: extractSection(fullResult, 'QUIZ SORULARI'),
      gaps: extractSection(fullResult, 'EKSİK KONULAR')
    };

    res.json(sections);

  } catch (error) {
    console.error('Gemini API Hatası:', error.response?.data || error.message);
    res.status(500).json({ 
      error: 'AI analizi sırasında hata oluştu',
      details: error.response?.data?.error?.message || error.message
    });
  }
});

function extractSection(text, sectionName) {
  const regex = new RegExp(`## ${sectionName}\\s*([\\s\\S]*?)(?=## |$)`, 'i');
  const match = text.match(regex);
  return match ? match[1].trim() : `${sectionName} bölümü bulunamadı`;
}

app.listen(PORT, () => {
  console.log(`Server ${PORT} portunda çalışıyor`);
});