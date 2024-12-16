import { createSlice, createAsyncThunk, isFulfilled, isRejected } from '@reduxjs/toolkit';
import axios from 'axios'
import { MdOutlineTipsAndUpdates } from "react-icons/md";
import { toast } from 'react-toastify';

// const url = "https://153c-219-91-220-88.ngrok-free.app"
// const url2 = "http://localhost:5003"
const url = "https://verdictengine.gradscaler.com"
const initialState = {
  messages: [],
  isTyping: false,
  currentSessionId: JSON.parse(localStorage.getItem("currentSessionId")) || null,
  chatSessions: JSON.parse(localStorage.getItem("chatSessions")) || [],
  AnalyzedReport: null,
  PreviousMessageCount: null,
  AnalyzedMessageCount: null,
  ChatProgress: {
    isLoading: false,
    isFulfilled: false,
    isRejected: false,
    loading: false
  },
  AnalyzeProcess: {
    isLoading: false,
    isFulfilled: false,
    isRejected: false,
  },
  TipActivation: false,
  TipShown: false,
  pdfUrl: null
};

export const fetchStartMessage = createAsyncThunk(
    "chat/fetchStartMessage",
    async ({UserMessage}, thunkAPI) => {
        try {
            const sessionBody = {
                userId: thunkAPI.getState().auth.user.id,
                UserMessage
            }
            const createChatSession = await axios.post(`${url}/api/v1/chat/createSession`, sessionBody);
            // console.log(thunkAPI.getState().chat.currentSessionId)
            thunkAPI.dispatch(setCurrentSessionId(createChatSession.data.session.sessionId))
            localStorage.setItem("currentSessionId", JSON.stringify(createChatSession.data.session.sessionId));
            const currentChatSessions = thunkAPI.getState().chat.chatSessions;
            const updatedChatSessions = [createChatSession.data.session, ...currentChatSessions, ];
            thunkAPI.dispatch(setChatSessions(updatedChatSessions));
            // console.log(createChatSession)
            const aiBody = {
                sessionId: createChatSession.data.session.sessionId,
                userId: thunkAPI.getState().auth.user.id,
                Message: UserMessage
            }
            const response = await axios.post(`${url}/api/v1/test`, aiBody);
            console.log(response)
            return response.data
        } catch (error) {
            const errorMessage = error.response?.data?.Message || 'An error occurred';
            return thunkAPI.rejectWithValue({ message: errorMessage });
        }
    }
);

export const fetchMedicalAIStartMessage = createAsyncThunk(
    "chat/fetchStartMessage",
    async ({UserMessage}, thunkAPI) => {
        try {
            const sessionBody = {
                userId: thunkAPI.getState().auth.user.id,
                UserMessage
            }
            const createChatSession = await axios.post(`${url}/api/v1/MedicalAI/createSession`, sessionBody);
            // console.log(thunkAPI.getState().chat.currentSessionId)
            thunkAPI.dispatch(setCurrentSessionId(createChatSession.data.session.sessionId))
            localStorage.setItem("currentSessionId", JSON.stringify(createChatSession.data.session.sessionId));
            const currentChatSessions = thunkAPI.getState().chat.chatSessions;
            const updatedChatSessions = [createChatSession.data.session, ...currentChatSessions, ];
            thunkAPI.dispatch(setChatSessions(updatedChatSessions));
            // console.log(createChatSession)
            const aiBody = {
                sessionId: createChatSession.data.session.sessionId,
                userId: thunkAPI.getState().auth.user.id,
                Message: UserMessage
            }
            const response = await axios.post(`${url}/api/v1/MedicalAI/chat`, aiBody);
            console.log(response)
            return response.data
        } catch (error) {
            const errorMessage = error.response?.data?.Message || 'An error occurred';
            return thunkAPI.rejectWithValue({ message: errorMessage });
        }
    }
);
export const chatwithMedicalAI = createAsyncThunk(
    "chat/chatwithAI",
    async (params, thunkAPI) => {
        try {

            thunkAPI.dispatch(addMessage({ text: params, isUser: true }));
            // console.log(params, 'The user message is as follows')
            const aiBody = {
                sessionId: JSON.parse(localStorage.getItem("currentSessionId")) , 
                userId: thunkAPI.getState().auth.user.id,
                userMessage: params
            }
            const response = await axios.post(`${url}/api/v1/MedicalAI/chat`, aiBody);
            console.log(response.data)
            return response.data
        } catch (error) {
            const errorMessage = error.response?.data?.Message || 'An error occurred';
            return thunkAPI.rejectWithValue({ message: errorMessage });
        }
    }
)

export const uploadFile = createAsyncThunk(
    "chat/uploadFile", 
    async(params, thunkAPI) => {
        try {
            const file = params.file
            const sessionId = JSON.parse(localStorage.getItem("currentSessionId"))
            const userId = thunkAPI.getState().auth.user.id

            const formData = new FormData();
            formData.append("file", file);
            formData.append("sessionId", sessionId); // Add sessionId
            formData.append("userId", userId); 
            const response = await axios.post("http://localhost:5003/api/v1/MedicalAI/uploadFile", formData);
            // console.log(response, 'Response.data')
            return response.data;

        } catch (error) {
            console.error("Upload error:", error);
            return thunkAPI.rejectWithValue(error.message);
        }
})
export const analyzePDF = createAsyncThunk("chat/analyzePDF", async (params, thunkAPI) => {
    try {
        console.log(params, 'This is params')
        const aiBody = {
            sessionId: JSON.parse(localStorage.getItem("currentSessionId")) , 
            userId: thunkAPI.getState().auth.user.id,
            userMessage: params.url,
            isFile: params.isFile || false
        }
        const response = await axios.post(`${url}/api/v1/MedicalAI/chat`, aiBody);
        console.log(response.data)
        return response.data
    } catch (error) {
        const errorMessage = error.response?.data?.Message || 'An error occurred';
        return thunkAPI.rejectWithValue({ message: errorMessage });
    }
})
export const chatwithAI = createAsyncThunk(
    "chat/chatwithAI",
    async (params, thunkAPI) => {
        try {
            thunkAPI.dispatch(addMessage({ text: params, isUser: true }));
            // console.log(params, 'The user message is as follows')
            const aiBody = {
                sessionId: JSON.parse(localStorage.getItem("currentSessionId")) , 
                userId: thunkAPI.getState().auth.user.id,
                userMessage: params
            }
            const response = await axios.post(`${url}/api/v1/test`, aiBody);
            console.log(response.data)
            return response.data
        } catch (error) {
            const errorMessage = error.response?.data?.Message || 'An error occurred';
            return thunkAPI.rejectWithValue({ message: errorMessage });
        }
    }
)

export const analyseChat = createAsyncThunk(
    "chat/analyseChat",
    async (params, thunkAPI) => {
        try {
            // console.log('Hello there')
            const headers = {
                'Accept': 'application/json'
            }
            const analyseBody = {
                SessionId: JSON.parse(localStorage.getItem("currentSessionId")),
                userId: thunkAPI.getState().auth.user.id
            }
            // console.log(analyseBody)
            const response = await axios.post(`${url}/api/v1/chat/analyze`, analyseBody, {headers})
            console.log(response.data.text, 'this is the response')
            return response.data.text
        } catch (error) {
            const errorMessage = error.response?.data?.Message || 'An error occurred';
            return thunkAPI.rejectWithValue({ message: errorMessage });
        }
    }
)
export const loadChat = createAsyncThunk(
    "chat/loadChat",
    async (params, thunkAPI) => {
        try {
            const chatBody = {
                userId: thunkAPI.getState().auth.user.id,
                SessionId: params
            }
            console.log(params)
            thunkAPI.dispatch(setCurrentSessionId(params))
            const response = await axios.post(`${url}/api/v1/chat/retriveChat`, chatBody)
            return response.data
        } catch (error) {
            const errorMessage = error.response?.data?.Message || 'An error occurred';
            return thunkAPI.rejectWithValue({ message: errorMessage });
        }
    }
)
export const getTips = createAsyncThunk(
    "chat/getTips",
    async (params, thunkAPI) => {
        try {
            const headers = {
                'Accept': 'application/json'
            }
            const analyseBody = {
                SessionId: JSON.parse(localStorage.getItem("currentSessionId")),
                userId: thunkAPI.getState().auth.user.id
            }
            // console.log(analyseBody)
            const response = await axios.post(`${url}/api/v1/chat/tips`, analyseBody, {headers})
            console.log(response.data.text, 'this is the response')
            return response.data.text
        } catch (error) {
            const errorMessage = error.response?.data?.Message || 'An error occurred';
            return thunkAPI.rejectWithValue({ message: errorMessage });
        }
    }
)

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    // Adds a new message to the array
    addMessage: (state, action) => {
        state.messages.push(action.payload);
    },
    // Sets messages directly (for initial fetch)
    setMessages: (state, action) => {
        state.messages = action.payload; 
    },
    // Sets isTyping to true or false depending upon the API call
    setIsTyping: (state, action) => {
        state.isTyping = action.payload;
    },
    setCurrentSessionId: (state, action) => {
        state.currentSessionId = action.payload;
        localStorage.setItem("currentSessionId", JSON.stringify(action.payload));
    },
    setChatSessions: (state, action) => {
        state.chatSessions = action.payload; // Update chat sessions
    },
    clearMessages: (state) => {
        state.messages = [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(analyzePDF.pending, (state) => {
        state.isTyping = true
        state.PreviousMessageCount += 1
    });
    builder.addCase(analyzePDF.fulfilled, (state, { payload }) => {
        state.messages.push(payload)
        state.isTyping = false
        state.PreviousMessageCount += 1
    });
    builder.addCase(analyzePDF.rejected, (state, { payload }) => {
        state.isTyping = false
        console.log("Error fetching AI message")
    });

    builder.addCase(uploadFile.fulfilled, (state, {payload}) => {
        state.messages.push(payload);
        state.pdfUrl = payload.text
    })

    builder.addCase(fetchStartMessage.pending, (state) => {
        state.isTyping = true
    });
    builder.addCase(fetchStartMessage.fulfilled, (state, {payload}) => {
        // console.log(payload.text, 'This is the response payload')
        state.messages.push(payload)
        state.isTyping = false
        state.PreviousMessageCount += 1
    });
    builder.addCase(fetchStartMessage.rejected, (state, { payload }) => {
        state.isTyping = false
        console.log("Error fetching AI message")
    });
    // chatwithAI Cases
    builder.addCase(chatwithAI.pending, (state) => {
        state.isTyping = true
        state.PreviousMessageCount += 1
    });
    builder.addCase(chatwithAI.fulfilled, (state, { payload }) => {
        state.messages.push(payload)
        state.isTyping = false
        state.PreviousMessageCount += 1
        // NEED TO DO THIS LATER ON FOR FLUENCY
        // localStorage.setItem("PreviousMessageCount", (parseInt(localStorage.getItem("PreviousMessageCount")) || 0) + 1);
        state.TipActivation = state.PreviousMessageCount % 20 === 0 && !state.TipShown;
        // state.TipActivation = true
    });
    builder.addCase(chatwithAI.rejected, (state, { payload }) => {
        state.isTyping = false
        console.log("Error fetching AI message")
    });
    builder.addCase(analyseChat.pending, (state) => {
        state.AnalyzeProcess.isLoading = true
        state.AnalyzeProcess.isFulfilled = false
        state.AnalyzeProcess.isRejected = false
    })
    builder.addCase(analyseChat.fulfilled, (state, {payload}) => {
        state.AnalyzeProcess.isLoading = false
        state.AnalyzeProcess.isFulfilled = true
        state.AnalyzedReport = payload
        state.AnalyzedMessageCount = state.PreviousMessageCount
    })
    builder.addCase(analyseChat.rejected, (state, {payload}) => {
        state.AnalyzeProcess.isLoading = false
        state.AnalyzeProcess.isRejected = true
    })

    builder.addCase(loadChat.pending, (state) => {
        state.ChatProgress.loading = true
        state.ChatProgress.isLoading = true
        state.ChatProgress.isFulfilled = false
        state.ChatProgress.isRejected = false
        state.AnalyzedReport = ""
    })
    builder.addCase(loadChat.fulfilled, (state, {payload}) => {
        console.log(payload)
        state.ChatProgress.loading = false
        state.ChatProgress.isLoading = false
        state.ChatProgress.isFulfilled = true
        const newMessages = payload.chats.map(chat => ({
            text: chat.text,
            isUser: chat.isUser,
            isFile: chat.isFile
        }));
        state.messages = newMessages;
        
    })
    builder.addCase(loadChat.rejected, (state, {payload}) => {
        state.ChatProgress.loading = false
        state.ChatProgress.isLoading = false
        state.ChatProgress.isRejected = true
    })
    builder.addCase(getTips.pending, (state) => {})
    builder.addCase(getTips.fulfilled, (state, {payload}) => {
        console.log(payload)
        state.TipActivation = false
        toast.info(payload, {
            position: "top-right",
            autoClose: 10000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "light",
            toastClassName: "custom-toast",
            icon: <MdOutlineTipsAndUpdates size={42} />
        });
    })
    builder.addCase(getTips.rejected, (state, {payload}) => {})
  }
});

export const { addMessage, setMessages, setIsTyping, setCurrentSessionId, setChatSessions, clearMessages } = chatSlice.actions;

export default chatSlice.reducer;
