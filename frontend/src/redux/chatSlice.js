import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  messages: [],
  onlineUsers: [],
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    }
  }

});

export const { setMessages, setOnlineUsers } = chatSlice.actions;
export default chatSlice.reducer;