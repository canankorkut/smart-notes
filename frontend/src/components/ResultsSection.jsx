import React from 'react';

const SummaryResult = ({ content }) => {
  const cleanContent = content
    .replace(/\*+/g, '') 
    .replace(/^\s*[\•\-\*]\s*/gm, '') 
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .join('\n\n');

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-8 shadow-lg border-l-4 border-blue-500">
      <div className="flex items-center mb-6">
        <div className="bg-blue-500 rounded-full p-3 mr-4">
          <span className="text-white text-2xl">📝</span>
        </div>
        <div>
          <h3 className="text-2xl font-bold text-blue-800">Akıllı Özet</h3>
          <p className="text-blue-600">Metnin temel noktaları</p>
        </div>
      </div>
      
      <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-inner">
        <div className="prose prose-blue max-w-none">
          <div className="text-gray-800 leading-relaxed">
            {cleanContent.split('\n\n').map((paragraph, index) => (
              <p key={index} className="mb-3 text-justify">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const ConceptsResult = ({ content }) => {
  const cleanedContent = content
    .replace(/^\s*İşte.*?anahtar kavramlar.*?açıklamaları.*?[:\.]\s*/i, '') 
    .replace(/^\s*En önemli.*?[:\.]\s*/im, '')
    .replace(/\*+/g, '') 
    .trim();

  const lines = cleanedContent.split('\n').filter(line => line.trim());
  
  const concepts = lines.filter(line => {
    const trimmed = line.trim();
    if (trimmed.length < 3) return false;
    
    return trimmed.startsWith('•') || 
           trimmed.includes(':') ||
           (trimmed.length > 10 && 
            !trimmed.toLowerCase().startsWith('işte') && 
            !trimmed.toLowerCase().startsWith('en önemli') &&
            !trimmed.toLowerCase().startsWith('anahtar kavramlar'));
  }).map(line => {
    return line.trim()
      .replace(/^\*+\s*/, '')  
      .replace(/\*+$/, '')     
      .replace(/\*+/g, '')    
      .replace(/^•\s*/, '')    
      .replace(/^\d+\.\s*/, '') 
      .trim();
  }).filter(concept => concept.length > 0);

  const conceptCount = concepts.length;
  
  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl p-8 shadow-lg border-l-4 border-green-500">
      <div className="flex items-center mb-6">
        <div className="bg-green-500 rounded-full p-3 mr-4">
          <span className="text-white text-2xl">🔑</span>
        </div>
        <div>
          <h3 className="text-2xl font-bold text-green-800">Anahtar Kavramlar</h3>
          <p className="text-green-600">
            {conceptCount > 0 ? `${conceptCount} önemli kavram` : 'Kavramlar analiz ediliyor...'}
          </p>
        </div>
      </div>
      
      <div className="space-y-4">
        {conceptCount > 0 ? (
          concepts.map((concept, index) => {
            const parts = concept.split(':');
            const title = parts[0].trim();
            const description = parts.slice(1).join(':').trim();
            
            return (
              <div key={index} className="bg-white/70 backdrop-blur-sm rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300 border-l-2 border-green-400">
                <div className="flex items-start">
                  <div className="bg-green-100 rounded-full w-8 h-8 flex items-center justify-center mr-3 mt-1">
                    <span className="text-green-600 font-bold text-sm">{index + 1}</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-green-800 mb-1">{title}</h4>
                    {description && (
                      <p className="text-gray-700 text-sm leading-relaxed">{description}</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6">
            <div className="text-gray-800 leading-relaxed">
              <div className="space-y-3">
                {cleanedContent.split('\n').map((line, index) => {
                  const cleanLine = line.trim()
                    .replace(/^\*+\s*/, '')
                    .replace(/\*+$/, '')
                    .replace(/\*+/g, '')
                    .replace(/^•\s*/, '')
                    .replace(/^\d+\.\s*/, '');
                  
                  if (!cleanLine || 
                      cleanLine.toLowerCase().startsWith('işte') || 
                      cleanLine.toLowerCase().startsWith('en önemli') ||
                      cleanLine.toLowerCase().startsWith('anahtar kavramlar')) {
                    return null;
                  }
                  
                  return (
                    <div key={index} className="p-3 bg-green-50 rounded-lg border-l-3 border-green-300">
                      {cleanLine}
                    </div>
                  );
                }).filter(Boolean)}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const QuizResult = ({ content }) => {
  const cleanContent = content
    .replace(/^\s*İşte.*?çoktan seçmeli.*?soru.*?[:\.]\s*/i, '') 
    .replace(/^\s*\*+İşte.*?soru.*?\*+\s*/i, '') 
    .replace(/\*+/g, '')
    .trim();
  
  const questionSections = cleanContent.split(/(?=\d+\.)/g).filter(section => section.trim());
  
  const questions = questionSections.map((section, index) => {
    const lines = section.trim().split('\n').filter(line => line.trim());
    if (lines.length === 0) return null;
    
    const questionLine = lines[0].replace(/^\d+\.\s*/, '').trim();
    const question = questionLine.endsWith('?') ? questionLine : questionLine + '?';
    
    const options = lines.filter(line => {
      const trimmed = line.trim();
      return trimmed.match(/^[a-d]\)\s*/i) || trimmed.match(/^[a-d]\s*\)/i);
    }).map(opt => opt.trim());
    
    const correctAnswer = lines.find(line => 
      line.toLowerCase().includes('doğru') || 
      line.toLowerCase().includes('cevap')
    );
    
    return { question, options, correctAnswer, index: index + 1 };
  }).filter(Boolean);

  return (
    <div className="bg-gradient-to-br from-purple-50 to-violet-100 rounded-2xl p-8 shadow-lg border-l-4 border-purple-500">
      <div className="flex items-center mb-6">
        <div className="bg-purple-500 rounded-full p-3 mr-4">
          <span className="text-white text-2xl">❓</span>
        </div>
        <div>
          <h3 className="text-2xl font-bold text-purple-800">Quiz Soruları</h3>
          <p className="text-purple-600">{questions.length} soru hazırlandı</p>
        </div>
      </div>
      
      <div className="space-y-6">
        {questions.length > 0 ? (
          questions.map((q, index) => (
            <div key={index} className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex items-start mb-4">
                <div className="bg-purple-500 rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">
                  <span className="text-white font-bold text-sm">{q.index}</span>
                </div>
                <h4 className="font-semibold text-purple-800 flex-1 text-left">{q.question}</h4>
              </div>
              
              <div className="ml-11 space-y-2">
                {q.options.map((option, optIndex) => {
                  const cleanOption = option.replace(/^[a-d]\)\s*/i, '').trim();
                  const optionLetter = option.match(/^([a-d])/i)?.[1]?.toUpperCase() || String.fromCharCode(65 + optIndex);
                  
                  return (
                    <div key={optIndex} className="flex items-center p-2 rounded-lg hover:bg-purple-50 transition-colors">
                      <div className="w-6 h-6 rounded-full border-2 border-purple-300 mr-3 flex items-center justify-center">
                        <span className="text-purple-600 text-sm font-medium">
                          {optionLetter}
                        </span>
                      </div>
                      <span className="text-gray-700">{cleanOption}</span>
                    </div>
                  );
                })}
                
                {q.correctAnswer && (
                  <div className="mt-3 p-2 bg-green-100 rounded-lg">
                    <span className="text-green-800 text-sm font-medium">
                      ✅ {q.correctAnswer.replace(/\*+/g, '').trim()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6">
            <div className="text-gray-800 leading-relaxed">
              <div className="whitespace-pre-wrap">
                {cleanContent}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const GapsResult = ({ content }) => {
  const cleanedContent = content
    .replace(/^##\s*/gm, '') 
    .replace(/^\s*\d+\s*[\n\r]/m, '') 
    .replace(/^\s*\d+\s*/, '') 
    .replace(/^\s*İşte.*?eksik.*?konular.*?[:\.]\s*/i, '') 
    .replace(/^\s*Eksik.*?konular.*?[:\.]\s*/i, '') 
    .replace(/^\s*Derinleştirilmesi.*?gereken.*?konular.*?[:\.]\s*/i, '')
    .replace(/^\s*Geliştirilmesi.*?gereken.*?alanlar.*?[:\.]\s*/i, '')
    .replace(/^\s*Bu\s+ders\s+notu.*?[:\.]\s*/i, '') 
    .replace(/^\s*Öğrencinin.*?[:\.]\s*/i, '')  
    .replace(/^\s*Aşağıda.*?[:\.]\s*/i, '')
    .replace(/^\s*Ders\s+notu\s+analizi.*?[:\.]\s*/i, '') 
    .replace(/\*{2,}/g, '') 
    .replace(/\*+/g, '')
    .trim();

  const lines = cleanedContent.split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .filter(line => !/^\d+\s*$/.test(line)); 

  let introText = '';
  let gapItems = [];
  
  let startIndex = 0;
  
  for (let i = 0; i < Math.min(3, lines.length); i++) {
    const line = lines[i];
    
    if (!line.match(/^[\•\-\*\d+\.]\s*/) && 
        !line.includes(':') && 
        line.length > 30 && 
        !line.toLowerCase().startsWith('eksik') &&
        !line.toLowerCase().startsWith('derinleş') &&
        !line.toLowerCase().startsWith('geliştiril') &&
        !line.toLowerCase().startsWith('bu ders') &&
        !line.toLowerCase().startsWith('öğrencinin') &&
        !line.toLowerCase().startsWith('aşağıda') &&
        !line.toLowerCase().startsWith('ders notu analizi')) {
      
      if (introText) introText += ' ';
      introText += line;
      startIndex = i + 1;
    } else {
      break;
    }
  }

  const remainingLines = lines.slice(startIndex);
  
  gapItems = remainingLines
    .filter(line => {
      const trimmed = line.trim();
      
      if (trimmed.length < 10) return false;
      
      if (/^\d+\s*$/.test(trimmed)) return false;
      
      const isTitle = /^(Eksik|Derinleştirilmesi Gereken|Geliştirilmesi Gereken|Konular?)[:.]?\s*$/i.test(trimmed);
      if (isTitle) return false;
      
      if (trimmed.toLowerCase().startsWith('işte') || 
          trimmed.toLowerCase().startsWith('bu ders notu') ||
          trimmed.toLowerCase().startsWith('öğrencinin') ||
          trimmed.toLowerCase().startsWith('aşağıda') ||
          trimmed.toLowerCase().startsWith('ders notu analizi') ||
          trimmed.toLowerCase().startsWith('analiz sonuçları') ||
          trimmed.toLowerCase().includes('geliştirilmesi gereken konular şunlardır') ||
          trimmed.toLowerCase().includes('eksik konular şunlardır')) {
        return false;
      }
      
      return true;
    })
    .map(line => {
      return line.trim()
        .replace(/^[\•\-\*]\s*/, '')
        .replace(/^\d+\.\s*/, '')
        .replace(/^[-•]\s*/, '')
        .replace(/^\d+\s+/, '')
        .replace(/^\d+/, '') 
        .trim();
    })
    .filter(item => item.length > 0);

  return (
    <div className="bg-gradient-to-br from-orange-50 to-amber-100 rounded-2xl p-8 shadow-lg border-l-4 border-orange-500">
      <div className="flex items-center mb-6">
        <div className="bg-orange-500 rounded-full p-3 mr-4">
          <span className="text-white text-2xl">⚠️</span>
        </div>
        <div>
          <h3 className="text-2xl font-bold text-orange-800">Eksik Konular</h3>
          <p className="text-orange-600">
            {gapItems.length > 0 
              ? `${gapItems.length} geliştirilmesi gereken alan` 
              : 'Geliştirilmesi gereken alanlar'}
          </p>
        </div>
      </div>
      
      <div className="space-y-4">
        {gapItems.length > 0 ? (
          gapItems.map((gap, index) => {
            const parts = gap.split(':');
            const hasDescription = parts.length > 1;
            const title = parts[0].trim();
            const description = hasDescription ? parts.slice(1).join(':').trim() : '';
            
            return (
              <div key={index} className="bg-white/70 backdrop-blur-sm rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300 border-l-2 border-orange-400">
                <div className="flex items-start">
                  <div className="bg-orange-100 rounded-full w-8 h-8 flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                    <span className="text-orange-600 font-bold text-sm">{index + 1}</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-orange-800 mb-1">
                      {title}
                    </h4>
                    {description && (
                      <p className="text-gray-700 text-sm leading-relaxed">
                        {description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6">
            <div className="text-gray-800 leading-relaxed">
              {cleanedContent.split('\n').map((line, index) => {
                const cleanLine = line.trim()
                  .replace(/^##\s*/, '')
                  .replace(/^\*+\s*/, '')
                  .replace(/\*+$/, '')
                  .replace(/\*+/g, '')
                  .replace(/^[\•\-]\s*/, '')
                  .replace(/^\d+\.\s*/, '')
                  .replace(/^\d+\s+/, '')
                  .replace(/^\d+/, ''); 
                
                if (!cleanLine || cleanLine.length < 5) return null;
                
                return (
                  <div key={index} className="mb-3 p-3 bg-orange-50 rounded-lg border-l-3 border-orange-300">
                    {cleanLine}
                  </div>
                );
              }).filter(Boolean)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const ResultsSection = ({ results }) => {
  const hasResults = Object.values(results).some(result => result && result.trim() !== '');
  
  if (!hasResults) {
    return null;
  }

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-2">
          <span className="text-4xl mr-3">📊</span>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Analiz Sonuçları
          </h2>
        </div>
        <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mt-2 rounded-full"></div>
      </div>
      
      <div className="space-y-8">
        {results.summary && <SummaryResult content={results.summary} />}
        {results.concepts && <ConceptsResult content={results.concepts} />}
        {results.questions && <QuizResult content={results.questions} />}
        {results.gaps && <GapsResult content={results.gaps} />}
      </div>
    </div>
  );
};

export default ResultsSection;