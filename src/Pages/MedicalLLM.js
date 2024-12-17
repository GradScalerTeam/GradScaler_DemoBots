import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { addMessage, setMessages, setIsTyping, fetchStartMessage, chatwithAI, analyseChat, clearMessages, loadChat, getTips, chatwithMedicalAI, uploadFile, analyzePDF } from "../feature/chatSlice";
import { VscListSelection } from "react-icons/vsc";
import { TbReportAnalytics } from "react-icons/tb";
import { IoDocumentAttachOutline } from "react-icons/io5";
import { RiChatNewLine } from "react-icons/ri";
import { Oval } from 'react-loader-spinner';
// import { IoIosArrowRoundForward } from "react-icons/io";
import { IoMdArrowRoundUp } from "react-icons/io";
import "../index.css";
import BotAvatar from "../assets/Images/medicalai.webp";
import { useNavigate } from "react-router-dom";

const MedicalAI = () => {
  const [input, setInput] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const hiddenFileInput = useRef(null);
  const isInitialMount = useRef(true);
  const { messages, isTyping, chatSessions, AnalyzedReport, ChatProgress, PreviousMessageCount, AnalyzedMessageCount, AnalyzeProcess, TipActivation, pdfUrl } = useSelector((state) => state.chat);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  useEffect(() => {
    if (messagesEndRef.current && messages.length > 0) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  // useEffect(() => {
  //   const navigationType = performance.getEntriesByType('navigation')[0]?.type || 'navigate';
    
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
  // useEffect(() => {
  //   // Use the Performance API to detect reloads
  //   const navigationEntry = performance.getEntriesByType("navigation")[0];
  //   const isReload =
  //     navigationEntry?.type === "reload" ||
  //     window.performance.navigation.type === 1; // Fallback for older browsers

  //   // Ensure this block runs only on reloads, not on navigation
  //   if (isReload) {
  //     const sessionId = JSON.parse(localStorage.getItem("currentSessionId"));
  //     if (sessionId) {
  //       dispatch(clearMessages());
  //       dispatch(loadChat(sessionId));
  //     }
  //   }
  // }, []);
  useEffect(() => {
    if (messagesEndRef.current && messages.length > 0) {
      setTimeout(() => {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      }, 100); // Add a slight delay to ensure the DOM updates are complete
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
        dispatch(chatwithMedicalAI(input));
        setInput("");
        if (inputRef.current) {
            inputRef.current.style.height = "auto"; // Reset height
        }
    }
  };
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log("Selected file:", file);
      // dispatch(uploadFile({file: file}))
      try {
        const response = await dispatch(uploadFile({ file })).unwrap();
        console.log(response)
        if (response.isFile) {
          dispatch(analyzePDF({url: response.text, isFile: true}));
        }
      } catch (error) {
        console.error("Error during file upload:", error);
      }
      
      // dispatch(analyzePDF(pdfUrl));
      event.target.value = null;
    }
  };
  const handleUpload = () => {
    hiddenFileInput.current.click();
  }
  
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
        {/* <div className="flex-1 grid grid-cols-[1fr_3fr_1fr] gap-4 p-2 mt-[65px]"> */}
        <div className="flex-1 grid grid-cols-1 mt-[65px] sm:grid-cols-[1fr_3fr_1fr] gap-4 p-2">

            {/* LEFT COLUMN */}
            <div className="col-span-1 sm:block hidden" >
            </div>
            {/* MIDDLE COLUMN*/}
            <div className="col-span-1 p-4 rounded-lg overflow-y-auto max-h-[calc(100vh-315px)] sm:max-h-[calc(100vh-260px)]" > 
              {/* MESSAGE AREA (MIDDLE COLUMN) */}
              <div className="space-y-4 flex flex-col mt-2 sm:mt-2">
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
                      
                    {msg.isFile ? (
                      <div className="w-full flex flex-col">
                        {/* File Preview */}
                        <div className="w-full h-auto mb-2">
                          <iframe
                            src={msg.text}
                            width="100%"
                            height="250px"
                            title="Uploaded File"
                            className="rounded-lg shadow-md mt-2"
                          ></iframe>
                        </div>
                        {/* File Info */}
                        <div className="flex items-center space-x-2 mt-2">
                          <div className="flex flex-col">
                            <span className="font-semibold text-sm">Document</span>
                            <span className="text-xs text-gray-500">report.pdf</span>
                          </div>
                          <div className="ml-auto flex space-x-2">
                            <button
                              onClick={() => window.open(msg.text, "_blank")}
                              className="bg-blue-500 text-white py-1 px-3 text-xs rounded-lg hover:bg-blue-600"
                            >
                              Open
                            </button>
                            <button
                              onClick={() => window.open(msg.text, "_blank")}
                              className="bg-gray-300 text-black py-1 px-3 text-xs rounded-lg hover:bg-gray-400"
                            >
                              Download
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text">{msg.text}</div> // Render regular text message
                    )}
                    </div>
                  </div>
                ))}
                {isTyping && <TypingIndicator />}
              </div>
              <div ref={messagesEndRef} />
            </div>
            {/* RIGHT COLUMN (ANALYZE AREA)*/}
            <div
              className={"col-span-1"}
              style={{ padding: "10px" }}>
            </div>
        </div>

        {/* BOTTOM ROW */}
        <div className="grid grid-cols-[1fr_3fr_1fr] gap-4 p-4 bottom-0">
          {/* LEFT COLUMN*/}
          <div className="col-span-1"></div>
          {/* MIDDLE COLUMN*/}
          <div 
              className="chat-container col-span-3 sm:col-span-1 flex items-center p-2 border border-[#171717] border-[2px] rounded-lg mb-1 bg-[#F2F2F2]" 
              style={{ borderRadius: "2rem", height: "90px" }}
            >
              <textarea
                ref={inputRef}
                placeholder="Message MedicalAI"
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
              <input
                type="file"
                ref={hiddenFileInput}
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
              <button
                    onClick={handleUpload}
                    className="p-2 rounded-full flex items-center justify-center"
                    style={{
                      height: "50px",
                      width: "50px",
                      backgroundColor: "#171717",
                      // background: "#EC4899",
                      // background: "#3E84F6",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                  <div style={{ marginTop: "0px" }}>
                <IoDocumentAttachOutline style={{ fontSize: "1.5rem", color: "#F2F2F2" }} />
                </div>
                  </button>
              
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
                      // background: "#3E84F6",
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
          </div>
        </div>

        <div className="text-center text-sm text-gray-400 mb-2">
            <p>Medical AI can make mistakes. Please check the accuracy of the information provided.</p>
        </div>
        </>
    </div>
)};

export default MedicalAI;
