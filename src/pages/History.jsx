import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../App';
import { FiClock, FiMessageSquare, FiChevronDown, FiChevronUp, FiTrash2 } from 'react-icons/fi';

const History = () => {
  const { conversations } = useContext(AppContext);
  const [apiPrompts, setApiPrompts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedPromptId, setExpandedPromptId] = useState(null);

  useEffect(() => {
    fetchPrompts();
  }, []);

  const fetchPrompts = async () => {
    try {
      const response = await fetch('http://localhost:8000/prompts/');
      if (!response.ok) throw new Error('Erreur de chargement');
      const data = await response.json();
      
      // Nettoyage et filtrage des données
      const cleanedPrompts = data
        .map(prompt => ({
          ...prompt,
          prompt_text: prompt.prompt_text?.trim() || '',
          response_text: prompt.response_text?.trim() || ''
        }))
        .filter(prompt => prompt.response_text && prompt.response_text.length > 0); // Filtre les prompts sans réponse

      const sortedPrompts = cleanedPrompts.sort((a, b) => 
        new Date(b.created_at) - new Date(a.created_at));
      
      setApiPrompts(sortedPrompts);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deletePrompt = async (id) => {
    try {
      const response = await fetch(`http://localhost:8000/prompts/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) throw new Error('Échec de la suppression');
      
      fetchPrompts();
    } catch (err) {
      console.error("Erreur lors de la suppression:", err);
      setError(err.message);
    }
  };

  const parseAnalysisData = (data) => {
    if (!data) return null;
    
    if (typeof data === 'object') return data;
    
    try {
      return JSON.parse(data);
    } catch (e) {
      console.warn("Échec du parsing JSON:", e);
      return null;
    }
  };

  const formatDate = (dateString) => {
    const options = { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  const toggleExpand = (id) => {
    setExpandedPromptId(expandedPromptId === id ? null : id);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
        <p className="text-sm text-red-700">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Historique des prompts et réponses</h2>
            <p className="mt-1 text-sm text-gray-500">Tous vos prompts avec réponses</p>
          </div>
        </div>

        <ul className="divide-y divide-gray-200">
          {apiPrompts.length === 0 ? (
            <li className="px-6 py-12 text-center">
              <FiMessageSquare className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun historique</h3>
              <p className="mt-1 text-sm text-gray-500">Vos prompts avec réponses apparaîtront ici.</p>
            </li>
          ) : (
            apiPrompts.map((prompt) => {
              const biases = parseAnalysisData(prompt.bias_analysis);
              const sentiment = parseAnalysisData(prompt.sentiment_analysis);
              const isExpanded = expandedPromptId === prompt.id;

              return (
                <li key={prompt.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div 
                      className="flex-1 cursor-pointer"
                      onClick={() => toggleExpand(prompt.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <FiClock className="mr-2 text-gray-400" />
                          <span className="text-sm text-gray-500">{formatDate(prompt.created_at)}</span>
                        </div>
                        <button className="text-gray-400 hover:text-gray-600">
                          {isExpanded ? <FiChevronUp /> : <FiChevronDown />}
                        </button>
                      </div>
                      
                      {!isExpanded && (
                        <div className="mt-2">
                          <h4 className="font-medium text-gray-700">Prompt</h4>
                          <p className="text-gray-800 mt-1 line-clamp-2">
                            {prompt.prompt_text || "Aucun texte de prompt"}
                          </p>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deletePrompt(prompt.id);
                      }}
                      className="text-red-500 hover:text-red-700 p-2 ml-4"
                      title="Supprimer cette entrée"
                    >
                      <FiTrash2 />
                    </button>
                  </div>

                  {isExpanded && (
                    <div className="mt-4 space-y-4 pl-2 border-l-2 border-gray-200">
                      <div>
                        <h4 className="font-medium text-gray-700">Prompt</h4>
                        <p className="text-gray-800 mt-1 whitespace-pre-wrap">
                          {prompt.prompt_text || "Aucun texte de prompt"}
                        </p>
                      </div>

                      <div className="mt-4">
                        <h4 className="font-medium text-gray-700">Réponse</h4>
                        <div className="bg-blue-50 p-3 rounded text-gray-800 mt-1 whitespace-pre-wrap">
                          {prompt.response_text}
                        </div>
                      </div>

                      {biases && (
                        <div className="mt-4">
                          <h4 className="font-medium text-gray-700">Analyse des biais</h4>
                          {Array.isArray(biases) ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                              {biases.map((bias, index) => (
                                <div key={index} className="bg-gray-50 p-3 rounded-md border border-gray-200">
                                  <div className="flex justify-between items-center mb-1">
                                    <span className="text-sm font-medium text-gray-700 capitalize">
                                      {bias.label?.replace(' bias', '') || 'Biais non spécifié'}
                                    </span>
                                    <span className="text-sm font-semibold">
                                      {bias.score_percentage}%
                                    </span>
                                  </div>
                                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                                    <div
                                      className={`h-2 rounded-full ${
                                        bias.label === 'not biased' ? 'bg-green-500' : 'bg-yellow-500'
                                      }`}
                                      style={{ width: `${Math.min(100, bias.score_percentage)}%` }}
                                    ></div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="bg-gray-50 p-3 rounded-md text-gray-700">
                              Format d'analyse des biais non reconnu
                            </div>
                          )}
                        </div>
                      )}

                      {sentiment && (
                        <div className="mt-4">
                          <h4 className="font-medium text-gray-700">Analyse de sentiment</h4>
                          <div className="bg-gray-50 p-3 rounded-md mt-1">
                            {sentiment.sentiment && sentiment.confidence_percentage ? (
                              <div className="flex items-center space-x-4">
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                  sentiment.sentiment === 'Positive' ? 'bg-green-100 text-green-800' :
                                  sentiment.sentiment === 'Negative' ? 'bg-red-100 text-red-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {sentiment.sentiment === 'Positive' ? 'Positif' :
                                   sentiment.sentiment === 'Negative' ? 'Négatif' :
                                   'Neutre'}
                                </span>
                                <span className="text-sm text-gray-600">
                                  Confiance: {sentiment.confidence_percentage}%
                                </span>
                              </div>
                            ) : (
                              <p className="text-gray-700">Format d'analyse de sentiment non reconnu</p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </li>
              );
            })
          )}
        </ul>
      </div>
    </div>
  );
};

export default History;