// aiExplainer.js

// Replace with your API endpoint, backend proxy, or Gemini API Key
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';
const API_KEY = typeof process !== 'undefined' && process.env?.VITE_GEMINI_API_KEY
  ? process.env.VITE_GEMINI_API_KEY
  : (typeof localStorage !== 'undefined' ? localStorage.getItem('az900_gemini_api_key') : null) || 'YOUR_GEMINI_API_KEY';

/**
 * Generates an everyday real-life analogy for a given Azure concept or flashcard question.
 * @param {string} conceptTitle - e.g., "Azure Blob Storage vs Azure Disk Storage"
 * @param {string} conceptDefinition - e.g., "Unstructured object storage vs block storage for VMs"
 */
export async function getRealLifeAnalogy(conceptTitle, conceptDefinition) {
  const prompt = `
    You are an expert, encouraging tutor for the Microsoft Azure AZ-900 certification.
    Explain the following Azure concept using a simple, relatable, real-life everyday analogy (like cooking, running a shop, commuting, or managing a household).
    
    Concept: ${conceptTitle}
    Official Definition: ${conceptDefinition}

    Requirements:
    1. Keep the explanation under 3 short bullet points or 1-2 brief paragraphs.
    2. Use friendly, simple language suitable for beginners.
    3. Conclude with a 1-sentence "Key Takeaway to Remember".
  `;

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }]
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    const explanationText = data.candidates[0]?.content?.parts[0]?.text;
    return explanationText || "Could not generate an explanation at this time.";
  } catch (error) {
    console.error('AI Analogy Error:', error);
    return "💡 *Analogy unavailable offline. Try again when connected.*";
  }
}
