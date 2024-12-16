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
import { useNavigate } from "react-router-dom";

const ProductLawAI = () => {
  const [input, setInput] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const { messages, isTyping, chatSessions, AnalyzedReport, ChatProgress, PreviousMessageCount, AnalyzedMessageCount, AnalyzeProcess, TipActivation } = useSelector((state) => state.chat);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);


    // useEffect(() => {
    //   const sessionId = JSON.parse(localStorage.getItem('currentSessionId'))
  
    //   dispatch(clearMessages())
    //   dispatch(loadChat(sessionId))
    //   // if (sessionTitle.toLowerCase().startsWith('medicalai'.toLowerCase())){
    //   //   navigate('/MedicalAI')
    //   // }
    //   // else{
    //   //   navigate('/ProductLawAI')
    //   // }
    // }, [])
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
      grouped[group].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).reverse();
    }

    return grouped;
  };
  const isAnalyzeDisabled = PreviousMessageCount < 1 || AnalyzedMessageCount === PreviousMessageCount;
  const analyse = () => {
    dispatch(analyseChat())
    console.log('Analyzing')
  }
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
  // const createNewChat = () => {
  //   dispatch(clearMessages())
  //   fetchInitialMessage();
  // }
  const createNewChat = () => {
    navigate('/home')
  }

  return (
    <div className="flex flex-col h-screen bg-[#F2F2F2] text-[#171717] font-[Satoshi]" >
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
        <>
        {/* TOP ROW */}
        <div className="flex-1 grid grid-cols-[1fr_3fr_1fr] gap-4 p-2 mt-[65px]">
            {/* LEFT COLUMN */}
            <div className="col-span-1" >
            </div>
            {/* MIDDLE COLUMN*/}
            <div className="col-span-1 p-4 rounded-lg overflow-y-auto max-h-[calc(100vh-260px)]"> 
              {/* MESSAGE AREA (MIDDLE COLUMN) */}
              <div className="space-y-4 flex flex-col mt-2">
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
                      style={{ maxWidth: "60%", whiteSpace: "pre-wrap", lineHeight: "1.5", textAlign: "left",backgroundColor: msg.isUser && "#E8E8E8", }}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
                {isTyping && <TypingIndicator />}
              </div>
              <div ref={messagesEndRef} />
            </div>
            {/* RIGHT COLUMN (ANALYZE AREA)*/}
            <div
              className={`col-span-1 ${AnalyzeProcess.isLoading ? 'analyze-Content' : ''}`}
              style={{ padding: "10px" }}
            >
              {/* here we need to add loading */}
              {AnalyzeProcess.isLoading ? 
              <div>
              <div style={{marginTop: "60px", backgroundColor: "#F2F2F2", padding: "10px", borderRadius: "0.6rem", maxHeight: "65vh", overflowY: "auto", whiteSpace: "pre-wrap"}}>
                <Oval
                  height={40}
                  width={40}
                  color="#171717"
                  secondaryColor="#ccc"
                  visible={true}
                  ariaLabel="analyzing"
                />
              </div>
              </div> 
              : 
              <>
              <div style={{backgroundColor: AnalyzedReport && AnalyzedReport.length > 0 ? "#E8E8E8" : "transparent", padding: "10px", borderRadius: "0.6rem", maxHeight: "66vh", overflowY: "auto", whiteSpace: "pre-wrap",}}>
              <p>{AnalyzedReport}</p>
              </div>
              </>
              }
            
            </div>
        </div>

        {/* BOTTOM ROW */}
        <div className="grid grid-cols-[1fr_3fr_1fr] gap-4 p-4 bottom-0">
          {/* LEFT COLUMN*/}
          <div className="col-span-1"></div>
          {/* MIDDLE COLUMN*/}
          <div 
              className="chat-container col-span-1 flex items-center p-2 border border-[#171717] border-[2px] rounded-lg mb-1 bg-[#F2F2F2]" 
              style={{ borderRadius: "2rem", height: "90px" }}
            >
              <textarea
                ref={inputRef}
                placeholder="Type a message..."
                value={input}
                onInput={handleInput}
                onKeyDown={handleInputKeyDown}
                className="flex-1 p-2 bg-[#F2F2F2] text-[#171717] rounded-lg focus:outline-none border-none resize-none overflow-y-auto bottom-0"
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
                      height: "50px",
                      width: "50px",
                      backgroundColor: "#171717",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    {/* <FaTelegramPlane style={{ fontSize: "1.5rem", color: "white" }} /> */}
                    <IoMdArrowRoundUp style={{ fontSize: "1.5rem", color: "#F2F2F2" }}/>
                  </button>
                </div>
          </div>
          {/* RIGHT COLUMN*/}
          <div className="col-span-1" style={{position: "relative"}}>
              <button
                onClick={analyse}
                disabled={isAnalyzeDisabled}
                style={{background: isAnalyzeDisabled ? "#E8E8E8": "#EC4899", width: "100px", height: "30px", position: "absolute", top: 0, right: "-12px", borderRadius: "5%", padding: "0px 2px", cursor: isAnalyzeDisabled ? 'not-allowed' : 'pointer',}}
              >
            <div className="react-icon" style={{ display: "flex", alignItems: "center", zIndex: 2, padding: "0px 4px"}}>
            <span style={{ fontSize: "0.8rem", color: isAnalyzeDisabled ? "#171717" : "#F2F2F2", marginRight: "35px"}} className="font-[Satoshi]">Analyze</span>
            <TbReportAnalytics size={"2rem"} color={isAnalyzeDisabled ? "" : "#F2F2F2"} />
            </div>
              </button>
            
          </div>
        </div>

        <div className="text-center text-sm text-gray-400 mb-2">
            <p>Product Law AI can make mistakes. Please check the accuracy of the information provided.</p>
        </div>
        </>
    </div>
)};

export default ProductLawAI;
