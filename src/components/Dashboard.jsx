import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { FiAlertCircle, FiCheckCircle, FiInfo, FiDownload, FiCheck } from 'react-icons/fi';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Chart, BarController, CategoryScale, LinearScale, BarElement, Tooltip, ArcElement, Legend } from 'chart.js';
import ReportPDF from './ReportPDF';
import { PDFDownloadLink } from '@react-pdf/renderer';

// Register Chart.js components
Chart.register(BarController, CategoryScale, LinearScale, BarElement, Tooltip, ArcElement, Legend);

const Dashboard = () => {
  const location = useLocation();
  const analysisData = location.state?.analysisData || [];
  const [exportStatus, setExportStatus] = useState('idle'); // 'idle' | 'generating' | 'success'

  // Reset status after successful export
  useEffect(() => {
    if (exportStatus === 'success') {
      const timer = setTimeout(() => setExportStatus('idle'), 3000);
      return () => clearTimeout(timer);
    }
  }, [exportStatus]);

  // If no data is passed, show a message
  if (!analysisData || analysisData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md">
          <FiInfo className="mx-auto text-4xl text-blue-500 mb-4" />
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Aucune donnée disponible</h2>
          <p className="text-gray-600 mb-6">
            Veuillez effectuer une analyse depuis la page de chat pour voir les résultats.
          </p>
          <button className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-full transition-all duration-300 transform hover:scale-105">
            Retour à l'analyse
          </button>
        </div>
      </div>
    );
  }

  // Separate biases and sentiment
  const biases = analysisData.filter(item => item.type !== "Sentiment");
  const sentiment = analysisData.find(item => item.type === "Sentiment");

  // Prepare data for bias chart
  const biasChartData = {
    labels: biases.map(bias => bias.type),
    datasets: [{
      label: 'Score (%)',
      data: biases.map(bias => parseFloat(bias.description.match(/\d+/)[0])),
      backgroundColor: biases.map(bias => 
        bias.severity === "high" ? '#ef4444' : 
        bias.severity === "medium" ? '#f59e0b' : '#3b82f6'
      ),
      borderWidth: 0,
      borderRadius: 6,
    }]
  };

  const biasChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.parsed.y}%`;
          }
        },
        displayColors: false,
        backgroundColor: '#1f2937',
        titleFont: {
          size: 14,
          weight: 'bold'
        },
        bodyFont: {
          size: 12
        },
        padding: 12,
        cornerRadius: 8
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        grid: {
          color: '#e5e7eb',
          drawBorder: false
        },
        ticks: {
          color: '#6b7280',
          font: {
            weight: '500'
          }
        },
        title: {
          display: true,
          text: 'Score (%)',
          color: '#6b7280',
          font: {
            size: 12,
            weight: '600'
          }
        }
      },
      x: {
        grid: {
          display: false,
          drawBorder: false
        },
        ticks: {
          color: '#6b7280',
          font: {
            weight: '500'
          }
        }
      }
    }
  };

  let sentimentData = null;
  if (sentiment) {
    const sentimentScore = parseFloat(sentiment.description.match(/\d+/)[0]);
    const isPositive = sentiment.description.includes("Positive");
    const isNegative = sentiment.description.includes("Negative");

    sentimentData = {
      labels: ['Sentiment'],
      datasets: [{
        data: [sentimentScore, 100 - sentimentScore],
        backgroundColor: [
          isPositive ? '#10b981' : isNegative ? '#ef4444' : '#f59e0b',
          '#e5e7eb'
        ],
        borderWidth: 0,
        circumference: 180,
        rotation: 270
      }]
    };
  }

  const sentimentOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '75%',
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        enabled: false
      }
    }
  };

  // Calculate overall bias score
  const overallBiasScore = biases.length > 0 
    ? biases.reduce((sum, bias) => sum + parseFloat(bias.description.match(/\d+/)[0]), 0) / biases.length
    : 0;

  // Severity counts
  const severityCounts = {
    high: biases.filter(b => b.severity === 'high').length,
    medium: biases.filter(b => b.severity === 'medium').length,
    low: biases.filter(b => b.severity === 'low').length
  };

  // Get button content based on export status
  const getExportButtonContent = () => {
    switch (exportStatus) {
      case 'generating':
        return (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Génération en cours...
          </>
        );
      case 'success':
        return (
          <>
            <FiCheck className="mr-2" />
            PDF généré !
          </>
        );
      default:
        return (
          <>
            <FiDownload className="mr-2" />
            Exporter le rapport
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Analyse des Biais</h1>
            <p className="text-gray-600 mt-2">Résultats détaillés de l'analyse de votre contenu</p>
          </div>
          <div className="mt-4 md:mt-0 bg-white px-4 py-2 rounded-full shadow-sm flex items-center">
            <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
            <span className="text-sm font-medium text-gray-700">Dernière analyse: {new Date().toLocaleDateString()}</span>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-blue-500">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Score Global</p>
                <h3 className="text-3xl font-bold text-gray-800 mt-1">{Math.round(overallBiasScore)}%</h3>
              </div>
              <div className="bg-blue-100 p-2 rounded-lg">
                <FiInfo className="text-blue-500" />
              </div>
            </div>
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full" 
                  style={{ width: `${overallBiasScore}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-purple-500">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Biais Détectés</p>
                <h3 className="text-3xl font-bold text-gray-800 mt-1">{biases.length}</h3>
              </div>
              <div className="bg-purple-100 p-2 rounded-lg">
                <FiAlertCircle className="text-purple-500" />
              </div>
            </div>
            <div className="mt-4 flex space-x-2">
              <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                {severityCounts.high} Haut
              </span>
              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                {severityCounts.medium} Moyen
              </span>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                {severityCounts.low} Faible
              </span>
            </div>
          </div>

          {sentiment && (
            <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-green-500">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500">Sentiment</p>
                  <h3 className="text-3xl font-bold text-gray-800 mt-1">
                    {sentiment.description.includes("Positive") ? "Positif" : 
                     sentiment.description.includes("Negative") ? "Négatif" : "Neutre"}
                  </h3>
                </div>
                <div className={`p-2 rounded-lg ${
                  sentiment.description.includes("Positive") ? "bg-green-100" : 
                  sentiment.description.includes("Negative") ? "bg-red-100" : "bg-yellow-100"
                }`}>
                  <FiCheckCircle className={
                    sentiment.description.includes("Positive") ? "text-green-500" : 
                    sentiment.description.includes("Negative") ? "text-red-500" : "text-yellow-500"
                  } />
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-600">
                  Confiance: {parseFloat(sentiment.description.match(/\d+/)[0])}%
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Bias Chart */}
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Répartition des Biais</h2>
            </div>
            <div className="h-80">
              <Bar data={biasChartData} options={biasChartOptions} />
            </div>
          </div>

          {/* Sentiment Chart */}
          {sentiment && (
            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Analyse de Sentiment</h2>
              <div className="relative h-80">
                <Doughnut data={sentimentData} options={sentimentOptions} />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold" style={{
                    color: sentiment.description.includes("Positive") 
                      ? '#10b981' 
                      : sentiment.description.includes("Negative") 
                        ? '#ef4444' 
                        : '#f59e0b'
                  }}>
                    {sentiment.description.split('(')[0].trim()}
                  </span>
                  <span className="text-gray-600 text-sm mt-1">
                    {parseFloat(sentiment.description.match(/\d+/)[0])}% de confiance
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bias Details */}
        <div className="bg-white p-6 rounded-2xl shadow-sm mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Détails des Biais</h2>
            <PDFDownloadLink
              document={<ReportPDF analysisData={analysisData} />}
              fileName={`rapport-analyse-${new Date().toISOString().slice(0, 10)}.pdf`}
              className={`flex items-center px-4 py-2 rounded transition-colors ${
                exportStatus === 'success' 
                  ? 'bg-green-500 hover:bg-green-600' 
                  : 'bg-blue-500 hover:bg-blue-600'
              } text-white font-medium`}
            >
              {({ loading }) => {
                useEffect(() => {
                  if (loading) {
                    setExportStatus('generating');
                  } else if (exportStatus === 'generating') {
                    setExportStatus('success');
                  }
                }, [loading]);

                return getExportButtonContent();
              }}
            </PDFDownloadLink>
          </div>

          {biases.length > 0 ? (
            <div className="space-y-4">
              {biases.map((bias, index) => (
                <div
                  key={`bias-${index}`}
                  className={`p-5 rounded-xl transition-all duration-300 hover:shadow-md ${
                    bias.severity === "high"
                      ? "bg-gradient-to-r from-red-50 to-white border-l-4 border-red-500"
                      : bias.severity === "medium"
                      ? "bg-gradient-to-r from-yellow-50 to-white border-l-4 border-yellow-500"
                      : "bg-gradient-to-r from-blue-50 to-white border-l-4 border-blue-500"
                  }`}
                >
                  <div className="flex items-start">
                    <div className={`p-2 rounded-lg mr-4 ${
                      bias.severity === "high"
                        ? "bg-red-100 text-red-500"
                        : bias.severity === "medium"
                        ? "bg-yellow-100 text-yellow-500"
                        : "bg-blue-100 text-blue-500"
                    }`}>
                      <FiAlertCircle className="text-lg" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className="font-bold text-lg text-gray-800">{bias.type}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          bias.severity === "high"
                            ? "bg-red-100 text-red-800"
                            : bias.severity === "medium"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-blue-100 text-blue-800"
                        }`}>
                          {bias.severity === "high" ? "Élevé" : 
                           bias.severity === "medium" ? "Moyen" : "Faible"}
                        </span>
                      </div>
                      <p className="text-gray-600 mt-1">{bias.description}</p>
                      <div className="mt-3 flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className="h-2 rounded-full" 
                            style={{
                              width: `${parseFloat(bias.description.match(/\d+/)[0])}%`,
                              backgroundColor: bias.severity === "high" ? '#ef4444' : 
                                            bias.severity === "medium" ? '#f59e0b' : '#3b82f6'
                            }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-500">
                          {parseFloat(bias.description.match(/\d+/)[0])}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FiCheckCircle className="mx-auto text-4xl text-green-500 mb-4" />
              <h3 className="text-xl font-medium text-gray-800">Aucun biais significatif détecté</h3>
              <p className="text-gray-600 mt-1">Votre contenu semble équilibré et objectif</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;