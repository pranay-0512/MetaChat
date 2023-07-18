import React, { useState, useEffect, useRef } from "react";
import "./style.css";
import Asset from "../../assets/profile.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";

const Dashboard = () => {
  const navigate = useNavigate();
  // for the toggle button
  const [showMessages, setShowMessages] = useState(true);
  const toggleMessages = () => {
    setShowMessages(!showMessages);
  };
  const [showUsers, setShowUsers] = useState(true);
  const toggleUsers = ()=>{
    setShowUsers(!showUsers);
  }
  //for selecting a chat on the left side
  const [selectedChat, setSelectedChat] = useState(null);
  //for selecting user and fetching the messages associated with loggedUser and selected user
  const handleViewChat = async (user) => {
    setSelectedChat(user);
    try {
      const response = await fetch(
        `http://192.168.0.212:8000/api/message/${user.conversationId}`
      );
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // for getting logged in user details
  
  const loggedUserDataJson = JSON.parse(localStorage.getItem("user:detail"));
  const loggedId = loggedUserDataJson.id;
  

  //for sending messages
  const [text, setText] = useState("");
  const sendMessage = async () => {
    try {
      const messageData = {
        conversationId: selectedChat.conversationId,
        senderId: loggedId,
        message: `${text}`,
      };
      const response = await fetch("http://192.168.0.212:8000/api/message", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(messageData),
      });
      if (!response.ok) {
        console.log("Error sending message", response.status);
      }
    } catch (error) {
      console.log("error ", error);
    } finally {
      setText("");
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

  //for fetching messages for a specific conversation
  const [messages, setMessages] = useState([]);
  const fetchMessages = async (conversationId) => {
    try {
      const response = await fetch(
        `http://192.168.0.212:8000/api/message/${conversationId}`
      );
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
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

  //for fetching users for the right div
  const [users, setUsers] = useState([]);
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://192.168.0.212:8000/api/users");
        const data = await response.json();
        const filteredUsers = data.filter((user) => user.userId !== loggedId); // filtering out the logged user, to prevent app crash
        setUsers(filteredUsers);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchUsers();
  }, [loggedId,users]);

  // for setting up a conversation between 2 registered users
  const startConversation = async (receiverId) => {
    try {
      const senderId = loggedId;
      const response = await fetch("http://192.168.0.212:8000/api/conversation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ senderId, receiverId }),
      });
      if (response.ok) {
        fetchExistingConversation();
        const receiverUser = users.find((user) => user.userId === receiverId);
        setSelectedChat(receiverUser);
        const conversationId = receiverUser.conversationId
        console.log(conversationId, "Conversation id created")
        fetchMessages(conversationId);
      } else {
        console.log("Conversation already exists! ");
      }
    } catch (error) {
      console.log("error ", error);
    }
  };

  // only showing the existing conversation on the left div
  const [existingConvo, setExistingConvo] = useState([]);
  const fetchExistingConversation = async () => {
    try {
      const response = await fetch(
        `http://192.168.0.212:8000/api/conversation/${loggedId}`
      );
      const data = await response.json();
      setExistingConvo(data);
    } catch (error) {
      console.log("error ", error);
    }
  };
  useEffect(() => {
    fetchExistingConversation();
  }, [users]);

  // for to-bottom scrolling
  const chatContainerRef = useRef(null);
  useEffect(() => {
    // Scroll to the bottom of the chat container whenever new messages are added
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);


  
  const handleUserLogout = () => {
    localStorage.removeItem('user:token');
    navigate("/login")
    console.log('Button clicked!');
  };
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
      <div className="">Logged In as: <b>{loggedUserDataJson.fullName}</b></div>
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
            <div className="title">
              Hello {loggedUserDataJson.fullName}, start a conversation
            </div>
          )}
          {selectedChat && (
            <div className="text-area" ref={chatContainerRef}>
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
        {selectedChat && (
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
        )}
      </div>
      <div className="right">
      <span className="toggle-icon" onClick={toggleUsers}>
          <FontAwesomeIcon icon={faBars} />
          </span>
        {showUsers &&  users.map((user) => (
          <div
            className="chat-item"
            onClick={() => startConversation(user.userId)}
          >
            {user.user.fullName}
          </div>
        ))}
        
        {/* <Button onClick={(e)=>handleLogOut(e)} label="Log out" name="logout">LogOut</Button> */}
        <Button label="Log out" onclick={handleUserLogout} />
        
      </div>
    </div>
  );
};

export default Dashboard;
