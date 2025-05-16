// import { useEffect, useRef, useState } from "react";
// import { useSelector } from "react-redux";
// import { RootState } from "../../state/store";
// import socket from "../../socket/socket";
// import { getChat } from "../../api/client/clientServices";
// import { GrAttachment } from "react-icons/gr";
// import { ChangeEvent } from "react";
// import { sendFile } from "../../api/client/clientServices";
// interface ChatProps {
//   selectedUser: {
//     id: string;
//     name: string;
//   } | null;
// }

// interface Message {
//   senderId: string;
//   recipientId: string;
//   text: string;
//   file: string;
//   timestamp: string;
//   name?: string;
// }

// const Chat = ({ selectedUser }: ChatProps) => {
//   const { user } = useSelector((state: RootState) => state.user);
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [input, setInput] = useState("");
//   const [file, setFile] = useState<any>();
//   const messagesEndRef = useRef<HTMLDivElement | null>(null);

//   useEffect(() => {
//     if (!selectedUser || !user?._id) return;

//     // 👇 Fetch chat history
//     const fetchMessages = async () => {
//       try {
//         const res = await getChat(user._id, selectedUser.id);
//         console.log("......", res);

//         setMessages(res.chat || []);
//       } catch (err) {
//         console.error("Failed to fetch messages:", err);
//         setMessages([]);
//       }
//     };

//     fetchMessages();
//   }, [selectedUser, user]);

//   useEffect(() => {
//     if (user?._id) {
//       socket.emit("registerUser", user._id);
//     }

//     const handleReceive = (message: Message) => {
//       // only add message if it's relevant to current chat
//       if (
//         (message.senderId === selectedUser?.id &&
//           message.recipientId === user?._id) ||
//         (message.senderId === user?._id &&
//           message.recipientId === selectedUser?.id)
//       ) {
//         setMessages((prev) => [...prev, message]);
//       }
//     };

//     socket.on("receiveMessage", handleReceive);

//     return () => {
//       socket.off("receiveMessage", handleReceive);
//     };
//   }, [user, selectedUser]);

//   const sendMessage = () => {
//     if (!input.trim() || !selectedUser || !user) return;

//     const message: Message = {
//       senderId: user._id,
//       recipientId: selectedUser.id,
//       text: input.trim(),
//       file: file,
//       timestamp: new Date().toISOString(),
//       name: user.name,
//     };

//     socket.emit("sendMessage", message);
//     setMessages((prev) => [...prev, message]); // Optimistic UI
//     setInput("");
//   };

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   if (!selectedUser) {
//     return (
//       <div className="h-full flex items-center justify-center text-gray-500 text-lg">
//         👋 Select a contact to start chatting!
//       </div>
//     );
//   }

//   const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
//     const files = e.target.files;
//     if (!files || files.length === 0) return;
//     const file = files[0];
//     console.log(file);
//     const formData = new FormData();
//     formData.append("file", file);
//     const response = await sendFile(formData);

//     setFile(response.data.fileUrl);
//   };

//   return (
//     <div className="flex flex-col h-full bg-gray-100">
//       {/* Header */}
//       <div className="p-4 border-b bg-white shadow-sm text-lg font-medium">
//         Chatting with <span className="font-semibold">{selectedUser.name}</span>
//       </div>

//       {/* Messages */}
// <div className="flex-1 p-4 space-y-3 overflow-y-auto">
//   {messages.map((msg, idx) => (
//     <div
//       key={idx}
//       className={`p-3 rounded-md shadow max-w-xs ${
//         msg.senderId === user?._id
//           ? "bg-blue-200 ml-auto text-right"
//           : "bg-white"
//       }`}
//     >
//       <div>{msg.text}</div>

//       {msg.file && (
//         <div className="mt-2 space-y-2">
//           {/* 🖼️ Image Preview */}
//           {msg.file.match(/\.(jpeg|jpg|png|gif|webp)$/i) ? (
//             <img
//               src={msg.file}
//               alt="Uploaded preview"
//               className="max-w-full h-auto rounded border"
//             />
//           ) : (
//             // 📄 File Icon + Name for PDF/DOC/PPT/etc.
//             <div className="flex items-center gap-2 text-sm text-gray-700">
//               <span>📄</span>
//               <span>{msg.file.split("/").pop()}</span>
//             </div>
//           )}

//           {/* ⬇️ Download Button */}
//           <a
//             href={msg.file}
//             download
//             className="inline-block px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
//           >
//             ⬇️ Download File
//           </a>
//         </div>
//       )}
//     </div>
//   ))}
//   <div ref={messagesEndRef}></div>
// </div>

//       {/* Input */}
//       <div className="p-4 border-t bg-white flex items-center gap-3">
//         <input
//           type="file"
//           id="fileUpload"
//           onChange={handleFileUpload}
//           className="hidden"
//         />

//         {/* Label acts as button to trigger file input */}
//         <label
//           htmlFor="fileUpload"
//           className="cursor-pointer text-gray-500 hover:text-blue-500 text-xl"
//         >
//           <GrAttachment />
//         </label>

//         {/* Text input */}
//         <input
//           type="text"
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           onKeyDown={(e) => e.key === "Enter" && sendMessage()}
//           placeholder="Type a message..."
//           className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
//         />

//         {/* Send button */}
//         <button
//           onClick={sendMessage}
//           className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all"
//         >
//           Send
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Chat;

import { useEffect, useRef, useState, ChangeEvent } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../state/store";
import socket from "../../socket/socket";
import { getChat, sendFile } from "../../api/client/clientServices";
import { GrAttachment } from "react-icons/gr";
import { downloadFileFromChat } from "../../api/client/clientServices";
interface ChatProps {
  selectedUser: {
    id: string;
    name: string;
  } | null;
}

interface Message {
  senderId: string;
  recipientId: string;
  text: string;
  file: string;
  timestamp: string;
  name?: string;
}

// 🛠️ Utility functions
const formatDate = (isoString: string) => {
  const date = new Date(isoString);
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const formatTime = (isoString: string) => {
  const date = new Date(isoString);
  return date.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const Chat = ({ selectedUser }: ChatProps) => {
  const { user } = useSelector((state: RootState) => state.user);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [file, setFile] = useState<any>();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [loding, setIsLoading] = useState(false);
  useEffect(() => {
    if (!selectedUser || !user?._id) return;

    const fetchMessages = async () => {
      try {
        const res = await getChat(user._id, selectedUser.id);
        setMessages(res.chat || []);
      } catch (err) {
        console.error("Failed to fetch messages:", err);
        setMessages([]);
      }
    };

    fetchMessages();
  }, [selectedUser, user]);

  useEffect(() => {
    if (user?._id) {
      socket.emit("registerUser", user._id);
    }

    const handleReceive = (message: Message) => {
      if (
        (message.senderId === selectedUser?.id &&
          message.recipientId === user?._id) ||
        (message.senderId === user?._id &&
          message.recipientId === selectedUser?.id)
      ) {
        setMessages((prev) => [...prev, message]);
      }
    };

    socket.on("receiveMessage", handleReceive);

    return () => {
      socket.off("receiveMessage", handleReceive);
    };
  }, [user, selectedUser]);

  const sendMessage = () => {
    if (!input.trim() || !selectedUser || !user) return;

    const message: Message = {
      senderId: user._id,
      recipientId: selectedUser.id,
      text: input.trim(),
      file: file,
      timestamp: new Date().toISOString(),
      name: user.name,
    };

    socket.emit("sendMessage", message);
    setMessages((prev) => [...prev, message]);
    setInput("");
    setFile(null);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const selectedFile = files[0];

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await sendFile(formData);
      setFile(response.data.fileUrl);
    } catch (err) {
      console.error("Failed to upload file:", err);
    }
  };

  if (!selectedUser) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500 text-lg">
        👋 Select a contact to start chatting!
      </div>
    );
  }

  // Group messages by date
  const groupedMessages: { [date: string]: Message[] } = {};
  messages.forEach((msg) => {
    const date = formatDate(msg.timestamp);
    if (!groupedMessages[date]) groupedMessages[date] = [];
    groupedMessages[date].push(msg);
  });

    const downloadFile = async (fileName: string) => {
      setIsLoading(true);
  
      
  
      try {
        const response = await downloadFileFromChat(fileName);
        console.log(response);
  
        const contentDisposition = response.headers["content-disposition"];
        const filename = contentDisposition
          ? contentDisposition.split("filename=")[1].replace(/"/g, "")
          : "downloaded-file";
  
        const blob = response.data;
        const url = window.URL.createObjectURL(blob);
  
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        link.click();
  
        window.URL.revokeObjectURL(url);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to download file:", error);
        setIsLoading(false);
      }
    };
  
  

  return (
    <div className="flex flex-col h-full bg-gray-100">
      {/* Header */}
      <div className="p-4 border-b bg-white shadow-sm text-lg font-medium">
        Chatting with <span className="font-semibold">{selectedUser.name}</span>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 space-y-6 overflow-y-auto">
        {Object.entries(groupedMessages).map(([date, msgs], groupIdx) => (
          <div key={groupIdx} className="space-y-4">
            {/* 📅 Date Header */}
            <div className="text-center text-gray-500 text-sm font-medium">
              {date}
            </div>

            {msgs.map((msg, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-md shadow max-w-xs relative ${
                  msg.senderId === user?._id
                    ? "bg-blue-200 ml-auto text-right"
                    : "bg-white"
                }`}
              >
                <div>{msg.text}</div>

                {msg.file && (
                  <div className="mt-2 space-y-2">
                    {msg.file.match(/\.(jpeg|jpg|png|gif|webp)$/i) ? (
                      <img
                        src={msg.file}
                        alt="Uploaded preview"
                        className="max-w-full h-auto rounded border"
                      />
                    ) : (
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <span>📄</span>
                        <span>{msg.file.split("/").pop()}</span>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <button
                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm cursor-pointer"
                        onClick={() => downloadFile(msg.file)}
                      >
                        ⬇️ Download File
                      </button>
                      <a
                        href={msg.file}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
                      >
                        🔍 Open File
                      </a>
                    </div>
                  </div>
                )}

                <div className="text-xs text-gray-600 mt-1">
                  {formatTime(msg.timestamp)}
                </div>
              </div>
            ))}
          </div>
        ))}
        <div ref={messagesEndRef}></div>
      </div>

      {/* Input */}
      <div className="p-4 border-t bg-white flex items-center gap-3">
        <input
          type="file"
          id="fileUpload"
          onChange={handleFileUpload}
          className="hidden"
        />

        <label
          htmlFor="fileUpload"
          className="cursor-pointer text-gray-500 hover:text-blue-500 text-xl"
        >
          <GrAttachment />
        </label>

        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type a message..."
          className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
