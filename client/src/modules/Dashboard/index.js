import React, { useState, useEffect} from "react";
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
  //for selecting user and fetching the messages
  const handleViewChat = async (user) => {
    setSelectedChat(user);
      try {
        const response = await fetch(
          `http://localhost:8000/api/message/${user.conversationId}`
        );
        const data = await response.json();
        setMessages(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
 
  // for getting login details
  const [loggedUser, setLoggedUser] = useState('');
  const loggedId = '64b0f5ce2ba489bad4f926e8'; 
  useEffect(() => {
    const fetchLoggedUser = async ()=>{
      try {
        const response = await fetch(`http://localhost:8000/api/users/${loggedId}`);
        const data = await response.json();
        setLoggedUser(data)
      } catch (error) {
        console.log('error ', error )
      }
    }
    fetchLoggedUser();
  }, [])
  
   //for sending messages
  const [text, setText] = useState("");
  const sendMessage = async () => {
    try {
      const messageData = {
        conversationId: selectedChat.conversationId, // conversationId between pranay and rajat
        senderId: loggedId,
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
        const filteredUsers = data.filter(user => user.userId !== loggedId);
        setUsers(filteredUsers);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchUsers();
  }, []);
  //for fetching messages 
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    const fetchMessages = async (conversationId) => {
      try {
        const response = await fetch(
          `http://localhost:8000/api/message/${conversationId}`
        );
        const data = await response.json();
        setMessages(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    // Fetch messages initially
    fetchMessages(selectedChat?.conversationId);
    // Start polling every 1 second
    const interval = setInterval(() => {
      if (selectedChat) {
        fetchMessages(selectedChat.conversationId);
      }
    }, 1000);
    // Cleanup the interval on component unmount
    return () => clearInterval(interval);
  }, [selectedChat]);
  // for starting a conversation between 2 registered users
  const startConversation =async(receiverId)=>{
    try {
      const  senderId = loggedId;
      const response = await fetch('http://localhost:8000/api/conversation',{
        method:'POST',
        headers:{
          'Content-Type':'application/json'
        },
        body:JSON.stringify({senderId, receiverId})
      });
      if(response.ok){
        console.log('Conversation created successfully');
        alert("New conversation created")
      }else{
        console.log('Conversation already exists! ', response.status)
        alert("Conversation already exists!")
      }

    } catch (error) {
      console.log('error ', error )
    }
  }
  // only showing the existing conversation on the left div instead of all the registered users.
  const [existingConvo, setExistingConvo] = useState([]);
  useEffect(() => {
    const fetchExistingConversation = async ()=>{
      try {
        const response = await fetch(`http://localhost:8000/api/conversation/${loggedId}`);
        const data = await response.json();
        setExistingConvo(data);
      } catch (error) {
        console.log('error ', error )
      }
    }
    fetchExistingConversation();
  }, []) 
  // return JSX
  return (
    <div className="container">
      <div className="left">
        <span className="toggle-icon" onClick={toggleMessages}>
          <FontAwesomeIcon icon={faBars} />
        </span>
        {showMessages &&
          existingConvo.map((user) => (
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
                <h2 id={user.conversationId}>{user.user.fullName}</h2>
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
                <h2>{selectedChat.user.fullName}</h2>
              </div>
            </div>
          ) : (
            <div className="title">Hello {loggedUser.fullName}, start a conversation</div>
          )}
          {selectedChat && (
            <div className="text-area">
              {messages.map((message) => (
                <div
                  className={
                    loggedId === message.senderId ? "sent" : "received"
                  }
                >
                  {message.message}
                </div>
              ))}
            </div>
          )}
        </div>
        {selectedChat&&<div className="typing-area">
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
        </div>}
      </div>
      <div className="right">
        Registered Users:
        {users.map((user) => (
          <div className="chat-item" onClick={()=>startConversation(user.userId)}>{user.user.fullName}</div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
