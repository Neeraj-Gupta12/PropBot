import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { chatWithBot, getChatbotSuggestions, addUserMessage, clearMessages } from "../../redux/slices/chatbotSlice";
import "./Chatbot.css";

const Chatbot = () => {
  const dispatch = useDispatch();
  const { messages, suggestions, loading, error } = useSelector((state) => state.chatbot);
  const [input, setInput] = useState("");
  const [open, setOpen] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    dispatch(getChatbotSuggestions());
  }, [dispatch]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, open]);

  const handleSend = () => {
    if (input.trim()) {
      dispatch(addUserMessage(input));
      dispatch(chatWithBot(input));
      setInput("");
    }
  };

  const handleSuggestion = (suggestion) => {
    setInput(suggestion);
    dispatch(addUserMessage(suggestion));
    dispatch(chatWithBot(suggestion));
    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSend();
  };

  // Responsive font size for mobile
  const isMobile = window.innerWidth <= 500;
  const contentFontSize = isMobile ? "13px" : "15px";
  const headerFontSize = isMobile ? "16px" : "18px";
  const suggestionFontSize = isMobile ? "12px" : "13px";

  return (
    <div className="chatbot-container">
      <button
        className="chatbot-toggle"
        style={{
          position: "fixed",
          bottom: "30px",
          right: "30px",
          zIndex: 9999,
          boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
        }}
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Open Chatbot"
      >
        <span style={{fontSize: isMobile ? "22px" : "28px"}}>💬</span>
      </button>
      {open && (
        <div
          className="chatbot-window"
          style={{
            position: "fixed",
            bottom: isMobile ? "10px" : "80px",
            right: isMobile ? "0px" : "30px",
            left: isMobile ? "0px" : "auto",
            width: isMobile ? "98vw" : window.innerWidth <= 900 ? "350px" : "440px",
            maxWidth: "98vw",
            zIndex: 9999,
          }}
        >
          <div className="chatbot-header" style={{fontSize: headerFontSize}}>
            <span>TravelEase Chatbot</span>
            <button className="chatbot-close" onClick={() => setOpen(false)} style={{fontSize: headerFontSize}}>
              ×
            </button>
          </div>
          <div className="chatbot-messages" style={{fontSize: contentFontSize}}>
            {messages.length === 0 && (
              <div className="chatbot-welcome" style={{fontSize: contentFontSize}}>Hi! How can I help you today?</div>
            )}
            {messages.map((msg, idx) => (
              <div key={idx} className={`chatbot-message ${msg.type}`} style={{fontSize: contentFontSize}}>
                {msg.content}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className="chatbot-suggestions">
            {suggestions.map((s, idx) => (
              <button key={idx} className="chatbot-suggestion" onClick={() => handleSuggestion(s)} style={{fontSize: suggestionFontSize}}>
                {s}
              </button>
            ))}
          </div>
          <div className="chatbot-input-row">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              disabled={loading}
              style={{fontSize: contentFontSize}}
            />
            <button onClick={handleSend} disabled={loading || !input.trim()} style={{fontSize: contentFontSize}}>
              Send
            </button>
          </div>
          <button className="chatbot-clear" onClick={() => dispatch(clearMessages())} style={{fontSize: suggestionFontSize}}>
            Clear Chat
          </button>
          {error && <div className="chatbot-error" style={{fontSize: suggestionFontSize}}>{error}</div>}
        </div>
      )}
    </div>
  );
};

export default Chatbot;
