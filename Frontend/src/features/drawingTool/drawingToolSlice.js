import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

export const fetchToolset = createAsyncThunk(
    'drawingTool/fetchToolset',
    async (_, thunkAPI) => {
        try {
            const response = await api.get('/tools');
            const data = response.data;
            if (data.success) {
                return data.data;
            }
            return thunkAPI.rejectWithValue(data.message || 'Failed to fetch tools');
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch tools');
        }
    }
);

export const updateToolPreference = createAsyncThunk(
    'drawingTool/updateToolPreference',
    async ({ toolId, payload }, thunkAPI) => {
        try {
            const response = await api.patch(`/tools/${toolId}`, payload);
            const data = response.data;
            if (data.success) {
                return { toolId, data: data.data };
            }
            return thunkAPI.rejectWithValue(data.message || 'Failed to update tool preferences');
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || error.message || 'Failed to update tool preferences');
        }
    }
);

const initialState = {
    loading: false,
    error: null,
    tools: [],
    activeTool: null,
};

const drawingToolSlice = createSlice({
    name: 'drawingTool',
    initialState,
    reducers: {
        setActiveTool: (state, action) => {
            state.activeTool = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchToolset.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchToolset.fulfilled, (state, action) => {
                state.loading = false;
                state.tools = action.payload;
                if (state.activeTool === null && action.payload.length > 0) {
                    state.activeTool = null;
                }
            })
            .addCase(fetchToolset.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message || 'Failed to fetch toolset';
            })
            .addCase(updateToolPreference.pending, (state) => {
                state.error = null;
            })
            .addCase(updateToolPreference.fulfilled, (state, action) => {
                const { toolId, data } = action.payload;
                const index = state.tools.findIndex((tool) => tool.tool === toolId);
                if (index >= 0) {
                    state.tools[index] = {
                        ...state.tools[index],
                        style: data.style,
                        options: data.options,
                    };
                }
            })
            .addCase(updateToolPreference.rejected, (state, action) => {
                state.error = action.payload || action.error.message || 'Failed to update tool preference';
            });
    },
});

export const { setActiveTool } = drawingToolSlice.actions;
export default drawingToolSlice.reducer;
