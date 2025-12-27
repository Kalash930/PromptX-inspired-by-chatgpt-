

/*






const { Server } = require("socket.io");  // Import the Socket.IO server class
const userModel = require('../models/user.model'); // Import the user model
const messageModel = require('../models/message.model'); // Import the message model
const aiService = require('../services/ai.service'); // Import the AI service
const cookie = require('cookie'); // Import the cookie parsing library
const jwt = require('jsonwebtoken'); // Import the JSON Web Token library

const {createMemory,queryMemory}=require('../services/vector.service');




// Function to initialize the socket server
function initSocketServer(httpServer) {
    // Create a new Socket.IO server instance
    const io=new Server(httpServer,{});

    // Middleware to authenticate socket connections
    io.use( async(socket,next)=>{
        // Parse cookies from the socket handshake headers
        const cookies=cookie.parse(socket.handshake.headers.cookie || '');
        // Check if the token cookie is present
        if(!cookies.token){
            return next(new Error("Unauthorized"));
        }
        // Verify the JWT token and retrieve the user
        try {
            
            const decoded=jwt.verify(cookies.token,process.env.JWT_SECRET);
            const user= await userModel.findById(decoded.id); // Fetch user from database
            socket.user=user; // Attach user to the socket object
            next(); // Proceed to the next middleware or connection handler
            
        } catch (error) {
            return next(new Error("Unauthorized"));
            
        }



    })
    io.on('connection',(socket)=>{

        


        

        socket.on("ai-message", async (messagePayload) => {

            try {

                console.log("Received AI message:", messagePayload);


                // Store the user message in the database
                const message=await messageModel.create({
                    chat: messagePayload.chat,
                    user: socket.user._id,
                    content: messagePayload.content,
                    role: "user"

                })



                // Generate vector for the user message

                let vector;
                let memory = [];   // ✅ declare in outer scope





                

                try {
                    // Generate embedding vector for the message content
                   vector = await aiService.generateVector(messagePayload.content);
                } catch (e) {
                    
                   console.warn("Embedding failed, skipping memory");
                }
                // Store the message vector and metadata in Pinecone

                if (vector) {
                    // ✅ key name must be `vector`
                   await createMemory({
                     vector,
                     messageId: message._id,
                     metadata: {
                        chat: messagePayload.chat.toString(),  // ✅ string
                        user: socket.user._id.toString(),      // ✅ string
                        text: messagePayload.content,          // ✅ direct metadata fields
                         },
                     });

                     memory = await queryMemory({
                        queryVector: vector,
                        limit: 5,   
                        metadata: { 
                            user: socket.user._id .toString() // ✅ string
                        }
                     });
                     console.log("Retrieved memory:", memory);
              }

             

               





                const { chat, content } = messagePayload || {};
                if (!content || typeof content !== "string") {
                   console.warn("❗ Missing or invalid content in ai-message:", messagePayload);
                   return socket.emit("ai-response", {

                     chat,
                     content: "Message content is missing.",
            });
            }
                const chatHistory = await messageModel

                .find({ chat: messagePayload.chat })
                .sort({ createdAt: -1 })  // newest
                .limit(20)                 // keep last 6
                .lean();

                chatHistory.reverse();       // oldest → newest


                console.log("Chat history for AI:", chatHistory.map(item=>{
                    return {
                        role:item.role,
                        parts:[{ text:item.content }]

                    }
                }));


                const stm= chatHistory.map(item=>{
                    return {
                        role:item.role,
                        parts:[{ text:item.content }]

                    }
                });


               const ltm = memory.length
  ? [{
      role: "user",
      parts: [{
        text: `Previous relevant messages:\n\n${memory
          .map(m => m.metadata?.text)
          .join("\n\n")}`
      }]
    }]
  : [];



                console.log("Long-term memory for AI:", ...ltm);
                console.log("Short-term memory for AI:", ...stm);

                const response = await aiService.generateResponse([...ltm, ...stm]);
                console.log("AI response generated:", response);

               


                const responseMessage =await messageModel.create({
                    chat: messagePayload.chat,
                    user: socket.user._id,
                    content: response,
                    role: "model"  
                });

                // Generate vector for the AI response
                 const responseVector=await aiService.generateVector(response);
                console.log("Generated vector:", responseVector);


                // Store the AI response vector and metadata in Pinecone  
               await createMemory({
                       vector: responseVector,   // ✅ key name must be `vector`
                       messageId: responseMessage._id,
                       metadata: {
                          chat: messagePayload.chat.toString(),  // ✅ string
                          user: socket.user._id.toString(),  // ✅ string
                          text: response,          // ✅ direct metadata fields
                       },
  });


                socket.emit("ai-response", {
                     
                    content: response,
                    chat,
                });
            } catch (err) {
                console.error("AI error:", err);
                socket.emit("ai-response", {
                content: "Sorry, I couldn't generate a response.",
                chat: messagePayload?.chat,
               });
            }
         });



         



         










    })

}
module.exports=initSocketServer;



*/









// const { Server } = require("socket.io"); // Import the Socket.IO server class
// const userModel = require("../models/user.model"); // Import the user model
// const messageModel = require("../models/message.model"); // Import the message model
// const aiService = require("../services/ai.service"); // Import the AI service
// const cookie = require("cookie");// Import the cookie parsing library
// const jwt = require("jsonwebtoken"); // Import the JSON Web Token library

// const { createMemory, queryMemory } = require("../services/vector.service"); // Import vector service functions

// /* =====================================================
//    Initialize Socket Server
// ===================================================== */
// function initSocketServer(httpServer) {
//   const io = new Server(httpServer, {
//     cors: {
//       origin: "http://localhost:5173",
//       credentials: true,
//     },
//   });

//   /* =====================================================
//      Socket Auth Middleware
//   ===================================================== */
//   io.use(async (socket, next) => {
//     try {
//       const cookies = cookie.parse(socket.handshake.headers.cookie || "");
//       if (!cookies.token) return next(new Error("Unauthorized"));

//       const decoded = jwt.verify(cookies.token, process.env.JWT_SECRET);
//       const user = await userModel.findById(decoded.id);
//       if (!user) return next(new Error("Unauthorized"));

//       socket.user = user;
//       next();
//     } catch (err) {
//       next(new Error("Unauthorized"));
//     }
//   });

//   /* =====================================================
//      Socket Connection
//   ===================================================== */
//   io.on("connection", (socket) => {
//     console.log("🔌 Socket connected:", socket.id);

//     socket.on("ai-message", async (messagePayload) => {
//       const { chat, content } = messagePayload || {};
//       if (!content || typeof content !== "string") return;

//       try {
//         /* ---------------------------------------------
//            1️⃣ Save USER message (must block)
//         --------------------------------------------- */
//         const userMessage = await messageModel.create({
//           chat,
//           user: socket.user._id,
//           content,
//           role: "user",
//         });

//         /* ---------------------------------------------
//            2️⃣ START heavy work TOGETHER (parallel)
//         --------------------------------------------- */
//         const vectorPromise = aiService
//           .generateVector(content)
//           .catch(() => null);

//         const historyPromise = messageModel
//           .find({ chat })
//           .sort({ createdAt: -1 })
//           .limit(6) // 🔥 keep context small
//           .lean();

//         /* ---------------------------------------------
//            3️⃣ Wait only for what AI needs
//         --------------------------------------------- */
//         const [userVector, chatHistory] = await Promise.all([
//           vectorPromise,
//           historyPromise,
//         ]);

//         chatHistory.reverse();

//         /* ---------------------------------------------
//            4️⃣ Query memory (depends on vector)
//         --------------------------------------------- */
//         const memory = userVector
//           ? await queryMemory({
//               queryVector: userVector,
//               limit: 3,
//               metadata: {
//                 user: socket.user._id.toString(),
//               },
//             }).catch(() => [])
//           : [];

//         /* ---------------------------------------------
//            5️⃣ Build AI context
//         --------------------------------------------- */
//         const stm = chatHistory.map((m) => ({
//           role: m.role,
//           parts: [{ text: m.content }],
//         }));

//         const ltm = memory.length
//           ? [
//               {
//                 role: "user",
//                 parts: [
//                   {
//                     text:
//                       "Previous relevant messages:\n\n" +
//                       memory.map((m) => m.metadata?.text).join("\n\n"),
//                   },
//                 ],
//               },
//             ]
//           : [];

//         /* ---------------------------------------------
//            6️⃣ Generate AI response (MAIN WAIT)
//         --------------------------------------------- */
//         const response = await aiService.generateResponse([
//           ...ltm,
//           ...stm,
//         ]);

//         /* ---------------------------------------------
//            7️⃣ Emit response IMMEDIATELY 🚀
//         --------------------------------------------- */
//         socket.emit("ai-response", {
//           chat,
//           content: response,
//         });

//         /* ---------------------------------------------
//            8️⃣ Background work (DO NOT BLOCK USER)
//         --------------------------------------------- */
//         setImmediate(async () => {
//           try {
//             // Save AI message
//             const responseMessage = await messageModel.create({
//               chat,
//               user: socket.user._id,
//               content: response,
//               role: "model",
//             });

//             // Save USER memory
//             if (userVector) {
//               await createMemory({
//                 vector: userVector,
//                 messageId: userMessage._id,
//                 metadata: {
//                   chat: chat.toString(),
//                   user: socket.user._id.toString(),
//                   text: content,
//                 },
//               });
//             }

//             // Generate AI embedding & save memory
//             const responseVector = await aiService.generateVector(response);
//             await createMemory({
//               vector: responseVector,
//               messageId: responseMessage._id,
//               metadata: {
//                 chat: chat.toString(),
//                 user: socket.user._id.toString(),
//                 text: response,
//               },
//             });
//           } catch (bgErr) {
//             console.error("⚠️ Background task failed:", bgErr);
//           }
//         });
//       } catch (err) {
//         console.error("❌ AI handler error:", err);
//         socket.emit("ai-response", {
//           chat,
//           content: "Sorry, something went wrong.",
//         });
//       }
//     });
//   });
// }

// module.exports = initSocketServer;











const { Server } = require("socket.io");
const userModel = require("../models/user.model");
const messageModel = require("../models/message.model");
const aiService = require("../services/ai.service");
const cookie = require("cookie");
const jwt = require("jsonwebtoken");

const { createMemory, queryMemory } = require("../services/vector.service");

/* =====================================================
   Initialize Socket Server
===================================================== */
function initSocketServer(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });

  /* =====================================================
     Socket Auth Middleware
  ===================================================== */
  io.use(async (socket, next) => {
    try {
      const cookies = cookie.parse(socket.handshake.headers.cookie || "");
      if (!cookies.token) return next(new Error("Unauthorized"));

      const decoded = jwt.verify(cookies.token, process.env.JWT_SECRET);
      const user = await userModel.findById(decoded.id);
      if (!user) return next(new Error("Unauthorized"));

      socket.user = user;
      next();
    } catch {
      next(new Error("Unauthorized"));
    }
  });

  /* =====================================================
     Socket Connection
  ===================================================== */
  io.on("connection", (socket) => {
    console.log("🔌 Socket connected:", socket.id);

    socket.on("ai-message", async (messagePayload) => {
      const { chat, content } = messagePayload || {};
      if (!chat || !content || typeof content !== "string") return;

      try {
        /* ---------------------------------------------
           1️⃣ Save USER message
        --------------------------------------------- */
        const userMessage = await messageModel.create({
          chat,
          user: socket.user._id,
          content,
          role: "user",
        });

        /* ---------------------------------------------
           2️⃣ Parallel heavy work
        --------------------------------------------- */
        const vectorPromise = aiService.generateVector(content).catch(() => null);

        const historyPromise = messageModel
          .find({ chat })
          .sort({ createdAt: -1 })
          .limit(6)
          .lean();

        const [userVector, chatHistory] = await Promise.all([
          vectorPromise,
          historyPromise,
        ]);

        chatHistory.reverse();

        /* ---------------------------------------------
           3️⃣ Query memory (SECURE)
        --------------------------------------------- */
        let identityMemory = [];
        let memory = [];

        if (userVector) {
          identityMemory = await queryMemory({
            queryVector: userVector,
            limit: 1,
            filter: {
              user: socket.user._id.toString(),
              type: "identity",
            },
          }).catch(() => []);

          memory = await queryMemory({
            queryVector: userVector,
            limit: 3,
            filter: {
              user: socket.user._id.toString(),
            },
          }).catch(() => []);
        }

        /* ---------------------------------------------
           4️⃣ Build AI context
        --------------------------------------------- */
        const stm = chatHistory.map((m) => ({
          role: m.role,
          parts: [{ text: m.content }],
        }));

        const ltm = [];

        if (identityMemory.length) {
          ltm.push({
            role: "user",
            parts: [
              {
                text:
                  "User personal information:\n" +
                  identityMemory.map((m) => m.metadata.text).join("\n"),
              },
            ],
          });
        }

        if (memory.length) {
          ltm.push({
            role: "user",
            parts: [
              {
                text:
                  "Previous relevant messages:\n\n" +
                  memory.map((m) => m.metadata.text).join("\n\n"),
              },
            ],
          });
        }

        /* ---------------------------------------------
           5️⃣ Generate AI response
        --------------------------------------------- */
        const response = await aiService.generateResponse([
          ...ltm,
          ...stm,
        ]);

        /* ---------------------------------------------
           6️⃣ Emit response immediately
        --------------------------------------------- */
        socket.emit("ai-response", {
          chat,
          content: response,
        });

        /* ---------------------------------------------
           7️⃣ Background persistence
        --------------------------------------------- */
        setImmediate(async () => {
          try {
            const responseMessage = await messageModel.create({
              chat,
              user: socket.user._id,
              content: response,
              role: "model",
            });

            // 🔐 Detect identity (name, role, etc.)
            const isIdentity = /my name is|i am|i'm/i.test(content);

            if (userVector) {
              await createMemory({
                vector: userVector,
                messageId: userMessage._id,
                metadata: {
                  chat: chat.toString(),
                  user: socket.user._id.toString(),
                  text: content,
                  type: isIdentity ? "identity" : "normal",
                },
              });
            }

            const responseVector = await aiService.generateVector(response);

            await createMemory({
              vector: responseVector,
              messageId: responseMessage._id,
              metadata: {
                chat: chat.toString(),
                user: socket.user._id.toString(),
                text: response,
                type: "normal",
              },
            });
          } catch (err) {
            console.error("⚠️ Background task failed:", err);
          }
        });
      } catch (err) {
        console.error("❌ AI handler error:", err);
        socket.emit("ai-response", {
          chat,
          content: "Sorry, something went wrong.",
        });
      }
    });
  });
}

module.exports = initSocketServer;
