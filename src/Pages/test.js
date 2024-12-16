import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { addMessage, setMessages, setIsTyping, fetchStartMessage, chatwithAI, analyseChat, clearMessages, loadChat, getTips } from "../feature/chatSlice";
import { VscListSelection } from "react-icons/vsc";
import { TbReportAnalytics } from "react-icons/tb";
import { RiChatNewLine } from "react-icons/ri";
import { Oval } from 'react-loader-spinner';
// import { IoIosArrowRoundForward } from "react-icons/io";
import { IoMdArrowRoundUp } from "react-icons/io";
import "../index.css";
import BotAvatar from "../assets/Images/icon.jpg";

const ChatHome = () => {
  const [input, setInput] = useState("");
  const dispatch = useDispatch();
  const { messages, isTyping, chatSessions, AnalyzedReport, ChatProgress, PreviousMessageCount, AnalyzedMessageCount, AnalyzeProcess, TipActivation } = useSelector((state) => state.chat);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  useEffect(() => {
    if (messagesEndRef.current && messages.length > 0) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    if (TipActivation) {
      console.log('tip activated')
      dispatch(getTips())
    }
  }, [TipActivation])
  const TypingIndicator = () => (
    <div className="flex space-x-1">
      {[1, 2, 3].map((dot, index) => (
        <div
          key={index}
          className={`w-2 h-2 bg-gray-400 rounded-full animate-typing`}
          style={{
            animationDelay: `${index * 0.3}s`,
          }}
        />
      ))}
    </div>
  );
  const groupSessionsByDate = (sessions) => {
    const today = new Date().setHours(0, 0, 0, 0);
    const yesterday = new Date(today).setDate(new Date(today).getDate() - 1);
    const sevenDaysAgo = new Date(today).setDate(new Date(today).getDate() - 7);
    const thirtyDaysAgo = new Date(today).setDate(new Date(today).getDate() - 30);

    const grouped = {
      today: [],
      yesterday: [],
      "last 7 Days": [],
      "last 30 Days": [],
    };

    sessions.forEach((session) => {
      const sessionDate = new Date(session.createdAt).setHours(0, 0, 0, 0);
      if (sessionDate === today) {
        grouped.today.push(session);
      } else if (sessionDate === yesterday) {
        grouped.yesterday.push(session);
      } else if (sessionDate >= sevenDaysAgo) {
        grouped["last 7 Days"].push(session);
      } else if (sessionDate >= thirtyDaysAgo) {
        grouped["last 30 Days"].push(session);
      }
    });

    // Sort each group in ascending order (latest at the top)
    for (const group in grouped) {
      grouped[group].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    }

    return grouped;
  };
  const isAnalyzeDisabled = PreviousMessageCount < 1 || AnalyzedMessageCount === PreviousMessageCount;
  const analyse = () => {
    dispatch(analyseChat())
    console.log('Analyzing')
  }
  const loadSession = (sessionId) => {
    // console.log(sessionId)
    dispatch(clearMessages())
    dispatch(loadChat(sessionId))

  }
  const groupedSessions = groupSessionsByDate(chatSessions);
  
  const fetchInitialMessage = async () => {
    dispatch(fetchStartMessage({UserMessage: "As an owner of the product Create a brief of 50 words explanation on your product called PetConnect which helps pet owners connect, share photos, and find pet-related services."}))
  };
  const handleSend = () => {
    if (input.trim()) {
        dispatch(chatwithAI(input));
        setInput("");
        if (inputRef.current) {
            inputRef.current.style.height = "auto"; // Reset height
        }
    }
  };
  
  const handleInput = (e) => {
    setInput(e.target.value);
    const textarea = inputRef.current;
    // if (textarea) {
    //   // Reset height first to accommodate new content
    //   textarea.style.height = "auto";
    //   // Set the height to scrollHeight but cap it at the max height of 194px
    //   textarea.style.height = `${Math.min(textarea.scrollHeight, 194)}px`;
    // }
  };

  const handleInputKeyDown = (e) => {
    const textarea = inputRef.current;
    
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSend();
    } else if (e.key === "Enter") {
      e.preventDefault();
      setInput((prev) => prev + "\n"); // Add a new line
      setTimeout(() => {
        if (textarea) {
          textarea.scrollTop = textarea.scrollHeight;
        }
      }, 0);
      // // Manually adjust the textarea height and ensure the max height is capped at 194px
      // setTimeout(() => {
      //   if (textarea) {
      //     textarea.style.height = "auto"; // Reset height first
      //     const newHeight = Math.min(textarea.scrollHeight, 194); // Max height capped at 194px
      //     textarea.style.height = `${newHeight}px`; // Adjust to new content height
          
      //     // Scroll to the bottom to keep the latest message visible
      //     textarea.scrollTop = textarea.scrollHeight;
      //   }
      // }, 0);
    }
  };

  const handleGetStarted = () => {
    fetchInitialMessage();
  };
  const handleTogglePanel = () => {
    setIsPanelOpen(!isPanelOpen);
  };
  const createNewChat = () => {
    dispatch(clearMessages())
    fetchInitialMessage();
  }

  return (
    <div className="flex flex-col h-screen bg-[#171717] text-[#F2F2F2] font-[Satoshi]">
      {ChatProgress.isLoading && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
          <div className="loader"></div>
        </div>
      )}
      {!messages.length && !ChatProgress.loading ? (
  <div className="flex-1 flex flex-col items-center justify-center text-center p-4 mt-[-8%] bg-[#F2F2F2] text-[#F2F2F2]">
    <h1
      className="text-[4rem] font-bold leading-tight mt-[-100px] mb-10 mt-4 text-[#171717]"
      style={{ fontFamily: "Satoshi" }}
    >
      Welcome to <br />
      <span className="block">GradScaler</span>
    </h1>
    <div className="grid grid-cols-4 gap-10 mt-6">
      <button
        onClick={handleGetStarted}
        className="px-6 py-3 bg-[#F2F2F2] text-[#262626] rounded-[4rem] font-semibold border border-[#171717] border-[2px] hover:bg-[#171717] hover:text-[#F2F2F2]"
      >
        Medical AI
      </button>
      <button
        onClick={handleGetStarted}
        className="px-6 py-3 bg-[#F2F2F2] text-[#262626] rounded-[4rem] font-semibold border border-[#171717] border-[2px] hover:bg-[#171717] hover:text-[#F2F2F2]"
      >
        Product Law AI
      </button>
      <button
        className="relative px-6 py-3 bg-[#E8E8E8] text-[#595959] rounded-[4rem] font-semibold border border-[#3A3A3A] border-[2px] tts-button"
      >
        <span className="button-text">PDF Analyzer</span>
      </button>
      <button
        className="relative px-6 py-3 bg-[#E8E8E8] text-[#595959] rounded-[4rem] font-semibold border border-[#3A3A3A] border-[2px] tts-button"
      >
        <span className="button-text">TTS</span>
      </button>
    </div>
    <div className="chat-input-wrapper mt-auto w-full max-w-4xl">
    <div
      className="mt-10 flex items-center justify-center p-2 w-full max-w-4xl border border-[#F2F2F2] rounded-lg bg-[#F2F2F2]"
      style={{ borderRadius: "2rem", height: "90px", border: "solid 2px black" }}
    >
      <textarea
        ref={inputRef}
        placeholder="Type a message..."
        value={input}
        onInput={handleInput}
        onKeyDown={handleInputKeyDown}
        className="flex-1 p-2 bg-[#F2F2F2] text-[#171717] rounded-lg focus:outline-none border-none resize-none overflow-y-auto"
        style={{
          lineHeight: "24px",
          height: "50px",
          boxSizing: "border-box",
        }}
      />
      <div
        className="ml-2 flex items-center justify-center"
        style={{
          height: "50px",
          width: "50px",
        }}
      >
        <button
          onClick={handleSend}
          className="p-2 rounded-full flex items-center justify-center"
          style={{
            height: "50px",
            width: "50px",
            backgroundColor: "#171717",
            border: "none",
            cursor: "pointer",
          }}
        >
          <IoMdArrowRoundUp style={{ fontSize: "1.5rem", color: "#F2F2F2" }} />
        </button>
      </div>
    </div>
    </div>
  </div>
): (
        <>
          <div className="flex-1 grid grid-cols-[1fr_3fr_1fr] gap-4 p-4">
            <div className="col-span-1" >
            </div>
            <div className="col-span-1 p-4 rounded-lg overflow-y-auto max-h-[calc(100vh-230px)]"> 
              <div className="space-y-4 flex flex-col mt-11">
                {messages.map((msg, index) => (
                  <div key={index} className={`flex ${msg.isUser ? "justify-end" : "justify-start"} items-start`}>
                    {!msg.isUser && (
                      <div className="w-7 h-7 rounded-full flex-shrink-0 mr-4 self-start">
                        <img
                          src= {BotAvatar}
                          alt="Bot Avatar"
                          className="w-full h-full rounded-full object-cover"
                        />
                      </div>
                    )}
                    <div
                      className={`p-0 rounded-lg ${msg.isUser ? "text-right bg-gray-400 p-2 pr-4 pl-4" : "text-left"}`}
                      style={{ maxWidth: "60%", whiteSpace: "pre-wrap", lineHeight: "1.5", textAlign: "left",backgroundColor: msg.isUser && "hsl(0, 0%, 10.3%)", }}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
                {isTyping && <TypingIndicator />}
              </div>
              <div ref={messagesEndRef} />
            </div>
            <div
              className={`col-span-1 ${AnalyzeProcess.isLoading ? 'analyze-Content' : ''}`}
              style={{ padding: "10px" }}
            >
              {/* here we need to add loading */}
              {AnalyzeProcess.isLoading ? 
              <>
              <div style={{marginTop: "60px", backgroundColor: "hsl(0, 0%, 10.3%)", padding: "10px", borderRadius: "0.6rem", maxHeight: "65vh", overflowY: "auto", whiteSpace: "pre-wrap"}}>
                <Oval
                  height={40}
                  width={40}
                  color="#007BFF"
                  secondaryColor="#ccc"
                  visible={true}
                  ariaLabel="analyzing"
                />
              </div>
              </> 
              : 
              <>
              <div style={{marginTop: "60px", backgroundColor: "hsl(0, 0%, 10.3%)", padding: "10px", borderRadius: "0.6rem", maxHeight: "65vh", overflowY: "auto", whiteSpace: "pre-wrap",}}>
              {AnalyzedReport}
              </div>
              </>
              }
            
            </div>
          </div>

          <div className="grid grid-cols-[1fr_3fr_1fr] gap-4 p-4">
          <div className="col-span-1"></div>

          <div 
        className="chat-container col-span-1 flex items-center p-2 border border-[#F2F2F2] rounded-lg mb-1 bg-[#171717]" 
        style={{ borderRadius: "2rem", height: "90px" }}
      >
        <textarea
          ref={inputRef}
          placeholder="Type a message..."
          value={input}
          onInput={handleInput}
          onKeyDown={handleInputKeyDown}
          className="flex-1 p-2 bg-[#171717] text-[#F2F2F2] rounded-lg focus:outline-none border-none resize-none overflow-y-auto"
          style={{
            lineHeight: "24px",
            height: "50px", // Consistent height
            boxSizing: "border-box", // Ensures padding doesn't add extra height
          }}
        />
        <div 
          className="ml-2 flex items-center justify-center"
          style={{
            height: "50px", // Same height as textarea
            width: "50px",
          }}
        >
            <button
              onClick={handleSend}
              className="p-2 rounded-full flex items-center justify-center"
              style={{
                height: "50px", // Same height for symmetry
                width: "50px",
                backgroundColor: "white", // Example background
                border: "none",
                cursor: "pointer",
              }}
            >
              {/* <FaTelegramPlane style={{ fontSize: "1.5rem", color: "white" }} /> */}
              <IoMdArrowRoundUp style={{ fontSize: "1.5rem", color: "black" }}/>
            </button>
          </div>
          </div>

            <div className="col-span-1" style={{position: "relative"}}>
              <button
                onClick={analyse}
                disabled={isAnalyzeDisabled}
                style={{background: isAnalyzeDisabled ? "gray": "white", width: "100px", height: "30px", position: "absolute", top: 0, right: "-12px", borderRadius: "5%", padding: "0px 2px", cursor: isAnalyzeDisabled ? 'not-allowed' : 'pointer',}}
              >
            <div className="react-icon" style={{ display: "flex", alignItems: "center", zIndex: 2, padding: "0px 4px"}}>
            <span style={{ fontSize: "0.8rem", color: "black", marginRight: "35px"}} className="font-[Satoshi]">Analyze</span>
            <TbReportAnalytics size={13} color={"black"} />
            </div>
              </button>
            
            </div>
          </div>

          <div className="text-center text-sm text-gray-400 mb-4">
            <p>Product Law AI can make mistakes. Please check the accuracy of the information provided.</p>
          </div>
        </>
      )}
    </div>
  );
};

export default ChatHome;
