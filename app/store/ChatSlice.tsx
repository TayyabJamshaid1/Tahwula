import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "./AuthSlice";
import { createGroupChat, createNewChat, FetchAllChats, MessagesByChatId, sendMessage } from "@/lib/ChatActions";

/*TYPES */
export interface Message {
  _id: string;
  chatId: string;
  sender: string;
  text?: string;
  image?: {
    url: string;
    publicId: string;
  };
  messageType: "text" | "image";
  seen: boolean;
  seenAt?: string;
  createdAt: string;
}
export interface Chat {
  _id: string;
  users: string[];
  latestMessage?: {
    text: string;
    sender: string;
  };
  createdAt: string;
  updatedAt: string;
  unseenCount?: number;
}
export interface Chats {
  _id: string;
  user?: User;
  chat?: Chat;
}

type ChatState = {
  chatLoading: boolean;
  chats: Chats[];
  messages: Message[];
  error: string | null;
  selectedChatUser: User | null;
};

/*INITIAL STATE*/
const initialState: ChatState = {
  chatLoading: false,
  chats: [],
  messages: [],
  selectedChatUser: null,
  error: null,
};

/*ASYNC THUNKS */

export const fetchAllChatsThunk = createAsyncThunk(
  "chat/fetchAllChats",

  async (_, thunkAPI) => {
    try {
      const response = await FetchAllChats();

      if (!response.success) {
        return thunkAPI.rejectWithValue(response.message);
      }

      return response.users;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message || "Failed to fetch chats");
    }
  },
);

export const createNewChatThunk = createAsyncThunk(
  "chat/createNewChat",

  async (otherUserId: string, thunkAPI) => {
    try {
      const response = await createNewChat(otherUserId);

      if (!response.success) {
        return thunkAPI.rejectWithValue(response.message);
      }

      return response;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message || "Failed to create chat");
    }
  },
);
export const fetchChatMessagesThunk = createAsyncThunk(
  "chat/fetchChatMessages",

  async (chatId: string, thunkAPI) => {
    try {
      const response = await MessagesByChatId(chatId);

      if (!response.success) {
        return thunkAPI.rejectWithValue(response.message);
      }

      return response;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message || "Failed to create chat");
    }
  },
);

export const sendMessageThunk = createAsyncThunk(
  "chat/sendMessage",

  async (  formData: FormData, thunkAPI) => {
    try {
      const response = await sendMessage(formData);

      if (!response.success) {
        return thunkAPI.rejectWithValue(response.message);
      }

      return response;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message || "Failed to create chat");
    }
  },
);
/** Group Chat Thunks */
export const createGroupChatThunk = createAsyncThunk(
  "chat/createGroupChat",
  async (
    payload: {
      groupName: string;
      members: string[];
    },
    thunkAPI,
  ) => {
    try {
      const response = await createGroupChat(
        payload.groupName,
        payload.members,
      );

      if (!response.success) {
        return thunkAPI.rejectWithValue(response.message);
      }

      return response;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.message || "Failed to create group",
      );
    }
  },
);
/*  COMMON STATES*/
const pendingState = (state: ChatState) => {
  state.chatLoading = true;
  state.error = null;
};

const rejectedState = (state: ChatState, action: PayloadAction<any>) => {
  state.chatLoading = false;
  state.error = action.payload;
};

/*SLICE */
const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    /* SET ALL MESSAGES */
    setMessages: (state, action: PayloadAction<Message[]>) => {
      state.messages = action.payload;
    },
    /* ADD SINGLE MESSAGE */
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
    },
    /* CLEAR MESSAGES */
    clearMessages: (state) => {
      state.messages = [];
    },
  },

  extraReducers: (builder) => {
    builder
      /*FETCH ALL CHATS*/
      .addCase(fetchAllChatsThunk.pending, pendingState)
      .addCase(fetchAllChatsThunk.fulfilled, (state, action) => {
        state.chatLoading = false;
        state.chats = action.payload;
      })
      .addCase(fetchAllChatsThunk.rejected, rejectedState)

      /* CREATE NEW CHAT*/
      .addCase(createNewChatThunk.pending, pendingState)
      .addCase(createNewChatThunk.fulfilled, (state) => {
        state.chatLoading = false;
      })
      .addCase(createNewChatThunk.rejected, rejectedState)
       .addCase(fetchChatMessagesThunk.pending, pendingState)
      .addCase(fetchChatMessagesThunk.fulfilled, (state, action) => {
        state.chatLoading = false;
        state.messages = action.payload.messages;
        state.selectedChatUser = action.payload.selectedChatUser;
      })
      .addCase(fetchChatMessagesThunk.rejected, rejectedState);
  },
});

/* EXPORTS*/
export const { setMessages, addMessage, clearMessages } = chatSlice.actions;

export default chatSlice.reducer;
