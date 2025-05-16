const API_BASE_URL = 'http://127.0.0.1:8000';

export const fetchLLMResponse = async (question) => {
  try {
    const res = await fetch(`${API_BASE_URL}/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: question }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(
        `Erreur ${res.status}: ${errorData.detail || res.statusText}`
      );
    }

    const data = await res.json();
    return data.response;
  } catch (err) {
    console.error("Erreur fetchLLMResponse:", {
      message: err.message,
      stack: err.stack,
    });
    throw err;
  }
};

export const analyzeText = async (text) => {
  try {
    const res = await fetch(`${API_BASE_URL}/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(
        `Erreur ${res.status}: ${errorData.detail || res.statusText}`
      );
    }

    return await res.json();
  } catch (error) {
    console.error("Erreur analyzeText:", {
      message: error.message,
      stack: error.stack,
    });
    throw error;
  }
};