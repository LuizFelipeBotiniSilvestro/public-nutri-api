import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import userService from "../services/userService";

const initialState = {
  user: {},
  error: false,
  success: false,
  loading: false,
  message: null,
};

// Get user details, for edit data
export const profile = createAsyncThunk(
  "user/profile",
  async (user, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;

      const data = await userService.profile(user, token);

      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue('Erro ao conectar com a API');
    }
  }
);

// Update user details
export const updateProfile = createAsyncThunk(
  "user/update",
  async (user, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;

      const data = await userService.updateProfile(user, token);

      // Check for errors
      if (data.errors) {
        return thunkAPI.rejectWithValue(data.errors[0]);
      }

      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue('Erro ao conectar com a API');
    }
  }
);

// Get user details
export const getUserDetails = createAsyncThunk(
  "user/get",
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;

      const data = await userService.getUserDetails(id, token);

      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue('Erro ao conectar com a API');
    }
  }
);

// Get all Nutritionist
export const getAllNutritionist = createAsyncThunk(
  "Nutritionist/getall",
  async (thunkAPI) => {
    try {
      const data = await userService.getAllNutritionist();

      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue('Erro ao conectar com a API');
    }
});

export const updateFollowers = createAsyncThunk(
  "user/updateFollow",
  async (nutritionistId, thunkAPI) => {
    try {
      const { _id, token } = thunkAPI.getState().auth.user;
      await userService.updateFollowers(_id, nutritionistId, token);
    } catch (error) {
      return thunkAPI.rejectWithValue('Erro ao conectar com a API');
    }
  }
);

export const acceptFollowers = createAsyncThunk(
  "user/acceptFollowers",
  async (userId, thunkAPI) => {
    try {
      const { _id, token } = thunkAPI.getState().auth.user;
      await userService.acceptFollowers(_id, userId, token);
    } catch (error) {
      return thunkAPI.rejectWithValue('Erro ao conectar com a API');
    }
  }
);

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    resetMessage: (state) => {
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(profile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(profile.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.user = action.payload;
      })
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.user = action.payload;
        state.message = "Usuário atualizado com sucesso!";
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.user = null;
      })
      .addCase(getUserDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.user = action.payload;
      })
      .addCase(getAllNutritionist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllNutritionist.fulfilled, (state, action) => {
        console.log(action.payload);
        state.loading = false;
        state.success = true;
        state.error = null;
        state.photo = action.payload;
      })
      .addCase(updateFollowers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateFollowers.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.message = "Seguidores atualizados com sucesso!";
      })
      .addCase(acceptFollowers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(acceptFollowers.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.message = "Seguidores atualizados com sucesso!";
      });
  },
});

export const { resetMessage } = userSlice.actions;
export default userSlice.reducer;
