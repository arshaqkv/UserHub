import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../utils/axiosInstance";


const initialState = {
    user: null,
    loading: false,
    error: null,
    message: null,
    success: false,
}



export const fetchUser = createAsyncThunk(
    'auth/fetchUser',
    async(_, thunkAPI) =>{
        try {
            const response = await axios.get('/api/auth/profile')
            return response.data    
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data.message);
        }
    }
)

export const signupUser = createAsyncThunk(
    'auth/signupUser',
    async(credentials, thunkAPI) =>{
        try {
            await axios.post('/api/auth/signup', credentials);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data.message);
        }
    }
)

export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async(credentials, thunkAPI) =>{
        try {
            const response = await axios.post('/api/auth/login', credentials);
            
            return response.data
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data.message);
        }
    }
)

export const logoutUser = createAsyncThunk(
    'auth/logoutUser',
    async(_, thunkAPI) =>{
        try {
            const response = await axios.post('/api/auth/logout')
            return response.data.message;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data.message);
        }
    }
)

export const updateProfilePicture = createAsyncThunk(
    'auth/updateProfilePicture',
    async(formData, thunkAPI) =>{
        try {
            const response = await axios.patch('/api/auth/update-profile', formData, {
                headers: {
                    "Content-Type": 'multipart/form-data'
                }
            })
            return response.data
        } catch (error) {
            console.log(error.response)
            return thunkAPI.rejectWithValue(error.response.data.message);
        }
    }
)




const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch Profile
            .addCase(fetchUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.success = action.payload.success
            })
            .addCase(fetchUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.success = action.payload.success
            })

            // Signup
            .addCase(signupUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(signupUser.fulfilled, (state, action) => {
                state.loading = false;
                state.message = action.payload;
            })
            .addCase(signupUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Login
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Logout
            .addCase(logoutUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(logoutUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = null;
                state.message = action.payload;
            })
            .addCase(logoutUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Update Profile Picture
            .addCase(updateProfilePicture.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateProfilePicture.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.message = action.payload.message;
            })
            .addCase(updateProfilePicture.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default authSlice.reducer;

