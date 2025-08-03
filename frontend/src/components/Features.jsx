import React from 'react';

const Features = () => {
  return (
    <div className="mt-12 bg-white rounded-xl shadow-sm border p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
        ✨ Özellikler 
      </h2>
      
      <div className="flex justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl">
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
    </div>
  );
};

export default Features;