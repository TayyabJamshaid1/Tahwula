import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SocketState {
  onlineUsers: string[];
}

const initialState: SocketState = {
  onlineUsers: [],
};

const socketSlice = createSlice({
  name: "socketSlice",
  initialState,
  reducers: {
    setOnlineUsers: (state, action: PayloadAction<string[]>) => {
      state.onlineUsers = action.payload;
    },
  },
});

export const { setOnlineUsers } = socketSlice.actions;
export default socketSlice.reducer;