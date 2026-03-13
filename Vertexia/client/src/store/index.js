import { configureStore, createSlice } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';
import ordersReducer from './ordersSlice';

const savedAuth = localStorage.getItem('auth');
const initialAuthState = savedAuth ? JSON.parse(savedAuth) : {
    user: null,
    isAuthenticated: false,
    loading: false,
};

// Basic Auth Slice Setup
const authSlice = createSlice({
    name: 'auth',
    initialState: initialAuthState,
    reducers: {
        loginStart: (state) => { state.loading = true; },
        loginSuccess: (state, action) => {
            state.loading = false;
            state.user = action.payload;
            state.isAuthenticated = true;
            localStorage.setItem('auth', JSON.stringify(state));
        },
        loginFailure: (state) => {
            state.loading = false;
            state.user = null;
            state.isAuthenticated = false;
            localStorage.removeItem('auth');
        },
        logout: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            localStorage.removeItem('auth');
        }
    }
});

export const { loginStart, loginSuccess, loginFailure, logout } = authSlice.actions;

export const store = configureStore({
    reducer: {
        auth: authSlice.reducer,
        cart: cartReducer,
        orders: ordersReducer,
    },
});
