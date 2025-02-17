import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import Logo from './Logo';
import Version from './Version';
import './App.css';

const socket = io('https://walkie-talkie-backend.onrender.com'); // Connect to the backend

function App() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState('');
  const [showChat, setShowChat] = useState(false);

  // Handle name selection
  const handleNameSelection = (selectedName) => {
    setUsername(selectedName);
    socket.emit('identify-user', selectedName); // Send username to the server
    setShowChat(true); // Show the chat interface
  };

  // Send message to the backend
  const sendMessage = () => {
    if (message.trim()) {
      const messageData = {
        text: message,
        sender: username, // Use selected username
        timestamp: new Date().toLocaleTimeString(),
      };
      socket.emit('send-message', messageData);
      // Add the message to the local state for the sender
      setMessages((prevMessages) => [...prevMessages, messageData]);
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
      {!showChat ? (
        <div className="name-selection">
          <h1>Select Your Name</h1>
          <button onClick={() => handleNameSelection('TheGuyWho')}>TheGuyWho</button>
          <button onClick={() => handleNameSelection('SherlockH')}>SherlockH</button>
        </div>
      ) : (
        <>
          <Logo />
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
          <Version />
        </>
      )}
    </div>
  );
}

export default App;