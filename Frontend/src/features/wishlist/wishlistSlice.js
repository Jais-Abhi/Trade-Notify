import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

// Async Thunks
export const fetchWishlist = createAsyncThunk(
    'wishlist/fetchWishlist',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await api.get('/wishlist');
            if (data.success) {
                return data.data;
            }
            return rejectWithValue(data.message);
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch wishlist');
        }
    }
);

export const addToWishlist = createAsyncThunk(
    'wishlist/addToWishlist',
    async (stock, { rejectWithValue }) => {
        try {
            const { data } = await api.post('/wishlist', stock);
            if (data.success) {
                return data.data;
            }
            return rejectWithValue(data.message);
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to add stock');
        }
    }
);

export const removeFromWishlist = createAsyncThunk(
    'wishlist/removeFromWishlist',
    async (symbol, { rejectWithValue }) => {
        try {
            const { data } = await api.delete(`/wishlist/${symbol}`);
            if (data.success) {
                return data.data;
            }
            return rejectWithValue(data.message);
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to remove stock');
        }
    }
);

const initialState = {
    items: [],
    loading: false,
    error: null,
};

const wishlistSlice = createSlice({
    name: 'wishlist',
    initialState,
    reducers: {
        clearWishlistError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch Wishlist
            .addCase(fetchWishlist.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchWishlist.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchWishlist.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            
            // Add to Wishlist
            .addCase(addToWishlist.pending, (state) => {
                state.error = null;
            })
            .addCase(addToWishlist.fulfilled, (state, action) => {
                state.items = action.payload;
            })
            .addCase(addToWishlist.rejected, (state, action) => {
                state.error = action.payload;
            })
            
            // Remove from Wishlist
            .addCase(removeFromWishlist.fulfilled, (state, action) => {
                state.items = action.payload;
            })
            .addCase(removeFromWishlist.rejected, (state, action) => {
                state.error = action.payload;
            });
    },
});

export const { clearWishlistError } = wishlistSlice.actions;
export default wishlistSlice.reducer;
