import { createSlice } from '@reduxjs/toolkit';

const savedOrders = localStorage.getItem('orders');
const initialState = {
    orders: savedOrders ? JSON.parse(savedOrders) : [],
};

const ordersSlice = createSlice({
    name: 'orders',
    initialState,
    reducers: {
        placeOrder(state, action) {
            // action.payload: { items, totalAmount, shippingFee, paymentMethod }
            const order = {
                id: `ORD-${Date.now()}`,
                placedAt: new Date().toISOString(),
                status: 'Processing',
                items: action.payload.items,
                totalAmount: action.payload.totalAmount,
                shippingFee: action.payload.shippingFee ?? 0,
                paymentMethod: action.payload.paymentMethod ?? 'card',
            };
            state.orders.unshift(order); // newest first
            localStorage.setItem('orders', JSON.stringify(state.orders));
        },
        clearOrders(state) {
            state.orders = [];
            localStorage.removeItem('orders');
        },
    },
});

export const { placeOrder, clearOrders } = ordersSlice.actions;
export default ordersSlice.reducer;
