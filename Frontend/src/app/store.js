import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import wishlistReducer from '../features/wishlist/wishlistSlice';
import drawingToolReducer from '../features/drawingTool/drawingToolSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        wishlist: wishlistReducer,
        drawingTool: drawingToolReducer,
    },
});
