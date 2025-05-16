import React from 'react';
import { useLocation } from 'react-router-dom';
import { FiAlertCircle, FiCheckCircle } from 'react-icons/fi';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import HighchartsMore from 'highcharts/highcharts-more';
import SolidGauge from 'highcharts/modules/solid-gauge';
import Accessibility from 'highcharts/modules/accessibility';

// Initialisation des modules
HighchartsMore(Highcharts);
SolidGauge(Highcharts);
Accessibility(Highcharts);

const Dashboard = () => {
  const location = useLocation();
  const analysisData = location.state?.analysisData || [];

  // Si aucune donnée n'est passée, afficher un message
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

  // Séparer les biais et le sentiment
  const biases = analysisData.filter(item => item.type !== "Sentiment");
  const sentiment = analysisData.find(item => item.type === "Sentiment");

  // Préparer les données pour le graphique des biais
  const biasChartData = biases.map(bias => ({
    name: bias.type,
    y: parseFloat(bias.description.match(/\d+/)[0]), // Extraire le pourcentage
    color: bias.severity === "high" ? '#ef4444' : 
           bias.severity === "medium" ? '#f59e0b' : '#3b82f6'
  }));

 const biasChartOptions = {
    accessibility: {
      enabled: true
    },
    chart: {
      type: 'bar'
    },
    title: {
      text: 'Répartition des biais détectés'
    },
    xAxis: {
      type: 'category'
    },
    yAxis: {
      title: {
        text: 'Score (%)'
      },
      max: 100
    },
    legend: {
      enabled: false
    },
    plotOptions: {
      bar: {
        dataLabels: {
          enabled: true,
          format: '{point.y}%'
        },
        colorByPoint: true
      }
    },
    series: [{
      name: 'Score',
      data: biasChartData
    }],
    credits: {
      enabled: false
    }
  };

  let sentimentChartOptions = null;
  if (sentiment) {
    const sentimentScore = parseFloat(sentiment.description.match(/\d+/)[0]);
    const isPositive = sentiment.description.includes("Positive");
    const isNegative = sentiment.description.includes("Negative");

    sentimentChartOptions = {
      accessibility: {
        enabled: true
      },
      chart: {
        type: 'solidgauge',
        height: '80%'
      },
      title: {
        text: 'Analyse de sentiment'
      },
      pane: {
        center: ['50%', '85%'],
        size: '140%',
        startAngle: -90,
        endAngle: 90,
        background: {
          backgroundColor: '#EEE',
          innerRadius: '60%',
          outerRadius: '100%',
          shape: 'arc'
        }
      },
      tooltip: {
        enabled: false
      },
      yAxis: {
        min: 0,
        max: 100,
        stops: [
          [0.1, '#ef4444'], // rouge
          [0.5, '#f59e0b'], // orange
          [0.9, '#10b981']  // vert
        ],
        lineWidth: 0,
        tickWidth: 0,
        minorTickInterval: null,
        labels: {
          y: 16
        }
      },
      plotOptions: {
        solidgauge: {
          dataLabels: {
            y: -30,
            borderWidth: 0,
            useHTML: true,
            format: `
              <div style="text-align:center">
                <span style="font-size:1.5em;color:${isPositive ? '#10b981' : isNegative ? '#ef4444' : '#f59e0b'}">
                  ${sentiment.description.split('(')[0].trim()}
                </span><br>
                <span style="font-size:1em;color:#666">
                  ${sentimentScore}% de confiance
                </span>
              </div>
            `
          }
        }
      },
      series: [{
        name: 'Sentiment',
        data: [sentimentScore],
        dataLabels: {
          format: '{y}%'
        }
      }],
      credits: {
        enabled: false
      }
    };
  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Tableau de bord des biais</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Graphique des biais */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <HighchartsReact
            highcharts={Highcharts}
            options={biasChartOptions}
          />
        </div>

        {/* Graphique de sentiment (si disponible) */}
        {sentimentChartOptions && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <HighchartsReact
              highcharts={Highcharts}
              options={sentimentChartOptions}
            />
          </div>
        )}
      </div>

      {/* Détails des biais */}
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