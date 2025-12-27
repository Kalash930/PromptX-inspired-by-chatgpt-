// const {GoogleGenAI}= require('@google/genai');

// const ai = new GoogleGenAI({process.env.GEMINI_API_KEY});

// async function generateResponse(prompt) {
//     const response=await ai.models.generateContent(
//         {
//             model: "gemini-2.5-flash",
//             content:prompt
//         }

//     )
//     return response.text;

// }


// module.exports={
//     generateResponse
// };

// const { GoogleGenAI } = require("@google/genai");

// // Uses GEMINI_API_KEY from environment by default
// const ai = new GoogleGenAI({});

// async function generateResponse(prompt) {
//   if (!prompt || typeof prompt !== "string") {
//     throw new Error("generateResponse: prompt must be a non-empty string");
//   }

//   const response = await ai.models.generateContent({
//     model: "gemini-2.5-flash",
//     // 🔴 IMPORTANT: **contents**, NOT `content`
//     // For simple text, you can just pass the string
//     contents: prompt,
//   });

//   // In the new SDK, `response.text` is a function
//    return response.output_text;
// }

// module.exports = {
//   generateResponse,
// };


// const { GoogleGenAI } = require("@google/genai");

// // Uses GEMINI_API_KEY from environment by default
// const ai = new GoogleGenAI({});

// async function generateResponse(prompt) {
//   if (!prompt || typeof prompt !== "string") {
//     throw new Error("generateResponse: prompt must be a non-empty string");
//   }

//   const response = await ai.models.generateContent({
//     model: "gemini-2.5-flash",
//     contents: prompt,   // ✅ correct key
//   });

//   // Optional: to debug once
//   // console.log("Raw Gemini response:", response);

//   // ✅ Correct way for this SDK
//   return response.text;
// }

// module.exports = {
//   generateResponse,
// };




const { GoogleGenAI } = require("@google/genai");

// Uses GEMINI_API_KEY from environment by default
const ai = new GoogleGenAI({});

async function generateResponse(input) {
  let contents;

  // 1) If you pass full chat history (array of { role, parts })
  if (Array.isArray(input)) {
    if (input.length === 0) {
      throw new Error("generateResponse: contents array is empty");
    }
    contents = input;
  }
  // 2) If you pass just a string prompt
  else if (typeof input === "string" && input.trim()) {
    contents = [
      {
        role: "user",
        parts: [{ text: input.trim() }],
      },
    ];
  } else {
    throw new Error("generateResponse: input must be a non-empty string or an array of messages");
  }

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents,
    config: {
  temperature: 0.7,
  systemInstruction: `
<system_instruction>

  <ai_name>PromptX</ai_name>

  <persona>
    You are PromptX — a friendly, smart, and always-helpful AI buddy.
    Your tone is playful, confident, and motivating.
    You speak primarily in Hinglish (Hindi + English), with a light Punjabi accent
    (warm, fun, energetic — but never overdone).
  </persona>

  <communication_style>
    - Use simple, clear explanations with real-life examples
    - Keep the vibe friendly like a tech-savvy dost
    - Add light humor or Punjabi-style expressions occasionally 
      (e.g., "Oye!", "Bilkul!", "Scene set hai", "Chak de phatte")
    - Never sound rude, arrogant, or robotic
    - Be supportive and encouraging, especially when the user is stuck
  </communication_style>

  <behavior>
    - Always try to be helpful and solution-oriented
    - If the user is confused, break the problem into small steps
    - If the user asks technical questions, explain from basics to advanced
    - If the user makes a mistake, correct them politely without shaming
    - Ask follow-up questions only when truly necessary
  </behavior>

  <technical_guidelines>
    - Prefer clean, readable explanations
    - Use code blocks for any code examples
    - Add comments in code when helpful
    - Explain concepts with real-world or practical use cases
  </technical_guidelines>

  <tone_control>
    - Playful but professional
    - Confident but never arrogant
    - Friendly Punjabi energy, not slang-heavy
  </tone_control>

  <goal>
    Help the user learn, build, and solve problems effectively,
    while making the conversation enjoyable and motivating.
  </goal>

</system_instruction>
`
}

  });

  // ---- Robust text extraction for different SDK shapes ----
  let text =
    response.output_text ||               // some versions use this
    response.text ||                      // others use this
    (response.candidates &&
      response.candidates[0] &&
      response.candidates[0].content &&
      Array.isArray(response.candidates[0].content.parts) &&
      response.candidates[0].content.parts
        .map((p) => p.text || "")
        .join(""));

  if (!text) text = "";

  return text;
}

// ------------------------------------------------------------


// Generate embedding vector for given input text
async function generateVector(input) {
  // Input validation
  if (typeof input !== "string" || !input.trim()) {
    throw new Error("generateVector: input must be a non-empty string");
  }


  // Call the embedding model
  const response = await ai.models.embedContent({
    model: "gemini-embedding-001",
    contents: [
      {
        role: "user",
        parts: [{ text: input.trim() }],
      },
    ],
    config: {
      outputDimensionality: 768, // specify desired dimensionality
    },
  });

  // ✅ CORRECT extraction
  const embedding = response.embeddings?.[0]?.values; // array of numbers
  // Robust error handling 
  if (!embedding) {
    console.error("Raw embedding response:", JSON.stringify(response, null, 2));
    throw new Error("generateVector: failed to generate embedding");
  }

  return embedding;
}




module.exports = {
  generateResponse,
  generateVector
};
