import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { FiAlertCircle, FiCheckCircle } from 'react-icons/fi';
import { Chart, BarController, CategoryScale, LinearScale, BarElement, Tooltip, ArcElement } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { Bar } from 'react-chartjs-2';

// Register Chart.js components
Chart.register(BarController, CategoryScale, LinearScale, BarElement, Tooltip, ArcElement);

const Dashboard = () => {
  const location = useLocation();
  const analysisData = location.state?.analysisData || [];

  // If no data is passed, show a message
  if (!analysisData || analysisData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h2 className="text-2xl font-bold mb-4">Aucune donnée d'analyse disponible</h2>
        <p className="text-gray-600">
          Veuillez effectuer une analyse depuis la page de chat pour voir les résultats.
        </p>
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
      borderWidth: 1,
    }]
  };

  const biasChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.parsed.y}%`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        title: {
          display: true,
          text: 'Score (%)'
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
    cutout: '70%',
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        enabled: false
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Tableau de bord des biais</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Bias Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-center">Répartition des biais détectés</h2>
          <div className="h-80">
            <Bar data={biasChartData} options={biasChartOptions} />
          </div>
        </div>

        {/* Sentiment Chart (if available) */}
        {sentiment && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-center">Analyse de sentiment</h2>
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
                <span className="text-gray-600">
                  {parseFloat(sentiment.description.match(/\d+/)[0])}% de confiance
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bias Details */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Détails des biais détectés</h2>
        {biases.length > 0 ? (
          <div className="space-y-4">
            {biases.map((bias, index) => (
              <div
                key={`bias-${index}`}
                className={`p-4 rounded-lg border-l-4 ${
                  bias.severity === "high"
                    ? "bg-red-50 border-red-400"
                    : bias.severity === "medium"
                    ? "bg-yellow-50 border-yellow-400"
                    : "bg-blue-50 border-blue-400"
                }`}
              >
                <div className="flex items-start">
                  <FiAlertCircle
                    className={`mt-1 flex-shrink-0 ${
                      bias.severity === "high"
                        ? "text-red-500"
                        : bias.severity === "medium"
                        ? "text-yellow-500"
                        : "text-blue-500"
                    }`}
                  />
                  <div className="ml-3">
                    <h3 className="font-medium text-lg">{bias.type}</h3>
                    <p className="text-gray-600">{bias.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">Aucun biais significatif détecté</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;