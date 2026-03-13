import { createSlice } from '@reduxjs/toolkit';

// Helper: always recompute totals from items to prevent drift
const recalculate = (state) => {
    state.totalQuantity = state.items.reduce((sum, item) => sum + item.quantity, 0);
    state.totalAmount = state.items.reduce((sum, item) => sum + item.totalPrice, 0);
    localStorage.setItem('cart', JSON.stringify(state));
};

// Retrieve cart from local storage if available
const savedCart = localStorage.getItem('cart');
const initialState = savedCart ? JSON.parse(savedCart) : { items: [], totalQuantity: 0, totalAmount: 0 };

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart(state, action) {
            const newItem = action.payload;
            const existingItem = state.items.find(item => item.id === newItem.id);

            if (!existingItem) {
                state.items.push({
                    id: newItem.id,
                    title: newItem.title,
                    price: newItem.price,
                    quantity: newItem.quantity || 1,
                    totalPrice: newItem.price * (newItem.quantity || 1),
                    image: newItem.image,
                    category: newItem.category
                });
            } else {
                existingItem.quantity += newItem.quantity || 1;
                existingItem.totalPrice = existingItem.price * existingItem.quantity;
            }
            recalculate(state);
        },
        removeFromCart(state, action) {
            state.items = state.items.filter(item => item.id !== action.payload);
            recalculate(state);
        },
        updateQuantity(state, action) {
            const { id, quantity } = action.payload;
            const existingItem = state.items.find(item => item.id === id);
            if (existingItem && quantity >= 1) {
                existingItem.quantity = quantity;
                existingItem.totalPrice = existingItem.price * quantity;
            } else if (existingItem && quantity < 1) {
                state.items = state.items.filter(item => item.id !== id);
            }
            recalculate(state);
        },
        clearCart(state) {
            state.items = [];
            state.totalQuantity = 0;
            state.totalAmount = 0;
            localStorage.removeItem('cart');
        }
    }
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;

