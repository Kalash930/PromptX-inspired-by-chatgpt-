



// const { Pinecone } = require("@pinecone-database/pinecone"); // ✅ updated import

// const pc = new Pinecone({
//   apiKey: process.env.PINECONE_API_KEY,
// });  // ✅ updated initialization

// const cohortChatGptIndex = pc.Index("cohort-chat-gpt");  // ✅ updated index name

// /* ============================
//    Store Memory
// ============================ */
// async function createMemory({ vector, metadata, messageId }) {
//   await cohortChatGptIndex.upsert([
//     {
//       id: messageId.toString(),
//       values: Array.from(vector),
//       metadata,
//     },
//   ]);
// }

// /* ============================
//    Query Memory
// ============================ */
// async function queryMemory({ queryVector, limit = 5, filter }) {
//   const data = await cohortChatGptIndex.query({
//     vector: Array.from(queryVector),    // ✅ safe conversion
//     topK: limit,
//     filter,                             // ✅ direct metadata fields
//     includeMetadata: true,
//   });

//   return data.matches;
// }

// module.exports = {
//   createMemory,
//   queryMemory,
// };










const { Pinecone } = require("@pinecone-database/pinecone");

const pc = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
});

const cohortChatGptIndex = pc.Index("cohort-chat-gpt");

/* ============================
   Store Memory (SECURE)
============================ */
async function createMemory({ vector, metadata, messageId }) {
  // ❌ Do nothing if vector is invalid
  if (!vector || !vector.length) return;

  // 🔐 SECURITY: user is mandatory
  if (!metadata?.user) {
    throw new Error("SECURITY: metadata.user is required");
  }

  await cohortChatGptIndex.upsert([
    {
      id: messageId.toString(),
      values: Array.from(vector), // Pinecone needs number[]
      metadata: {
        ...metadata,
        user: metadata.user.toString(), // 🔐 FORCE STRING
      },
    },
  ]);
}

/* ============================
   Query Memory (SECURE)
============================ */
async function queryMemory({ queryVector, limit = 5, filter }) {
  // ❌ No vector → no memory
  if (!queryVector || !queryVector.length) return [];

  // 🔥 THIS LINE FIXES YOUR BUG
  if (!filter || !filter.user) {
    throw new Error("SECURITY: user filter is mandatory");
  }

  const data = await cohortChatGptIndex.query({
    vector: Array.from(queryVector),
    topK: limit,
    filter: {
      user: filter.user.toString(),        // 🔐 HARD USER SCOPE
      ...(filter.type && { type: filter.type }), // optional (identity/normal)
    },
    includeMetadata: true,
  });

  // ✅ Optional but recommended: similarity threshold
  return data.matches.filter(match => match.score > 0.75);
}

module.exports = {
  createMemory,
  queryMemory,
};
