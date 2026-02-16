import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { handleLoginSubmit, handleLogout, registerUser } from "@/lib/AuthActions";
import { RegisterForm } from "@/app/(auth)/register/page";

export type user = {
  id?: string;
  email?: string;
  name?: string;
  role?: "simpleUser" | "admin";
};

type AuthState = {
  user: user | null;
  status: "idle" | "loading" | "authenticated" | "unauthenticated";
  error: string | null;
};

const initialState: AuthState = {
  user: null,
  status: "idle",
  error: null,
};

/* ---------------- REGISTER ---------------- */
export const registerThunk = createAsyncThunk(
  "auth/register",
  async (data: RegisterForm, { rejectWithValue }) => {
    const res = await registerUser(data);
    return res;
  }
);

/* ---------------- LOGIN ---------------- */
export const loginThunk = createAsyncThunk(
  "auth/login",
  async (
    data: { email: string; password: string },
    { rejectWithValue }
  ) => {
    const res = await handleLoginSubmit(data);
    console.log(res,"ressss in slice");

    return res;
  }
);

/* ---------------- LOGOUT ---------------- */
export const logoutThunk = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    const res = await handleLogout();
    console.log(res,"resss");
    
    return res;
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
 setAuthFromServer: (state, action) => {
    console.log(action.payload,'action.payl;oad');
    
  state.status = "authenticated"
  state.user = action.payload
},
    clearAuth(state) {
      state.user = null;
      state.status = "unauthenticated";
    },
  },
  extraReducers: (builder) => {
    builder
      /* REGISTER */
      .addCase(registerThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(registerThunk.fulfilled, (state, action) => {
        state.status = "authenticated";
        state.user =action.payload.user;
      })
      .addCase(registerThunk.rejected, (state, action) => {
        state.status = "unauthenticated";
        state.error = action.payload as string;
      })

      /* LOGIN */
      .addCase(loginThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.status = "authenticated";
        state.user =action.payload.user;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.status = "unauthenticated";
        state.error = action.payload as string;
      })

      /* LOGOUT */
      .addCase(logoutThunk.fulfilled, (state) => {
        state.user = null;
        state.status = "unauthenticated";
      });
  },
});

export const { setAuthFromServer, clearAuth } = authSlice.actions;
export default authSlice.reducer;
