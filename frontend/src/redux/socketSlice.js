import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isConnected: false
};

const socketSlice = createSlice({
    name:"socketio",
    initialState,
    reducers:{
        setSocketConnected:(state,action) => {
            state.isConnected = action.payload;
        }
    }
});
export const {setSocketConnected} = socketSlice.actions;
export default socketSlice.reducer;