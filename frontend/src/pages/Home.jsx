// import React, { useCallback, useEffect, useState } from 'react';
// import { io } from "socket.io-client";
// import ChatMobileBar from '../components/chat/ChatMobileBar.jsx';
// import ChatSidebar from '../components/chat/ChatSidebar.jsx';
// import ChatMessages from '../components/chat/ChatMessages.jsx';
// import ChatComposer from '../components/chat/ChatComposer.jsx';
// import '../components/chat/ChatLayout.css';
// import { fakeAIReply } from '../components/chat/aiClient.js';
// import { useDispatch, useSelector } from 'react-redux';
// import axios from 'axios';
// import {
//   ensureInitialChat,
//   startNewChat,
//   selectChat,
//   setInput,
//   sendingStarted,
//   sendingFinished,
//   addUserMessage,
//   addAIMessage,
//   setChats
// } from '../store/chatSlice.js';

// const Home = () => {
//   const dispatch = useDispatch();
//   const chats = useSelector(state => state.chat.chats);
//   const activeChatId = useSelector(state => state.chat.activeChatId);
//   const input = useSelector(state => state.chat.input);
//   const isSending = useSelector(state => state.chat.isSending);
//   const [ sidebarOpen, setSidebarOpen ] = React.useState(false);
//   const [ socket, setSocket ] = useState(null);

//   const activeChat = chats.find(c => c.id === activeChatId) || null;

//   const [ messages, setMessages ] = useState([
//     // {
//     //   type: 'user',
//     //   content: 'Hello, how can I help you today?'
//     // },
//     // {
//     //   type: 'ai',
//     //   content: 'Hi there! I need assistance with my account.'
//     // }
//   ]);

//   const handleNewChat = async () => {
//     // Prompt user for title of new chat, fallback to 'New Chat'
//     let title = window.prompt('Enter a title for the new chat:', '');
//     if (title) title = title.trim();
//     if (!title) return

//     const response = await axios.post("http://localhost:3000/api/chat", {
//       title
//     }, {
//       withCredentials: true
//     })
//     getMessages(response.data.chat._id);
//     dispatch(startNewChat(response.data.chat));
//     setSidebarOpen(false);
//   }

//   // Ensure at least one chat exists initially
//   useEffect(() => {

//     axios.get("http://localhost:3000/api/chat", { withCredentials: true })
//       .then(response => {
//         dispatch(setChats(response.data.chats.reverse()));
//       })

//     const tempSocket = io("localhost:3000", {
//       withCredentials: true,
//     })

//     tempSocket.on("ai-response", (messagePayload) => {
//       console.log("Received AI response:", messagePayload);

//       setMessages((prevMessages) => [ ...prevMessages, {
//         type: 'ai',
//         content: messagePayload.content
//       } ]);

//       dispatch(sendingFinished());
//     });

//     setSocket(tempSocket);

//   }, []);

//   const sendMessage = async () => {

//     const trimmed = input.trim();
//     console.log("Sending message:", trimmed);
//     if (!trimmed || !activeChatId || isSending) return;
//     dispatch(sendingStarted());

//     const newMessages = [ ...messages, {
//       type: 'user',
//       content: trimmed
//     } ];

//     console.log("New messages:", newMessages);

//     setMessages(newMessages);
//     dispatch(setInput(''));

//     socket.emit("ai-message", {
//       chat: activeChatId,
//       content: trimmed
//     })

//     // try {
//     //   const reply = await fakeAIReply(trimmed);
//     //   dispatch(addAIMessage(activeChatId, reply));
//     // } catch {
//     //   dispatch(addAIMessage(activeChatId, 'Error fetching AI response.', true));
//     // } finally {
//     //   dispatch(sendingFinished());
//     // }
//   }

//   const getMessages = async (chatId) => {

//    const response = await  axios.get(`http://localhost:3000/api/chat/messages/${chatId}`, { withCredentials: true })

//    console.log("Fetched messages:", response.data.messages);

//    setMessages(response.data.messages.map(m => ({
//      type: m.role === 'user' ? 'user' : 'ai',
//      content: m.content
//    })));

//   }


// return (
//   <div className="chat-layout minimal">
//     <ChatMobileBar
//       onToggleSidebar={() => setSidebarOpen(o => !o)}
//       onNewChat={handleNewChat}
//     />
//     <ChatSidebar
//       chats={chats}
//       activeChatId={activeChatId}
//       onSelectChat={(id) => {
//         dispatch(selectChat(id));
//         setSidebarOpen(false);
//         getMessages(id);
//       }}
//       onNewChat={handleNewChat}
//       open={sidebarOpen}
//     />
//     <main className="chat-main" role="main">
//       {messages.length === 0 && (
//         <div className="chat-welcome" aria-hidden="true">
//           <div className="chip">Early Preview</div>
//           <h1>ChatGPT Clone</h1>
//           <p>Ask anything. Paste text, brainstorm ideas, or get quick explanations. Your chats stay in the sidebar so you can pick up where you left off.</p>
//         </div>
//       )}
//       <ChatMessages messages={messages} isSending={isSending} />
//       {
//         activeChatId &&
//         <ChatComposer
//           input={input}
//           setInput={(v) => dispatch(setInput(v))}
//           onSend={sendMessage}
//           isSending={isSending}
//         />}
//     </main>
//     {sidebarOpen && (
//       <button
//         className="sidebar-backdrop"
//         aria-label="Close sidebar"
//         onClick={() => setSidebarOpen(false)}
//       />
//     )}
//   </div>
// );
// };

// export default Home;



















// import React, { useEffect, useState } from 'react';
// import { io } from "socket.io-client";
// import { useDispatch, useSelector } from 'react-redux';
// import { useNavigate } from "react-router-dom";
// import axios from 'axios';

// import ChatMobileBar from '../components/chat/ChatMobileBar.jsx';
// import ChatSidebar from '../components/chat/ChatSidebar.jsx';
// import ChatMessages from '../components/chat/ChatMessages.jsx';
// import ChatComposer from '../components/chat/ChatComposer.jsx';
// import '../components/chat/ChatLayout.css';

// import {
//   startNewChat,
//   selectChat,
//   setInput,
//   sendingStarted,
//   sendingFinished,
//   setChats
// } from '../store/chatSlice.js';

// const Home = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const chats = useSelector(state => state.chat.chats);
//   const activeChatId = useSelector(state => state.chat.activeChatId);
//   const input = useSelector(state => state.chat.input);
//   const isSending = useSelector(state => state.chat.isSending);

//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [socket, setSocket] = useState(null);
//   const [messages, setMessages] = useState([]);

//   /* ===============================
//      AUTH GUARD + INITIAL LOAD
//   =============================== */
//   useEffect(() => {
//     let tempSocket;

//     // 1️⃣ Check authentication
//     axios.get("http://localhost:3000/api/auth/me", {
//       withCredentials: true,
//     })
//     .then(() => {
//       // 2️⃣ Load chats
//       return axios.get("http://localhost:3000/api/chat", {
//         withCredentials: true,
//       });
//     })
//     .then((res) => {
//       dispatch(setChats(res.data.chats.reverse()));

//       // 3️⃣ Connect socket AFTER auth
//       tempSocket = io("http://localhost:3000", {
//         withCredentials: true,
//       });

//       tempSocket.on("ai-response", (messagePayload) => {
//         setMessages(prev => [
//           ...prev,
//           { type: "ai", content: messagePayload.content }
//         ]);
//         dispatch(sendingFinished());
//       });

//       setSocket(tempSocket);
//     })
//     .catch(() => {
//       // ❌ Not logged in
//       navigate("/login");
//     });

//     return () => {
//       if (tempSocket) tempSocket.disconnect();
//     };
//   }, [dispatch, navigate]);

//   /* ===============================
//      CREATE NEW CHAT
//   =============================== */
//   const handleNewChat = async () => {
//     let title = window.prompt('Enter a title for the new chat:', '');
//     if (title) title = title.trim();
//     if (!title) return;

//     const response = await axios.post(
//       "http://localhost:3000/api/chat",
//       { title },
//       { withCredentials: true }
//     );

//     dispatch(startNewChat(response.data.chat));
//     getMessages(response.data.chat._id);
//     setSidebarOpen(false);
//   };

//   /* ===============================
//      SEND MESSAGE
//   =============================== */
//   const sendMessage = async () => {
//     const trimmed = input.trim();
//     if (!trimmed || !activeChatId || isSending || !socket) return;

//     dispatch(sendingStarted());

//     setMessages(prev => [
//       ...prev,
//       { type: "user", content: trimmed }
//     ]);

//     dispatch(setInput(""));

//     socket.emit("ai-message", {
//       chat: activeChatId,
//       content: trimmed,
//     });
//   };

//   /* ===============================
//      LOAD CHAT MESSAGES
//   =============================== */
//   const getMessages = async (chatId) => {
//     const response = await axios.get(
//       `http://localhost:3000/api/chat/messages/${chatId}`,
//       { withCredentials: true }
//     );

//     setMessages(
//       response.data.messages.map(m => ({
//         type: m.role === "user" ? "user" : "ai",
//         content: m.content,
//       }))
//     );
//   };

//   /* ===============================
//      UI
//   =============================== */
//   return (
//     <div className="chat-layout minimal">
//       <ChatMobileBar
//         onToggleSidebar={() => setSidebarOpen(o => !o)}
//         onNewChat={handleNewChat}
//       />

//       <ChatSidebar
//         chats={chats}
//         activeChatId={activeChatId}
//         onSelectChat={(id) => {
//           dispatch(selectChat(id));
//           setSidebarOpen(false);
//           getMessages(id);
//         }}
//         onNewChat={handleNewChat}
//         open={sidebarOpen}
//       />

//       <main className="chat-main" role="main">
//         {messages.length === 0 && (
//           <div className="chat-welcome" aria-hidden="true">
//             <div className="chip">Early Preview</div>
//             <h1>ChatGPT Clone</h1>
//             <p>
//               Ask anything. Paste text, brainstorm ideas, or get quick
//               explanations. Your chats stay in the sidebar so you can pick up
//               where you left off.
//             </p>
//           </div>
//         )}

//         <ChatMessages messages={messages} isSending={isSending} />

//         {activeChatId && (
//           <ChatComposer
//             input={input}
//             setInput={(v) => dispatch(setInput(v))}
//             onSend={sendMessage}
//             isSending={isSending}
//           />
//         )}
//       </main>

//       {sidebarOpen && (
//         <button
//           className="sidebar-backdrop"
//           aria-label="Close sidebar"
//           onClick={() => setSidebarOpen(false)}
//         />
//       )}
//     </div>
//   );
// };

// export default Home;









import React, { useEffect, useState } from 'react';
import { io } from "socket.io-client";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

import ChatMobileBar from '../components/chat/ChatMobileBar.jsx';
import ChatSidebar from '../components/chat/ChatSidebar.jsx';
import ChatMessages from '../components/chat/ChatMessages.jsx';
import ChatComposer from '../components/chat/ChatComposer.jsx';
import '../components/chat/ChatLayout.css';

import {
  startNewChat,
  selectChat,
  setInput,
  sendingStarted,
  sendingFinished,
  setChats
} from '../store/chatSlice.js';

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const chats = useSelector(state => state.chat.chats);
  const activeChatId = useSelector(state => state.chat.activeChatId);
  const input = useSelector(state => state.chat.input);
  const isSending = useSelector(state => state.chat.isSending);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);

  /* ===============================
     AUTH CHECK + INITIAL LOAD
  =============================== */
  useEffect(() => {
    let tempSocket;

    // 🔐 Use /api/chat as auth check
    axios.get("http://localhost:3000/api/chat", {
      withCredentials: true,
    })
    .then((res) => {
      // ✅ User is authenticated
      dispatch(setChats(res.data.chats.reverse()));

      // 🔌 Connect socket AFTER auth
      tempSocket = io("http://localhost:3000", {
        withCredentials: true,
      });

      tempSocket.on("ai-response", (messagePayload) => {
        setMessages(prev => [
          ...prev,
          { type: "ai", content: messagePayload.content }
        ]);
        dispatch(sendingFinished());
      });

      setSocket(tempSocket);
    })
    .catch(() => {
      // ❌ Not authenticated
      navigate("/login");
    });

    return () => {
      if (tempSocket) tempSocket.disconnect();
    };
  }, [dispatch, navigate]);

  /* ===============================
     CREATE NEW CHAT
  =============================== */
  const handleNewChat = async () => {
    let title = window.prompt('Enter a title for the new chat:', '');
    if (title) title = title.trim();
    if (!title) return;

    const response = await axios.post(
      "http://localhost:3000/api/chat",
      { title },
      { withCredentials: true }
    );

    dispatch(startNewChat(response.data.chat));
    getMessages(response.data.chat._id);
    setSidebarOpen(false);
  };

  /* ===============================
     SEND MESSAGE
  =============================== */
  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || !activeChatId || isSending || !socket) return;

    dispatch(sendingStarted());

    setMessages(prev => [
      ...prev,
      { type: "user", content: trimmed }
    ]);

    dispatch(setInput(""));

    socket.emit("ai-message", {
      chat: activeChatId,
      content: trimmed,
    });
  };

  /* ===============================
     LOAD CHAT MESSAGES
  =============================== */
  const getMessages = async (chatId) => {
    const response = await axios.get(
      `http://localhost:3000/api/chat/messages/${chatId}`,
      { withCredentials: true }
    );

    setMessages(
      response.data.messages.map(m => ({
        type: m.role === "user" ? "user" : "ai",
        content: m.content,
      }))
    );
  };




  // ===============================
  // LOGOUT
  // ===============================
  const handleLogout = async () => {
  try {
    await axios.post(
      "http://localhost:3000/api/auth/logout",
      {},
      { withCredentials: true }
    );
  } catch (err) {
    console.error("Logout failed", err);
  } finally {
    navigate("/login");
  }
};



// ===============================
// DELETE CHAT
// ===============================
const handleDeleteChat = async (chatId) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this chat?"
  );
  if (!confirmDelete) return;

  await axios.delete(
    `http://localhost:3000/api/chat/${chatId}`,
    { withCredentials: true }
  );

  dispatch(setChats(chats.filter(c => c._id !== chatId)));

  if (chatId === activeChatId) {
    setMessages([]);
  }
};




  



  /* ===============================
     UI
  =============================== */
  return (
    <div className="chat-layout minimal">
      <ChatMobileBar
        onToggleSidebar={() => setSidebarOpen(o => !o)}
        onNewChat={handleNewChat}
      />

      <ChatSidebar
        chats={chats}
        activeChatId={activeChatId}
        onSelectChat={(id) => {
          dispatch(selectChat(id));
          setSidebarOpen(false);
          getMessages(id);
        }}
        onNewChat={handleNewChat}
        onLogout={handleLogout}
        onDeleteChat={handleDeleteChat} 
        open={sidebarOpen}
      />

      <main className="chat-main" role="main">
        {messages.length === 0 && (
          <div className="chat-welcome" aria-hidden="true">
            <div className="chip">Early Preview</div>
            <h1>PromptX</h1>
            <p>
              Ask anything. Paste text, brainstorm ideas, or get quick
              explanations. Your chats stay in the sidebar so you can pick up
              where you left off.
            </p>
          </div>
        )}

        <ChatMessages messages={messages} isSending={isSending} />

        {activeChatId && (
          <ChatComposer
            input={input}
            setInput={(v) => dispatch(setInput(v))}
            onSend={sendMessage}
            isSending={isSending}
          />
        )}
      </main>

      {sidebarOpen && (
        <button
          className="sidebar-backdrop"
          aria-label="Close sidebar"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Home;
