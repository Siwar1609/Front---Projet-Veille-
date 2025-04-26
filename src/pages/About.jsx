import React from 'react';

const About = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">About Nom Your Bias Analysis</h2>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="mb-4 text-gray-700">
          This application helps identify and analyze cognitive biases in conversations.
        </p>
        <p className="text-gray-700">
          Our mission is to make people aware of their unconscious biases and improve
          the quality of discussions and decision-making.
        </p>
      </div>
    </div>
  );
};

export default About;