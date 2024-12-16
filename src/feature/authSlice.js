import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { setChatSessions } from "./chatSlice";
// const url = "https://153c-219-91-220-88.ngrok-free.app"
const url = "https://verdictengine.gradscaler.com"
const initialState = {
    user: JSON.parse(localStorage.getItem("user")) || null,
    loading: false,
    error: null,
    userEmail: null,
  };

export const loginUser = createAsyncThunk(
    "auth/login",
    async ({ email, password }, thunkAPI) => {
      try {
        const response = await axios.post(`${url}/api/v1/login/loginUser`, {
          email_address: email,
          password,
        });
        thunkAPI.dispatch(setChatSessions(response.data.UserData.Sessions))
        console.log(response.data.UserData, 'Recording Session')
        localStorage.setItem("chatSessions", JSON.stringify(response.data.UserData.Sessions));
        console.log(response.data.UserData.Sessions)
        return response.data.UserData
      } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);
      }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers:{},
    extraReducers: (builder) => {
        builder
          .addCase(loginUser.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
          .addCase(loginUser.fulfilled, (state, action) => {
            console.log(action)
            state.loading = false;
            state.user = action.payload;
            localStorage.setItem("user", JSON.stringify(action.payload));
          })
          .addCase(loginUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
          })
    }
})

export default authSlice.reducer;