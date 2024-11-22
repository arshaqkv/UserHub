import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../utils/axiosInstance";

const initialState = {
    admin: null,
    users: [],
    userDetails: null, // For individual user data (e.g., edit user)
    loading: false,
    error: null,
    message: null,
    success: false,
};

// Admin Login
export const adminLogin = createAsyncThunk(
    "admin/adminLogin",
    async (credentials, thunkAPI) => {
        try {
            const response = await axios.post("/admin", credentials);
            return response.data;

        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Something went wrong"
            );
        }
    }
);

// Fetch All Users
export const fetchAllUsers = createAsyncThunk(
    "admin/fetchAllUsers",
    async (_, thunkAPI) => {
        try {
            const response = await axios.get("/admin/dashboard");
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Something went wrong"
            );
        }
    }
);

// Fetch User Details (for editing)
export const fetchUserDetails = createAsyncThunk(
    "admin/fetchUserDetails",
    async (id, thunkAPI) => {
        try {
            const response = await axios.get(`/admin/edit-user/${id}`);
            return response.data.user;
           
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Something went wrong"
            );
        }
    }
);

//Add new User
export const createUser = createAsyncThunk(
    "admin/createUser",
    async(userData, thunkAPI) =>{
        try {
            console.log(userData)
            const response = await axios.post('/admin/add-user', userData)
            console.log(response.data)
            return response.data
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || "Something went wrong")
        }
    }
)

// Update User
export const updateUser = createAsyncThunk(
    "admin/updateUser",
    async ({ id, userData }, thunkAPI) => {
        try {
            const response = await axios.put(`/admin/edit-user/${id}`, userData, {
                headers: {
                    "Content-Type": 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Something went wrong"
            );
        }
    }
);

// Delete User
export const deleteUser = createAsyncThunk(
    "admin/deleteUser",
    async (id, thunkAPI) => {
        try {
            await axios.delete(`/admin/delete-user/${id}`);
            return id;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Something went wrong"
            );
        }
    }
);

const adminSlice = createSlice({
    name: "admin",
    initialState,
    reducers: {
        // Add any synchronous actions here if needed
        clearMessage: (state) => {
            state.message = null;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Admin Login
            .addCase(adminLogin.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(adminLogin.fulfilled, (state, action) => {
                state.loading = false;
                state.admin = action.payload.admin;
                state.message = action.payload.message
            })
            .addCase(adminLogin.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Fetch All Users
            .addCase(fetchAllUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.users = action.payload.users;
                state.success = action.payload.success
            })
            .addCase(fetchAllUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Fetch User Details
            .addCase(fetchUserDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.userDetails = action.payload;
            })
            .addCase(fetchUserDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            //Add new User
            .addCase(createUser.pending, (state) =>{
                state.loading = true
                state.error = null
            })
            .addCase(createUser.fulfilled, (state) =>{
                state.loading = false
            })
            .addCase(createUser.rejected, (state, action) =>{
                state.loading = false
                state.error = action.payload
            })

            // Update User
            .addCase(updateUser.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.message = null;
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                state.loading = false;
                state.message = action.payload.message;
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Delete User
            .addCase(deleteUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.loading = false;
                state.users = state.users.filter((user) => user._id !== action.payload);
                state.message = "User deleted successfully";
            })
            .addCase(deleteUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearMessage, clearError } = adminSlice.actions;
export default adminSlice.reducer;
