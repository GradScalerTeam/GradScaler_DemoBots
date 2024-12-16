import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { addMessage, setMessages, setIsTyping, fetchStartMessage, chatwithAI, analyseChat, clearMessages, loadChat, getTips, fetchMedicalAIStartMessage } from "../feature/chatSlice";
import { VscListSelection } from "react-icons/vsc";
import { TbReportAnalytics } from "react-icons/tb";
import { RiChatNewLine } from "react-icons/ri";
import { Oval } from 'react-loader-spinner';
// import { IoIosArrowRoundForward } from "react-icons/io";
import { IoMdArrowRoundUp } from "react-icons/io";
import "../index.css";
import BotAvatar from "../assets/Images/icon.jpg";
import { useNavigate } from "react-router-dom";
import ProductLawAI from "./ProductLawAI";

const ChatHome = () => {
  const [input, setInput] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const { messages, isTyping, chatSessions, AnalyzedReport, ChatProgress, PreviousMessageCount, AnalyzedMessageCount, AnalyzeProcess, TipActivation } = useSelector((state) => state.chat);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  useEffect(() => {
    if (messagesEndRef.current && messages.length > 0) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

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
      grouped[group].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).reverse();
    }

    return grouped;
  };
  const loadSession = (sessionId, sessionTitle) => {
    // console.log(sessionId)
    dispatch(clearMessages())
    dispatch(loadChat(sessionId))
    if (sessionTitle.toLowerCase().startsWith('medicalai'.toLowerCase())){
      navigate('/MedicalAI')
    }
    else{
      navigate('/ProductLawAI')
    }
  }
  const groupedSessions = groupSessionsByDate(chatSessions);
  
  const fetchInitialMessage = async () => {
    dispatch(fetchStartMessage({UserMessage: "As an owner of the product Create a brief of 50 words explanation on your product called PetConnect which helps pet owners connect, share photos, and find pet-related services."}))
  };
  const fetchMedicalInitialMessage = async () => {
    dispatch(fetchMedicalAIStartMessage({UserMessage: "Hey! Please introduce yourself and tell me about all the user cases you can help me with."}))
  }
  const handleGetStarted = () => {
    navigate('/ProductLawAI')
    dispatch(clearMessages())
    fetchInitialMessage();
  };
  const handleMedicalGetStarted = () => {
    navigate('/MedicalAI')
    dispatch(clearMessages())
    fetchMedicalInitialMessage()
  }
  const handleSend = () => {
    if (input.trim()) {
      navigate('/gradScaler')
      if (messages.length === 0) {
        navigate('/gradScaler');
        // fetchInitialMessage();
      }
        // dispatch(chatwithAI(input));
        setInput("");
        if (inputRef.current) {
            inputRef.current.style.height = "auto"; // Reset height
        }
    }
  };
  
  const handleInput = (e) => {
    setInput(e.target.value);
    const textarea = inputRef.current;
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

  const handleTogglePanel = () => {
    setIsPanelOpen(!isPanelOpen);
  };
  const createNewChat = () => {
    dispatch(clearMessages())
    fetchInitialMessage();
  }

  return (
    <div className="flex flex-col h-screen bg-[#171717] text-[#F2F2F2] font-[Satoshi]">
      {/* <div className="absolute bg-[#FF6B6B] rounded-full opacity-[27%] w-[200px] h-[200px] top-[14%] left-[10%] circle-animation circle-1" />
<div className="absolute bg-[#FFD93D] rounded-full opacity-30 w-[300px] h-[300px] top-[20%] left-[70%] translate-y-[-50%] circle-animation circle-2" />
<div className="absolute bg-[#6BCB77] rounded-full opacity-30 w-[150px] h-[150px] bottom-[10%] left-[40%] circle-animation circle-3" />
<div className="absolute bg-[#4D96FF] rounded-full opacity-30 w-[100px] h-[100px] bottom-[10%] right-[10%] circle-animation circle-4" /> */}

      {/* Header */}
      <div className="flex items-center bg-[#F2F2F2] text-[#171717] p-4" style={{position:"absolute", width: "100%", justifyContent: "space-between", alignItems: "center"}}>
        <button
          onClick={handleTogglePanel}
          className="text-[#171717] rounded-full p-2 mr-4"
        >
          <VscListSelection  style={{ fontSize: '1.5rem' }}/>
        </button>
        <h2 className="text-lg font-bold" style={{letterSpacing: "0.1rem"}}>GradScaler</h2>
                
        <button
          onClick={createNewChat}
        >
        <RiChatNewLine style={{ fontSize: '1.5rem', color: '#171717' }} />
        </button>
        
      </div>
      {isPanelOpen && (
        <div className={`slide-panel ${isPanelOpen ? "open" : ""}`}>
          {Object.entries(groupedSessions)
      .filter(([_, sessions]) => sessions.length > 0) // Filter out empty sections
      .map(([label, sessions]) => (
        <div key={label} className="mb-6">
          <h4 className="text-lg font-medium mb-2" style={{fontSize: '0.9rem', fontWeight: 'bold'}}>
            {label.charAt(0).toUpperCase() + label.slice(1)}
          </h4>
          <ul className="space-y-2">
            {sessions.map((session, index) => (
              <li
                key={index}
                className="cursor-pointer p-3 rounded hover:bg-[#E8E8E8]"
                onClick={() => loadSession(session.sessionId, session.title)}
                style={{ lineHeight: "1rem", fontSize: '1rem' }}
              >
                {session.title || "New Chat"}
              </li>
            ))}
          </ul>
        </div>
      ))}
      </div>
      )}
      {ChatProgress.isLoading && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
          <div className="loader"></div>
        </div>
      )}
      {/* {!messages.length && !ChatProgress.loading ? ( */}
         <div className="flex-1 flex flex-col items-center justify-center text-center p-4 bg-[#F2F2F2] text-[#F2F2F2]">
         <h1
           className="text-[4rem] font-bold leading-tight mt-[-50px] mb-10 text-[#171717]"
           style={{ fontFamily: "Satoshi" }}
         >
           Welcome to <br />
           <span className="block">GradScaler</span>
         </h1>
       
         <div className="grid grid-cols-4 gap-10 mt-6">
           <button
             onClick={handleMedicalGetStarted}
             className="px-6 py-3 bg-[#F2F2F2] text-blue-500 rounded-[4rem] font-semibold border border-blue-500 border-[2px] hover:bg-blue-500 hover:text-[#F2F2F2]" style={{zIndex: 10}}
           >
             Medical AI
           </button>
           <button
             onClick={handleGetStarted}
             className="px-6 py-3 bg-[#F2F2F2] text-pink-500 rounded-[4rem] font-semibold border border-pink-500 border-[2px] hover:bg-pink-500 hover:text-[#F2F2F2]"
             style={{zIndex: 10}}
           >
             Product Law AI
           </button>
           <button
             className="relative px-6 py-3 bg-[#E8E8E8] text-[#595959] rounded-[4rem] font-semibold border border-[#3A3A3A] border-[2px] tts-button"
             style={{zIndex: 10}}
           >
             <span className="button-text">PDF Analyzer</span>
           </button>
           <button
             className="relative px-6 py-3 bg-[#E8E8E8] text-[#595959] rounded-[4rem] font-semibold border border-[#3A3A3A] border-[2px] tts-button"
             style={{zIndex: 10}}
           >
             <span className="button-text">TTS</span>
           </button>
         </div>
       
         {/* Chat Input */}
         <div className="chat-input-wrapper" style={{zIndex: 10}}>
           <div
             className="flex items-center justify-center p-2 w-full max-w-4xl border border-[#F2F2F2] rounded-lg bg-[#F2F2F2]"
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
       
      {/* ) : ( */}
        {/* <ProductLawAI /> */}
      {/* )} */}
  
    </div>
  );
};

export default ChatHome;
