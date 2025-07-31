import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [text, setText] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [action, setAction] = useState('summarize');

  const handleAnalyze = async () => {
    if (!text.trim()) {
      alert('Lütfen analiz edilecek metni girin');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/gemini/analyze', {
        text,
        action
      });
      setResult(response.data.result);
    } catch (error) {
      console.error('Hata:', error);
      alert('Analiz sırasında hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const testBackend = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/test');
      alert(response.data.message);
    } catch (error) {
      alert('Backend bağlantısı başarısız');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">
              🧠 Akıllı Notlar
            </h1>
            <button
              onClick={testBackend}
              className="px-4 py-2 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              Backend Test
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Metninizi Girin
            </h2>
            
            {/* Action Selector */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                İşlem Seçin:
              </label>
              <select
                value={action}
                onChange={(e) => setAction(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="summarize">Özetle</option>
                <option value="keywords">Anahtar Kelimeler</option>
                <option value="questions">Sorular Oluştur</option>
                <option value="expand">Genişlet</option>
                <option value="analyze">Genel Analiz</option>
              </select>
            </div>

            {/* Text Input */}
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Analiz edilecek metni buraya yazın..."
              className="w-full h-64 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
            />

            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="w-full mt-4 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {loading ? 'Analiz Ediliyor...' : 'Analiz Et'}
            </button>
          </div>

          {/* Result Section */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              AI Analizi
            </h2>
            
            {result ? (
              <div className="prose max-w-none">
                <div className="bg-gray-50 rounded-lg p-4 whitespace-pre-wrap">
                  {result}
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-12">
                <div className="text-4xl mb-4">🤖</div>
                <p>Analiz sonucu burada görünecek</p>
              </div>
            )}
          </div>
        </div>

        {/* Features Preview */}
        <div className="mt-12 bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Özellikler 
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl mb-2">📝</div>
              <h3 className="font-medium">Not Alma</h3>
              <p className="text-sm text-gray-600">Hızlı not alma</p>
            </div>
            
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl mb-2">🔍</div>
              <h3 className="font-medium">Akıllı Arama</h3>
              <p className="text-sm text-gray-600">AI destekli arama</p>
            </div>
            
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl mb-2">🏷️</div>
              <h3 className="font-medium">Otomatik Etiketleme</h3>
              <p className="text-sm text-gray-600">AI etiketleme</p>
            </div>
            
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl mb-2">📊</div>
              <h3 className="font-medium">Analitik</h3>
              <p className="text-sm text-gray-600">Not istatistikleri</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;