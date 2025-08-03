import React from 'react';

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

export default ResultCard;
