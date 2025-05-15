import React, { useState, useRef, useEffect } from 'react';
import { FiSend, FiAlertCircle, FiCheckCircle, FiInfo, FiTrash2 } from 'react-icons/fi';
import { fetchLLMResponse } from '../services/api'

const NewChat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [lastResponse, setLastResponse] = useState('');
  const messagesEndRef = useRef(null);

  const analyzeBias = (text) => {
    const detectedBiases = [];
    const textLower = text.toLowerCase();

    // Biais de consensus
    if (/généralement admis|tout le monde sait que|il est bien connu que/i.test(text)) {
      detectedBiases.push({
        type: "Biais de consensus",
        description: "Utilisation d'expressions suggérant un consensus qui peut ne pas exister",
        severity: "medium"
      });
    }

    // Faux équilibre
    if (/d'un côté.*un autre côté|certains disent.*d'autres disent/i.test(textLower)) {
      detectedBiases.push({
        type: "Faux équilibre",
        description: "Présentation de deux côtés comme également valables même si les preuves favorisent clairement un côté",
        severity: "high"
      });
    }

    // Cherry picking
    if (/certaines études contredisent|quelques recherches montrent/i.test(textLower)) {
      detectedBiases.push({
        type: "Cherry picking",
        description: "Sélection sélective d'études qui contredisent le consensus majoritaire",
        severity: "high"
      });
    }

    // Langage émotionnel
    if (/malheureusement|heureusement|de manière choquante/i.test(textLower)) {
      detectedBiases.push({
        type: "Langage émotionnel",
        description: "Utilisation de termes chargés émotionnellement pouvant influencer la perception",
        severity: "medium"
      });
    }

    return detectedBiases.length > 0 ? detectedBiases : null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    try {
      setIsLoading(true);
      const response = await fetchLLMResponse(input);
      const llmMessage = { text: response, sender: 'llm' };
      setMessages(prev => [...prev, llmMessage]);
      setLastResponse(response);
      setAnalysis(null);
    } catch (error) {
      const errorMessage = { text: "Erreur lors de la génération de la réponse.", sender: 'llm' };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnalysis = () => {
    const biasResult = analyzeBias(lastResponse);
    setAnalysis(biasResult);
  };

  const clearChat = () => {
    setMessages([]);
    setLastResponse('');
    setAnalysis(null);
    setInput('');
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto p-4 bg-gray-50">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Your way to detect Biais</h2>
        {messages.length > 0 && (
          <button 
            onClick={clearChat}
            className="flex items-center text-sm text-gray-500 hover:text-gray-700"
            title="Effacer la conversation"
          >
            <FiTrash2 className="mr-1" /> Effacer
          </button>
        )}
      </div>
      
      <div className="flex-1 overflow-hidden flex flex-col bg-white rounded-lg shadow-lg">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 p-8">
              <FiInfo className="text-4xl mb-4 text-blue-200" />
              <h3 className="text-xl font-medium mb-2">Commencez une nouvelle conversation</h3>
              <p className="max-w-md">Posez votre question sur un sujet d'actualité et notre système analysera les biais potentiels dans la réponse.</p>
              <div className="mt-6 text-sm text-gray-400">
                <p>Exemples :</p>
                <ul className="mt-2 space-y-1">
                  <li>"Quels sont les arguments pour et contre le changement climatique ?"</li>
                  <li>"Qu'en pensent les experts sur la vaccination ?"</li>
                </ul>
              </div>
            </div>
          )}
          
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-lg p-3 ${msg.sender === 'user' 
                ? 'bg-blue-600 text-white rounded-br-none' 
                : 'bg-gray-100 text-gray-900 rounded-bl-none shadow-sm'}`}>
                {msg.text.split('\n').map((paragraph, i) => (
                  <p key={i} className="mb-2 last:mb-0">{paragraph}</p>
                ))}
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 text-gray-900 rounded-lg p-3 max-w-[80%] rounded-bl-none shadow-sm">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce delay-100"></div>
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce delay-200"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {lastResponse && !isLoading && (
          <div className="border-t border-gray-200 p-4 text-center bg-gray-50">
            <button
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-4 py-2 rounded-lg transition-colors flex items-center mx-auto"
              onClick={handleAnalysis}
            >
              <FiAlertCircle className="mr-2" />
              Analyser les biais potentiels
            </button>
          </div>
        )}

        {analysis ? (
          <div className="border-t border-gray-200 p-4 bg-yellow-50">
            <h3 className="font-semibold text-lg mb-3 flex items-center">
              <FiAlertCircle className="mr-2 text-yellow-600" />
              Analyse des biais détectés
            </h3>
            <div className="space-y-3">
              {analysis.map((bias, index) => (
                <div key={index} className="p-3 bg-white rounded-lg shadow-sm border-l-4 border-yellow-400">
                  <div className="flex items-start">
                    <div className={`flex-shrink-0 h-5 w-5 mt-0.5 ${
                      bias.severity === 'high' ? 'text-red-500' : 'text-orange-500'
                    }`}>
                      <FiAlertCircle className="w-full h-full" />
                    </div>
                    <div className="ml-3">
                      <h4 className="font-medium flex items-center">
                        {bias.type}
                        <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                          bias.severity === 'high' ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-orange-800'
                        }`}>
                          {bias.severity === 'high' ? 'Élevé' : 'Moyen'}
                        </span>
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">{bias.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : lastResponse && (
          <div className="border-t border-gray-200 p-4 bg-green-50 flex items-center justify-center">
            <FiCheckCircle className="text-green-500 mr-2" />
            <span className="text-green-700">Aucun biais significatif détecté dans cette réponse</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="border-t border-gray-200 p-4 bg-white">
          <div className="flex space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Posez votre question..."
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              disabled={isLoading}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  handleSubmit(e);
                }
              }}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 flex items-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Envoi...
                </span>
              ) : (
                <>
                  <FiSend className="mr-2" />
                  Envoyer
                </>
              )}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            Posez des questions sur des sujets d'actualité pour analyser les biais potentiels
          </p>
        </form>
      </div>
    </div>
  );
};

export default NewChat;