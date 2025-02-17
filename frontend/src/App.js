import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './App.css';

const socket = io('http://localhost:5000'); // Connect to the backend

function App() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  // Send message to the backend
  const sendMessage = () => {
    if (message.trim()) {
      const messageData = {
        text: message,
        sender: 'User1', // Replace with dynamic user data later
        timestamp: new Date().toLocaleTimeString(),
      };
      socket.emit('send-message', messageData);
      setMessages([...messages, messageData]);
      setMessage('');
    }
  };

  // Listen for incoming messages
  useEffect(() => {
    socket.on('receive-message', (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });
  }, []);

  return (
    <div className="App">
      <h1>Walkie-Talkie Chat</h1>
      <div className="chat-window">
        {messages.map((msg, index) => (
          <div key={index} className="message">
            <strong>{msg.sender}:</strong> {msg.text} <em>({msg.timestamp})</em>
          </div>
        ))}
      </div>
      <div className="input-area">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message"
        />
        <button onClick={sendMessage}>Push to Send</button>
      </div>
    </div>
  );
}

export default App;