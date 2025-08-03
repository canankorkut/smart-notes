import { useState, useRef } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import InputSection from './components/InputSection';
import ResultsSection from './components/ResultsSection';
import Features from './components/Features';
import Footer from './components/Footer';
import './App.css';

function App() {
  const [text, setText] = useState('');
  const [results, setResults] = useState({
    summary: '',
    concepts: '',
    questions: '',
    gaps: ''
  });
  const [loading, setLoading] = useState(false);
  const [activeAnalysis, setActiveAnalysis] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [fileLoading, setFileLoading] = useState(false);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const allowedTypes = [
      'text/plain',
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword'
    ];

    if (!allowedTypes.includes(file.type)) {
      alert('Desteklenmeyen dosya türü! Sadece TXT, PDF ve Word dosyaları yükleyebilirsiniz.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('Dosya boyutu 10MB\'dan büyük olamaz!');
      return;
    }

    setFileLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (response.ok) {
        setText(data.text);
        setUploadedFile({
          name: data.filename,
          size: data.size,
          type: data.type
        });
        alert(`Dosya başarıyla yüklendi: ${data.filename}`);
      } else {
        alert(`Hata: ${data.error}`);
      }
    } catch (error) {
      console.error('Dosya yükleme hatası:', error);
      alert('Dosya yükleme sırasında hata oluştu!');
    } finally {
      setFileLoading(false);
    }
  };

  const handleSingleAnalyze = async (analysisType) => {
    if (!text.trim()) {
      alert('Lütfen analiz edilecek metni girin veya dosya yükleyin');
      return;
    }

    setLoading(true);
    setActiveAnalysis(analysisType);

    const analysisMap = {
      'summary': { action: 'summarize', name: 'Özet' },
      'concepts': { action: 'concepts', name: 'Kavramlar' },
      'questions': { action: 'questions', name: 'Quiz' },
      'gaps': { action: 'gaps', name: 'Eksik Konular' }
    };

    try {
      const analysis = analysisMap[analysisType];
      
      const response = await fetch('http://localhost:5000/api/gemini/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          action: analysis.action
        })
      });
      
      const data = await response.json();
      
      setResults(prev => ({
        ...prev,
        [analysisType]: data.result
      }));

    } catch (error) {
      console.error('Hata:', error);
      alert('Analiz sırasında hata oluştu');
    } finally {
      setLoading(false);
      setActiveAnalysis('');
    }
  };

  const testBackend = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/test');
      const data = await response.json();
      alert(data.message);
    } catch (error) {
      alert('Backend bağlantısı başarısız');
    }
  };

  const clearText = () => {
    setText('');
    setUploadedFile(null);
    setResults({ summary: '', concepts: '', questions: '', gaps: '' });
  };

  return (
    <div className="min-h-screen">
      <Header onTestBackend={testBackend} />
      <Hero />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <InputSection 
            text={text}
            setText={setText}
            handleFileUpload={handleFileUpload}
            fileLoading={fileLoading}
            uploadedFile={uploadedFile}
            clearText={clearText}
            handleSingleAnalyze={handleSingleAnalyze}
            loading={loading}
            activeAnalysis={activeAnalysis}
          />
        </div>

        <div className="mt-8">
          <ResultsSection results={results} />
        </div>

        <Features />
      </main>

      <Footer />
    </div>
  );
}

export default App;