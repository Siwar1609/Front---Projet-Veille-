import React from 'react';
import { FiInfo, FiTarget, FiBarChart2, FiUsers, FiShield } from 'react-icons/fi';

const About = () => {
  const features = [
    {
      icon: <FiTarget className="w-6 h-6 text-blue-500" />,
      title: "Détection précise",
      description: "Identification des biais cognitifs avec des algorithmes avancés"
    },
    {
      icon: <FiBarChart2 className="w-6 h-6 text-blue-500" />,
      title: "Analyses détaillées",
      description: "Visualisations claires des résultats et tendances"
    },
    {
      icon: <FiUsers className="w-6 h-6 text-blue-500" />,
      title: "Pour tous",
      description: "Accessible aux particuliers comme aux professionnels"
    },
    {
      icon: <FiShield className="w-6 h-6 text-blue-500" />,
      title: "Respect de la vie privée",
      description: "Vos données restent confidentielles"
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
          À propos de <span className="text-blue-600"> ISO 5055 Chat</span>
        </h1>
        <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
          Votre compagnon pour des discussions et explications de ISO 5055
        </p>
      </div>

      <div className="bg-white shadow-xl rounded-lg overflow-hidden mb-12">
        <div className="px-6 py-8 sm:p-10">
          <div className="flex items-start">
            <div className="flex-shrink-0 bg-blue-100 p-3 rounded-lg">
              <FiInfo className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <h2 className="text-2xl font-bold text-gray-900">Notre mission</h2>
              <p className="mt-2 text-gray-600">
                   ISO 5055 Chat est un assistant intelligent conçu pour aider les développeurs à évaluer et améliorer la qualité de leur code source, en s’appuyant sur les recommandations de la norme ISO 5055. </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 mb-12">
        {features.map((feature, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-4">
              <div className="mr-4">
                {feature.icon}
              </div>
              <h3 className="text-lg font-medium text-gray-900">{feature.title}</h3>
            </div>
            <p className="text-gray-600">{feature.description}</p>
          </div>
        ))}
      </div>

      <div className="bg-blue-50 rounded-lg p-6">
        <h3 className="text-lg font-medium text-blue-800 mb-4">Comment ça marche ?</h3>
        <ol className="space-y-4">
          <li className="flex items-start">
            <span className="flex-shrink-0 bg-blue-100 text-blue-800 font-bold rounded-full h-6 w-6 flex items-center justify-center mr-3">1</span>
            <p className="text-gray-700">Saisissez ou importez votre conversation</p>
          </li>
          <li className="flex items-start">
            <span className="flex-shrink-0 bg-blue-100 text-blue-800 font-bold rounded-full h-6 w-6 flex items-center justify-center mr-3">2</span>
            <p className="text-gray-700">Notre algorithme analyse le contenu en temps réel</p>
          </li>
          <li className="flex items-start">
            <span className="flex-shrink-0 bg-blue-100 text-blue-800 font-bold rounded-full h-6 w-6 flex items-center justify-center mr-3">3</span>
            <p className="text-gray-700">Recevez un rapport détaillé des biais détectés</p>
          </li>
          <li className="flex items-start">
            <span className="flex-shrink-0 bg-blue-100 text-blue-800 font-bold rounded-full h-6 w-6 flex items-center justify-center mr-3">4</span>
            <p className="text-gray-700">Améliorez vos futures interactions grâce à ces insights</p>
          </li>
        </ol>
      </div>
    </div>
  );
};

export default About;