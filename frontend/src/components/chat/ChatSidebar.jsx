// import React from 'react';
// import './ChatSidebar.css';


// const ChatSidebar = ({ chats, activeChatId, onSelectChat, onNewChat, open }) => {


  
//   return (
//     <aside className={"chat-sidebar " + (open ? 'open' : '')} aria-label="Previous chats">
//       <div className="sidebar-header">
//         <h2>Chats</h2>
//         <button className="small-btn" onClick={onNewChat}>New</button>
//       </div>
//       <nav className="chat-list" aria-live="polite">
//         {chats.map(c => (
//           <button
//             key={c._id}
//             className={"chat-list-item " + (c._id === activeChatId ? 'active' : '')}
//             onClick={() => onSelectChat(c._id)}
//           >
//             <span className="title-line">{c.title}</span>
//           </button>
//         ))}
//         {chats.length === 0 && <p className="empty-hint">No chats yet.</p>}
//       </nav>
//     </aside>
//   );
// };

// export default ChatSidebar;








// import React from 'react';
// import './ChatSidebar.css';

// const ChatSidebar = ({
//   chats,
//   activeChatId,
//   onSelectChat,
//   onNewChat,
//   onLogout,
//   open
// }) => {
//   return (
//     <aside
//       className={"chat-sidebar " + (open ? 'open' : '')}
//       aria-label="Previous chats"
//     >
//       {/* Top */}
//       <div className="sidebar-header">
//         <h2>Chats</h2>
//         <button className="small-btn" onClick={onNewChat}>
//           New
//         </button>
//       </div>

//       {/* Chat list */}
//       <nav className="chat-list" aria-live="polite">
//         {chats.map(c => (
//           <button
//             key={c._id}
//             className={
//               "chat-list-item " +
//               (c._id === activeChatId ? 'active' : '')
//             }
//             onClick={() => onSelectChat(c._id)}
//           >
//             <span className="title-line">{c.title}</span>
//           </button>
//         ))}

//         {chats.length === 0 && (
//           <p className="empty-hint">No chats yet.</p>
//         )}
//       </nav>

//       {/* Bottom */}
//       <div className="sidebar-footer">
//         <button className="logout-btn" onClick={onLogout}>
//           Logout
//         </button>
//       </div>
//     </aside>
//   );
// };

// export default ChatSidebar;






import React from 'react';
import './ChatSidebar.css';
import { FiTrash2 } from "react-icons/fi";

const ChatSidebar = ({
  chats,
  activeChatId,
  onSelectChat,
  onNewChat,
  onDeleteChat,
  onLogout,
  open
}) => {
  return (
    <aside
      className={"chat-sidebar " + (open ? 'open' : '')}
      aria-label="Previous chats"
    >
      {/* Top */}
      <div className="sidebar-header">
        <h2>Chats</h2>
        <button className="small-btn" onClick={onNewChat}>
          New
        </button>
      </div>

      {/* Chat list */}
      <nav className="chat-list" aria-live="polite">
        {chats.map(c => (
          <div
            key={c._id}
            className={
              "chat-list-item " +
              (c._id === activeChatId ? 'active' : '')
            }
          >

             {/* CHAT TITLE */}
            <button
              className="chat-title-btn"
              onClick={() => onSelectChat(c._id)}
            >
              <span className="title-line">{c.title}</span>
            </button>


            {/* DELETE ICON (LEFT) */}
            <button
  className="chat-delete-btn"
  onClick={(e) => {
    e.stopPropagation();
    onDeleteChat(c._id);
  }}
  aria-label="Delete chat"
  title="Delete chat"
>
  <FiTrash2 size={14} />
</button>


           
          </div>
        ))}

        {chats.length === 0 && (
          <p className="empty-hint">No chats yet.</p>
        )}
      </nav>

      {/* Bottom */}
      <div className="sidebar-footer">
        <button className="logout-btn" onClick={onLogout}>
          Logout
        </button>
      </div>
    </aside>
  );
};

export default ChatSidebar;
