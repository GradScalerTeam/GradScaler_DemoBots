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

const GradScaler = () => {
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
      hello world
    </div>
  );
};

export default GradScaler;
