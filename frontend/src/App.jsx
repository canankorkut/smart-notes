import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
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

  const handleAnalyze = async () => {
    if (!text.trim()) {
      alert('Lütfen analiz edilecek metni girin');
      return;
    }

    setLoading(true);
    setResults({ summary: '', concepts: '', questions: '', gaps: '' });
    
    try {
      // 4 farklı analiz türü için prompts
      const analyses = [
        { key: 'summary', action: 'summarize', name: 'Özet' },
        { key: 'concepts', action: 'concepts', name: 'Kavramlar' },
        { key: 'questions', action: 'questions', name: 'Quiz' },
        { key: 'gaps', action: 'gaps', name: 'Eksik Konular' }
      ];

      // Sırayla her analizi yap
      for (const analysis of analyses) {
        setActiveAnalysis(analysis.name);
        
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
          [analysis.key]: data.result
        }));
      }
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

  const ResultCard = ({ title, content, icon, bgColor, textColor }) => (
    <div className={`${bgColor} rounded-xl shadow-sm border p-6 h-full`}>
      <div className="flex items-center mb-4">
        <div className="text-2xl mr-3">{icon}</div>
        <h3 className={`text-lg font-semibold ${textColor}`}>{title}</h3>
      </div>
      
      {content ? (
        <div className="prose max-w-none">
          <div className="bg-white/80 rounded-lg p-4 whitespace-pre-wrap text-sm">
            {content}
          </div>
        </div>
      ) : (
        <div className="text-center text-gray-400 py-8">
          <div className="text-3xl mb-2">⏳</div>
          <p className="text-sm">Analiz bekleniyor...</p>
        </div>
      )}
    </div>
  );

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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                📝 Not Giriş Formu
              </h2>
              
              {/* Text Input */}
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Ders notlarınızı, makalelerinizi veya öğrenmek istediğiniz konuları buraya yapıştırın..."
                className="w-full h-64 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-sm"
              />

              <div className="mt-4 text-right text-sm text-gray-500">
                {text.length} karakter
              </div>

              <button
                onClick={handleAnalyze}
                disabled={loading || !text.trim()}
                className="w-full mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    {activeAnalysis} analiz ediliyor...
                  </div>
                ) : (
                  '🧠 AI ile Analiz Et'
                )}
              </button>
            </div>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ResultCard
                title="Özet"
                content={results.summary}
                icon="📝"
                bgColor="bg-blue-50"
                textColor="text-blue-800"
              />
              
              <ResultCard
                title="Anahtar Kavramlar"
                content={results.concepts}
                icon="🔑"
                bgColor="bg-green-50"
                textColor="text-green-800"
              />
              
              <ResultCard
                title="Quiz Soruları"
                content={results.questions}
                icon="❓"
                bgColor="bg-purple-50"
                textColor="text-purple-800"
              />
              
              <ResultCard
                title="Eksik Konular"
                content={results.gaps}
                icon="⚠️"
                bgColor="bg-orange-50"
                textColor="text-orange-800"
              />
            </div>
          </div>
        </div>

        {/* Features Preview */}
        <div className="mt-12 bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            ✨ Özellikler 
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl mb-2">📝</div>
              <h3 className="font-medium text-blue-800">Akıllı Özet</h3>
              <p className="text-sm text-blue-600">AI ile otomatik özet çıkarma</p>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl mb-2">🔑</div>
              <h3 className="font-medium text-green-800">Kavram Analizi</h3>
              <p className="text-sm text-green-600">Önemli kavramları belirleme</p>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl mb-2">❓</div>
              <h3 className="font-medium text-purple-800">Quiz Oluşturma</h3>
              <p className="text-sm text-purple-600">Otomatik sınav soruları</p>
            </div>
            
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl mb-2">⚠️</div>
              <h3 className="font-medium text-orange-800">Eksik Analizi</h3>
              <p className="text-sm text-orange-600">Tamamlanması gereken konular</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;