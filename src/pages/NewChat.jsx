import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiBarChart2,
  FiSend,
  FiAlertCircle,
  FiCheckCircle,
  FiInfo,
  FiTrash2,
} from "react-icons/fi";

import { fetchLLMResponse, analyzeText } from "../services/api.js";

const NewChat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [lastResponse, setLastResponse] = useState("");
  const messagesEndRef = useRef(null);
  const [isAnalysisModalOpen, setIsAnalysisModalOpen] = useState(false);

  const navigate = useNavigate();

  // Style pour la modale
  const modalStyle = {
    position: "fixed",
    top: "0",
    left: "0",
    right: "0",
    bottom: "0",
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: "1000",
  };

  const modalContentStyle = {
    backgroundColor: "white",
    padding: "2rem",
    borderRadius: "8px",
    maxWidth: "600px",
    width: "90%",
    maxHeight: "80vh",
    overflowY: "auto",
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      setIsLoading(true);
      const response = await fetchLLMResponse(input);
      const llmMessage = { text: response, sender: "llm" };
      setMessages((prev) => [...prev, llmMessage]);
      setLastResponse(response);
      setAnalysis(null);
    } catch (error) {
      const errorMessage = {
        text: "Erreur lors de la génération de la réponse.",
        sender: "llm",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnalysis = async () => {
    if (!lastResponse) return;

    try {
      setIsAnalyzing(true);
      const apiAnalysis = await analyzeText(lastResponse);

      const formattedAnalysis = [];

      apiAnalysis.biases.forEach((bias) => {
        if (bias.label !== "not biased" && bias.score_percentage > 15) {
          formattedAnalysis.push({
            type: getFrenchLabel(bias.label),
            description: `Score: ${bias.score_percentage}%`,
            severity: getSeverity(bias.score_percentage),
          });
        }
      });

      if (apiAnalysis.sentiment) {
        formattedAnalysis.push({
          type: "Sentiment",
          description: `${apiAnalysis.sentiment.sentiment} (${apiAnalysis.sentiment.confidence_percentage}% de confiance)`,
          severity: "low",
        });
      }

      setAnalysis(formattedAnalysis.length > 0 ? formattedAnalysis : null);
      setIsAnalysisModalOpen(true); // Ouvrir la modale après l'analyse
    } catch (error) {
      console.error("Erreur d'analyse:", error);
      setAnalysis([
        {
          type: "Erreur d'analyse",
          description: error.message || "Impossible d'analyser le texte",
          severity: "high",
        },
      ]);
      setIsAnalysisModalOpen(true); // Ouvrir la modale même en cas d'erreur
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Ajoutez ces méthodes utilitaires dans votre composant
  const getFrenchLabel = (label) => {
    const labels = {
      "age bias": "Biais d'âge",
      "gender bias": "Biais de genre",
      "ethnic bias": "Biais ethnique",
      "religious bias": "Biais religieux",
      "political bias": "Biais politique",
      "not biased": "Non biaisé",
    };
    return labels[label] || label;
  };
  const getSeverity = (percentage) => {
    if (percentage > 30) return "high";
    if (percentage > 20) return "medium";
    return "low";
  };
  const clearChat = () => {
    setMessages([]);
    setLastResponse("");
    setAnalysis(null);
    setInput("");
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto p-4 bg-gray-50">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Your way to detect Biais
        </h2>
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
              <h3 className="text-xl font-medium mb-2">
                Commencez une nouvelle conversation
              </h3>
              <p className="max-w-md">
                Posez votre question sur un sujet d'actualité et notre système
                analysera les biais potentiels dans la réponse.
              </p>
              <div className="mt-6 text-sm text-gray-400">
                <p>Exemples :</p>
                <ul className="mt-2 space-y-1">
                  <li>
                    "Quels sont les arguments pour et contre le changement
                    climatique ?"
                  </li>
                  <li>"Qu'en pensent les experts sur la vaccination ?"</li>
                </ul>
              </div>
            </div>
          )}

          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  msg.sender === "user"
                    ? "bg-blue-600 text-white rounded-br-none"
                    : "bg-gray-100 text-gray-900 rounded-bl-none shadow-sm"
                }`}
              >
                {msg.text.split("\n").map((paragraph, i) => (
                  <p key={i} className="mb-2 last:mb-0">
                    {paragraph}
                  </p>
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
              disabled={isAnalyzing}
            >
              {isAnalyzing ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Analyse en cours...
                </>
              ) : (
                <>
                  <FiAlertCircle className="mr-2" />
                  Analyser les biais potentiels
                </>
              )}
            </button>
          </div>
        )}

        {isAnalysisModalOpen && (
          <div style={modalStyle} onClick={() => setIsAnalysisModalOpen(false)}>
            <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
              {/* En-tête de la modale */}
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Résultats de l'analyse</h2>
                <button
                  onClick={() => setIsAnalysisModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  &times;
                </button>
              </div>

              {analysis ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Biais détectés :</h3>
                    {analysis.filter((item) => item.type !== "Sentiment")
                      .length > 0 ? (
                      <div className="space-y-3">
                        {analysis
                          .filter((item) => item.type !== "Sentiment")
                          .map((bias, index) => (
                            <div
                              key={`bias-${index}`}
                              className={`p-3 rounded-lg border-l-4 ${
                                bias.severity === "high"
                                  ? "bg-red-50 border-red-400"
                                  : bias.severity === "medium"
                                  ? "bg-yellow-50 border-yellow-400"
                                  : "bg-blue-50 border-blue-400"
                              }`}
                            >
                              <div className="flex items-start">
                                <FiAlertCircle
                                  className={`mt-0.5 flex-shrink-0 ${
                                    bias.severity === "high"
                                      ? "text-red-500"
                                      : bias.severity === "medium"
                                      ? "text-yellow-500"
                                      : "text-blue-500"
                                  }`}
                                />
                                <div className="ml-3">
                                  <h4 className="font-medium">{bias.type}</h4>
                                  <p className="text-sm text-gray-600">
                                    {bias.description}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">
                        Aucun biais significatif détecté
                      </p>
                    )}
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Sentiment :</h3>
                    {analysis.find((a) => a.type === "Sentiment") && (
                      <div
                        className={`p-3 rounded-lg border-l-4 ${
                          analysis
                            .find((a) => a.type === "Sentiment")
                            ?.description.includes("Positive")
                            ? "bg-green-50 border-green-400"
                            : analysis
                                .find((a) => a.type === "Sentiment")
                                ?.description.includes("Negative")
                            ? "bg-red-50 border-red-400"
                            : "bg-yellow-50 border-yellow-400"
                        }`}
                      >
                        <div className="flex items-center">
                          {analysis
                            .find((a) => a.type === "Sentiment")
                            ?.description.includes("Positive") ? (
                            <FiCheckCircle className="text-green-500 mr-2" />
                          ) : (
                            <FiAlertCircle className="text-red-500 mr-2" />
                          )}
                          <span>
                            {
                              analysis.find((a) => a.type === "Sentiment")
                                ?.description
                            }
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <p>Chargement de l'analyse...</p>
              )}

              {/* Boutons en bas de la modale */}
              <div className="mt-6 flex justify-end space-x-4">
                <button
                  onClick={() => setIsAnalysisModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Fermer
                </button>
                <button
                  onClick={() => {
                    navigate("/dashboard", {
                      state: { analysisData: analysis },
                    });
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                >
                  <FiBarChart2 className="mr-2" />
                  Voir dashboard
                </button>
              </div>
            </div>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="border-t border-gray-200 p-4 bg-white"
        >
          <div className="flex space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Posez votre question..."
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              disabled={isLoading}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
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
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
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
            Posez des questions sur des sujets d'actualité pour analyser les
            biais potentiels
          </p>
        </form>
      </div>
    </div>
  );
};

export default NewChat;
