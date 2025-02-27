import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // Don't store socket object here
  isConnected: false
};

const socketSlice = createSlice({
    name:"socketio",
    initialState,
    reducers:{
        // actions
        setSocketConnected:(state,action) => {
            state.isConnected = action.payload;
        }
    }
});
export const {setSocketConnected} = socketSlice.actions;
export default socketSlice.reducer;