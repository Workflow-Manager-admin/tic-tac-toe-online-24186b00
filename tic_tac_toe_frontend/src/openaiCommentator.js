const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

/**
 * PUBLIC_INTERFACE
 * Call OpenAI API to generate a brief commentary on the last move.
 * @param {string} boardStateStr - Human readable board state/move context
 * @param {string} moveDescription - Human description of the move ("X put on 1,2" etc)
 * @param {string} apiKey - User's OpenAI API key
 * @returns {Promise<string>} AI-generated commentary or throws error
 */
export async function fetchAICommentary(boardStateStr, moveDescription, apiKey) {
  // Compose a clear, light prompt to keep commentary brief and relevant
  const prompt = `
You are an exciting live game commentator for Tic Tac Toe. The following move just happened:
${moveDescription}
Current board state:
${boardStateStr}
In 1-2 sentences, provide exciting, witty, family-friendly commentary on this game action (avoid coaching or revealing next move):
`;

  const body = {
    model: "gpt-3.5-turbo", // fast and cheap, adjust if preferred
    messages: [
      { role: "system", content: "You are an enthusiastic, concise commentator for Tic Tac Toe games." },
      { role: "user", content: prompt }
    ],
    max_tokens: 60,
    temperature: 0.85,
    n: 1
  };
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);
    const res = await fetch(OPENAI_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body),
      signal: controller.signal
    });
    clearTimeout(timeout);
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`OpenAI error (${res.status}): ${text}`);
    }
    const json = await res.json();
    const msg = json?.choices?.[0]?.message?.content?.trim();
    if (!msg) throw new Error("No commentary generated.");
    return msg;
  } catch (err) {
    if (err.name === "AbortError") {
      throw new Error("Commentary fetch timed out.");
    } else if (err.message.includes("401")) {
      throw new Error("Invalid OpenAI API key.");
    }
    throw new Error("Could not fetch commentary. " + err.message);
  }
}
