import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Chat = () => {
  const { chatid } = useParams(); // Get chatid from URL
  const { user } = useContext(AuthContext); // Get logged-in user from context
  const [messages, setMessages] = useState([
    { sender: { username: "chintu" }, message: "Hi!" },
    { sender: { username: "mohith" }, message: "Hello!" },
    { sender: { username: "chintu" }, message: "How are you?" },
    {
      sender: { username: "mohith" },
      message: "I'm good, thanks! How about you?",
    },
  ]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5002/api/chats/${chatid}`
        );
        setMessages(response.data.chats);
      } catch (err) {
        console.error(err);
      }
    };
    // Uncomment the next line to fetch messages from the backend
    // fetchMessages();

    // Dummy data can remain in place of the above fetch
    const interval = setInterval(fetchMessages, 5002); // Poll for new messages
    return () => clearInterval(interval);
  }, [chatid]);

  const handleSendMessage = async () => {
    try {
      const response = await axios.post("http://localhost:5002/api/chats/add", {
        chatid,
        sender: user._id,
        message: newMessage,
      });
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: { username: user.username }, message: newMessage }, // Add the new message to local state
      ]);
      setNewMessage("");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Chat</h1>
      <div className="bg-gray-100 p-4 rounded shadow-md mb-4">
        {messages.map((msg, index) => (
          <div key={index} className="mb-2">
            <strong>{msg.sender.username}</strong>: {msg.message}
          </div>
        ))}
      </div>
      <div className="flex">
        <input
          type="text"
          className="w-full px-3 py-2 border rounded"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white py-2 px-4 rounded ml-2"
          onClick={handleSendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
