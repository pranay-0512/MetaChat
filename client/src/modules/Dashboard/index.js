import React, { useState, useEffect, useRef } from "react";
import "./style.css";
import Asset from "../../assets/profile.png";
// import Contacts from "../../assets/contacts.json";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faPaperPlane } from "@fortawesome/free-solid-svg-icons";

const Dashboard = () => {
  // for the toggle button
  const [showMessages, setShowMessages] = useState(true);
  const toggleMessages = () => {
    setShowMessages(!showMessages);
  };



  //for selecting a chat on the left side
  const [selectedChat, setSelectedChat] = useState(null);
  const handleViewChat = (user) => {
    setSelectedChat(user);
  };


  
  //for sending messages
  const [text, setText] = useState("");
  const sendMessage = async () => {
    try {
      const messageData = {
        conversationId: "64b0f68c86bc99602e267a1b",
        senderId: "64b0f5da2ba489bad4f926f9",
        message: `${text}`,
      };
      const response = await fetch("http://localhost:8000/api/message", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(messageData),
      });
      if (response.ok) {
        console.log("Message sent successfully");
        
      } else {
        console.log("error", response.status);
      }
      
      
    } catch (error) {
      console.log("error ", error);
    }
    finally {
      setText('');
    }
   
  };
  const handleMessageChange = (event) => {
    console.log("text: ", text);
    setText(event.target.value);
  };


  // enter key -> sendMessage
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      sendMessage();
    }
  };



//for fetching users
  const [users, setUsers] = useState([]);
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/users");
        const data = await response.json();
        setUsers(data);
        console.log(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchUsers();
  }, []);



  //for fetching messages 
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(
          "http://localhost:8000/api/message/64b0f68c86bc99602e267a1b"
        );
        const data = await response.json();
        setMessages(data);
        console.log(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchMessages();

    // Start polling every 10 milliseconds
    const interval = setInterval(fetchMessages, 10);
    return () => clearInterval(interval);
  }, []);


  //only for determining id sent or received  
  const senderIdArray = messages.map((message) => message.senderId);


// for scrolling to the bottom when new message is sent
  const chatContainerRef = useRef(null);
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);
  


  // return JSX
  return (
    <div className="container">
      <div className="left">
        <span className="toggle-icon" onClick={toggleMessages}>
          <FontAwesomeIcon icon={faBars} />
        </span>
        {showMessages &&
          users.map((user) => (
            <div
              className={
                selectedChat === user ? "selected-chat-item" : "chat-item"
              }
              onClick={() => handleViewChat(user)}
            >
              <img
                src={Asset}
                alt=""
                width={50}
                height={50}
                // className={contacts.isOnline ? "isOnline" : "isOffline"}
              />
              <div className="chat-content">
                <h2>{user.user.fullName}</h2>
                {/* <p>
                  {user.user.message.length> 45
                    ? `${user.user.message.slice(0, 45)}...`
                    : user.user.message}
                </p> */}
              </div>
            </div>
          ))}
      </div>
      <div className="middle">
        {/* <div className="message-text">
          {selectedChat ? (
            <div className="chat-top">
              <img
                src={Asset}
                alt=""
                width={50}
                height={50}
                className={selectedChat.isOnline ? "isOnline" : "isOffline"}
              />
              <div className="chat-content">
                <h2>{selectedChat.name}</h2>
              </div>
            </div>
          ) : (
            <div className="title">Start a conversation</div>
          )}

          {selectedChat && (
            <div className="text-area">
              {selectedChat.messages.map((message) => {
                return (
                  <div className={`text ${message.status}`}>
                    {message.value}
                  </div>
                );
              })}
            </div>
          )}
        </div> */}
        <div className="message-text">
          {selectedChat ? (
            <div className="chat-top">
              <img
                src={Asset}
                alt=""
                width={50}
                height={50}
                className={selectedChat.isOnline ? "isOnline" : "isOffline"}
              />
              <div className="chat-content">
                <h2>{selectedChat.name}</h2>
              </div>
            </div>
          ) : (
            <div className="title">Start a conversation</div>
          )}
          {selectedChat && (
            <div className="text-area" ref={chatContainerRef}>
              {messages.map((message) => (
                <div
                  className={
                    senderIdArray[0] === message.senderId ? "sent" : "received"
                  }
                >
                  {message.message}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="typing-area">
          <input
            type="text"
            required
            placeholder="Type a message"
            className="typing-field"
            onChange={handleMessageChange}
            value={text}
            onKeyPress={handleKeyPress}
          />
          <FontAwesomeIcon
            icon={faPaperPlane}
            className="send-button"
            type="button"
            onClick={sendMessage}
          />
        </div>
      </div>
      <div className="right">
        Registered Users:
        {users.map((user) => (
          <div className="chat-item">{user.user.fullName}</div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
