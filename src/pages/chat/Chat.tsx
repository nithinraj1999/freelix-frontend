import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import socket from "../../socket/socket";
import { RootState } from "../../state/store";
import Sidebar from "./ChatSidebar";
import { getAllContacts, getChat } from "../../api/client/clientServices";
import { FaVideo } from "react-icons/fa";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";

type Message = {
  name: string;
  sender: string;
  text: string;
  senderId: string;
  timestamp: Date;
  recipientId: string;
};

type Contact = {
  id: string;
  name: string;
};

const Chat = () => {
  const { user } = useSelector((state: RootState) => state.user);
  const location = useLocation();
  const recipientId = location.state?.freelancerId;
  const name = location.state?.name;

  const userId = user?._id;
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [activeChat, setActiveChat] = useState<Contact | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isInCall, setIsInCall] = useState(false);
  const [incomingCallData, setIncomingCallData] = useState<{
    roomId: string;
    senderId: string;
  } | null>(null);

  const generateKitToken = (userId: string, roomId: string) => {
    const appID = 218939913; // Your Zego App ID
    const serverSecret = import.meta.env.VITE_ZEGOCLOUDE_SERVER_SECRET; 

    return ZegoUIKitPrebuilt.generateKitTokenForTest(
      appID,
      serverSecret,
      roomId,
      userId,
      "chatroom"
    );
  };

  const joinRoom = (roomId: string) => {
    const kitToken = generateKitToken(userId!, roomId);
    const zegoVideoCall = ZegoUIKitPrebuilt.create(kitToken);
    zegoVideoCall.joinRoom({
      container: document.getElementById("video-call-container"),
      sharedLinks: [],
    });

    setIsInCall(true);
  };

  const startVideoCall = () => {
    if (!userId || !activeChat) return;

    const roomId = `${userId}-${activeChat.id}-${Date.now()}`; // Unique room ID
    joinRoom(roomId);

    socket.emit("startVideoCall", {
      senderId: userId,
      recipientId: activeChat.id,
      roomId,
    });
  };

  const acceptIncomingCall = () => {
    if (incomingCallData) {
      joinRoom(incomingCallData.roomId);
      setIncomingCallData(null);
    }
  };

  const rejectIncomingCall = () => {
    setIncomingCallData(null);
  };

  useEffect(() => {
    async function fetchContacts() {
      const response = await getAllContacts({ userId });
      setActiveChat({ id: recipientId, name });
      // setContacts(response.allContacts);
      const updatedContacts = [...response.allContacts];
    if (recipientId && name && !updatedContacts.some(contact => contact.id === recipientId)) {
      updatedContacts.push({ id: recipientId, name });
    }

    setContacts(updatedContacts);
    }

    fetchContacts();
  }, [userId]);
  useEffect(() => {
    async function fetchMessages() {
      if (activeChat && userId) {
        const response = await getChat(userId, activeChat.id);
        if (response.success) {
          setMessages(response.chat);
        }
      }
    }
    fetchMessages();
  }, [activeChat, userId]);
  useEffect(() => {
    socket.on("incomingVideoCall", (data) => {
      setIncomingCallData(data);
    });

    socket.on("receiveMessage", (message: Message) => {
      setMessages((prev) => [...prev, message]);
      addToContacts(message.senderId, message.name);
    });

    return () => {
      socket.off("incomingVideoCall");
      socket.off("receiveMessage");
    };
  }, []);

  const addToContacts = (id: string, name: string) => {
    setContacts((prev) =>
      prev.some((contact) => contact.id === id) ? prev : [...prev, { id, name }]
    );
  };

  const handleSendMessage = () => {
    if (newMessage.trim() && userId && activeChat) {
      const message: Message = {
        name: user.name,
        senderId: userId,
        recipientId: activeChat.id,
        text: newMessage,
        timestamp: new Date(),
        sender: "Freelancer",
      };
      socket.emit("sendMessage", message);
      setMessages((prev) => [...prev, message]);
      setNewMessage("");
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar
        contacts={contacts}
        activeChat={activeChat}
        setActiveChat={setActiveChat}
      />

      <div className="flex-1 flex flex-col">
        <div className="bg-blue-500 text-white p-4">
          <h1>Chat with {activeChat?.name || "Select a Contact"}</h1>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.senderId === userId ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded ${
                  message.senderId === userId
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-black"
                }`}
              >
                <p>{message.text}</p>
                <p className="text-xs mt-1 text-gray-500">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white p-4 flex items-center space-x-4">
          {/* <FaVideo
            className="text-blue-500 text-2xl cursor-pointer"
            onClick={startVideoCall}
          /> */}
          <input
            type="text"
            className="flex-1 p-2 border rounded"
            placeholder="Type a message"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button
            className="bg-blue-500 text-white p-2 rounded"
            onClick={handleSendMessage}
          >
            Send
          </button>
        </div>

        <div
          id="video-call-container"
          style={{
            width: "100vw",
            height: "100vh",
            position: "fixed",
            top: 0,
            left: 0,
            zIndex: 50,
            display: isInCall ? "block" : "none",
          }}
        ></div>

        {incomingCallData && (
          <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-4 rounded shadow">
              <p>Incoming Video Call</p>
              <div className="space-x-4">
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded"
                  onClick={acceptIncomingCall}
                >
                  Accept
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded"
                  onClick={rejectIncomingCall}
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
