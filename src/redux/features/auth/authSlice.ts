import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type TUserRole = "user" | "admin";

export type TAuthState = {
  id: string | null;
  name: string | null;
  email: string | null;
  role: TUserRole | null;
  interests: string[];
  token: string | null;
};

const initialState: TAuthState = {
  id: null,
  name: null,
  email: null,
  role: null,
  interests: [],
  token: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (
      state,
      action: PayloadAction<{
        id?: string;
        name?: string;
        email?: string;
        role?: TUserRole;
        interests?: string[];
        token: string;
      }>
    ) => {
      const { id, name, email, role, interests, token } = action.payload;
      state.id = id || null;
      state.name = name || null;
      state.email = email || null;
      state.role = role || null;
      state.interests = interests || [];
      state.token = token;
    },
    logout: (state) => {
      state.id = null;
      state.name = null;
      state.email = null;
      state.role = null;
      state.interests = [];
      state.token = null;
    },
    setToken: (state, action: PayloadAction<string | null>) => {
      state.token = action.payload;
    },
  },
});

export const { login, logout, setToken } = authSlice.actions;
export default authSlice.reducer;

