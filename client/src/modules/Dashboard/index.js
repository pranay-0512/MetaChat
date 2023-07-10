import React, { useState} from "react";
import "./style.css";
import Asset from "../../assets/profile.png";
import Contacts from "../../assets/contacts.json";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars} from "@fortawesome/free-solid-svg-icons";

const Dashboard = () => {
  const [showMessages, setShowMessages] = useState(true);
  const toggleMessages = () => {
    setShowMessages(!showMessages);
  };
  const [selectedChat, setSelectedChat] = useState(null);
  const handleViewChat = (contacts) => {
    setSelectedChat(contacts);
  };
  return (
    <div className="container">
      <div className="left">
        <span className="toggle-icon" onClick={toggleMessages}>
          <FontAwesomeIcon icon={faBars} />
        </span>
        {showMessages &&
          Contacts.map((contacts, index) => (
            <div
              key={index}
              className={
                selectedChat === contacts ? "selected-chat-item" : "chat-item"
              }
              onClick={() => handleViewChat(contacts)}
            >
              <img
                src={Asset}
                alt=""
                width={50}
                height={50}
                className={contacts.isOnline ? "isOnline" : "isOffline"}
              />
              <div className="chat-content">
                <h2>{contacts.name}</h2>
                <p>
                  {contacts.messages[contacts.messages.length - 1].value
                    .length > 45
                    ? `${contacts.messages[
                        contacts.messages.length - 1
                      ].value.slice(0, 45)}...`
                    : contacts.messages[contacts.messages.length - 1].value}
                </p>
              </div>
            </div>
          ))}
      </div>
      <div className="middle">
        Conversation
        
      </div>
      <div className="right">
        Registered Users:
      </div>
    </div>
  );
};

export default Dashboard;
