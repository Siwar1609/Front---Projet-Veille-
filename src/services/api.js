// api.js
const fetchLLMResponse = async (question) => {
    try {
      const res = await fetch('http://127.0.0.1:8000/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: question }),
      });
  
      if (!res.ok) {
        throw new Error(`Erreur HTTP: ${res.status}`);
      }
  
      const data = await res.json();
      return data.response;
    } catch (err) {
      console.error("Erreur de communication avec l'API:", err);
      throw err; // On propage l'erreur pour la gérer dans le composant
    }
  };
  
  export { fetchLLMResponse };