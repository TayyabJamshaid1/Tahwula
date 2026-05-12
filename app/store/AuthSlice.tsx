import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  handleForgotPassword,
  handleLoginSubmit,
  handleLogout,
  handleresetPassword,
  registerUser,
} from "@/lib/AuthActions";
import { RegisterForm } from "@/app/(auth)/register/page";

export type User = {
  _id: string;
  email?: string;
  name?: string;
  avatar?: string;
  role?: "simpleUser" | "admin";
};

type AuthState = {
  authLoading: boolean;
  user: User | null;
  status: "idle" | "loading" | "authenticated" | "unauthenticated";
  error: string | null;
};

const initialState: AuthState = {
  authLoading: false,
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
  },
);

/* ---------------- LOGIN ---------------- */
export const loginThunk = createAsyncThunk(
  "auth/login",
  async (data: { email: string; password: string }, { rejectWithValue }) => {
    const res = await handleLoginSubmit(data);
    console.log(res, "ressss in slice");

    return res;
  },
);
/* ---------------- FORGOT PASSWORD ---------------- */
export const forgotPasswordThunk = createAsyncThunk(
  "auth/forgotPasswordThunk",
  async (data: { email: string }, { rejectWithValue }) => {
    try {
      const res = await handleForgotPassword(data);

      if (!res.success) {
        return rejectWithValue(res.message);
      }

      return res;
    } catch (error) {
      return rejectWithValue("Forgot password failed");
    }
  },
);
/* ---------------- RESET PASSWORD ---------------- */
export const resetPasswordThunk = createAsyncThunk(
  "auth/resetPassword",
  async (data: { token: string; password: string }, { rejectWithValue }) => {
    try {
      const res = await handleresetPassword(data);

      if (!res.success) {
        return rejectWithValue(res.message);
      }

      return res;
    } catch (error) {
      return rejectWithValue("Reset password failed");
    }
  },
);
/* ---------------- LOGOUT ---------------- */
export const logoutThunk = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    const res = await handleLogout();
    console.log(res, "resss");

    return res;
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthFromServer: (state, action) => {
      console.log(action.payload, "action.payl;oad");

      state.status = "authenticated";
      state.user = action.payload;
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
        state.authLoading = true;
        state.status = "loading";
        state.error = null;
      })
      .addCase(registerThunk.fulfilled, (state, action) => {
        state.authLoading = false;
        state.status = "authenticated";
        state.user = action.payload.user;
      })
      .addCase(registerThunk.rejected, (state, action) => {
        state.authLoading = false;
        state.status = "unauthenticated";
        state.error = action.payload as string;
      })

      /* LOGIN */
      .addCase(loginThunk.pending, (state) => {
        state.authLoading = true;
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.authLoading = false;
        state.status = "authenticated";
        state.user = action.payload.user;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.authLoading = false;
        state.status = "unauthenticated";
        state.error = action.payload as string;
      })
      .addCase(logoutThunk.pending, (state) => {
        state.authLoading = true;
        state.error = null;
      })
      /* FORGOT PASSWORD */
      .addCase(forgotPasswordThunk.pending, (state) => {
        state.authLoading = true;
        state.error = null;
      })
      .addCase(forgotPasswordThunk.fulfilled, (state) => {
        state.authLoading = false;
      })
      .addCase(forgotPasswordThunk.rejected, (state, action) => {
        state.authLoading = false;
        state.error = action.payload as string;
      })
      /* RESET PASSWORD */
      .addCase(resetPasswordThunk.pending, (state) => {
        state.authLoading = true;
        state.error = null;
      })
      .addCase(resetPasswordThunk.fulfilled, (state) => {
        state.authLoading = false;
      })
      .addCase(resetPasswordThunk.rejected, (state, action) => {
        state.authLoading = false;
        state.error = action.payload as string;
      })
      /* LOGOUT */
      .addCase(logoutThunk.fulfilled, (state) => {
        state.user = null;
        state.status = "unauthenticated";
        state.authLoading = false;
      })
      .addCase(logoutThunk.rejected, (state, action) => {
        state.authLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setAuthFromServer, clearAuth } = authSlice.actions;
export default authSlice.reducer;
