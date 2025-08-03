import React, { useRef } from 'react';

const InputSection = ({
  text,
  setText,
  handleFileUpload,
  fileLoading,
  uploadedFile,
  clearText,
  handleSingleAnalyze,
  loading,
  activeAnalysis
}) => {
  const fileInputRef = useRef(null);

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type) => {
    if (type.includes('pdf')) return '📄';
    if (type.includes('word') || type.includes('document')) return '📝';
    if (type.includes('text')) return '📋';
    return '📎';
  };

  const analysisButtons = [
    { key: 'summary', label: 'Özet Çıkar', icon: '📝', color: 'bg-blue-600 hover:bg-blue-700' },
    { key: 'concepts', label: 'Kavramları Bul', icon: '🔑', color: 'bg-green-600 hover:bg-green-700' },
    { key: 'questions', label: 'Quiz Oluştur', icon: '❓', color: 'bg-purple-600 hover:bg-purple-700' },
    { key: 'gaps', label: 'Eksikleri Bul', icon: '⚠️', color: 'bg-orange-600 hover:bg-orange-700' }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        📝 Akıllı Not Analizi
      </h2>
      
      <div className="mb-6 p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <div className="text-center">
          <div className="text-3xl mb-2">📁</div>
          <p className="text-sm text-gray-600 mb-3">
            Dosya yükleyerek metni otomatik çıkarın
          </p>
          
          <input
            ref={fileInputRef}
            type="file"
            accept=".txt,.pdf,.doc,.docx"
            onChange={handleFileUpload}
            className="hidden"
            id="file-upload"
          />
          
          <label
            htmlFor="file-upload"
            className={`inline-block px-4 py-2 text-sm font-medium text-white rounded-lg cursor-pointer transition-colors ${
              fileLoading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {fileLoading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Yükleniyor...
              </div>
            ) : (
              'Dosya Seç'
            )}
          </label>
          
          <p className="text-xs text-gray-500 mt-2">
            TXT, PDF, DOC, DOCX (max 10MB)
          </p>
        </div>
      </div>

      {uploadedFile && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center">
            <span className="text-lg mr-2">{getFileIcon(uploadedFile.type)}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-green-800 truncate">
                {uploadedFile.name}
              </p>
              <p className="text-xs text-green-600">
                {formatFileSize(uploadedFile.size)}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="mb-4 text-center text-gray-500">
        <span className="text-sm">veya</span>
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Ders notlarınızı, makalelerinizi veya öğrenmek istediğiniz konuları buraya manuel olarak yazın..."
        className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-sm"
      />

      <div className="mt-4 flex justify-between items-center">
        <div className="text-sm text-gray-500">
          {text.length} karakter
        </div>
        
        {text && (
          <button
            onClick={clearText}
            className="px-3 py-1 text-xs text-red-600 hover:text-red-800 transition-colors"
          >
            🗑️ Temizle
          </button>
        )}
      </div>

      {text.trim() && (
        <div className="mt-6 space-y-4">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              🧠 Hangi analizi yapmak istiyorsunuz?
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {analysisButtons.map((button) => (
              <button
                key={button.key}
                onClick={() => handleSingleAnalyze(button.key)}
                disabled={loading}
                className={`px-4 py-3 text-white rounded-lg font-medium transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 ${button.color}`}
              >
                {loading && activeAnalysis === button.label.split(' ')[0] ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Analiz ediliyor...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <span className="mr-2">{button.icon}</span>
                    {button.label}
                  </div>
                )}
              </button>
            ))}
          </div>

          <p className="text-xs text-gray-500 text-center mt-2">
            💡 İstediğiniz analiz türünü seçin ve sonuçları görün.
          </p>
        </div>
      )}
    </div>
  );
};

export default InputSection;