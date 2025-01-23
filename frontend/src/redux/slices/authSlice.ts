import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// export const login = createAsyncThunk('auth/login', async (params: { email: string; password: string }, thunkAPI) => {
//   try {
//     const { data } = await loginRequest(params.email, params.password);
//     if (data && data.token && data.data.user) {
//       localStorage.setItem('jwt_dodge', data.token);
//       return { accessToken: data.token, user: data.data.user };
//     } else {
//       thunkAPI.dispatch(setStatusMsg({ statusMsg: 'Something went wrong', msgIsError: true }));
//       return thunkAPI.rejectWithValue('');
//     }
//   } catch (error: any) {
//     if (error.response.data.message) {
//       thunkAPI.dispatch(
//         setStatusMsg({
//           statusMsg: error.response.data.message,
//           msgIsError: true,
//         }),
//       );
//     } else {
//       thunkAPI.dispatch(setStatusMsg({ statusMsg: 'Something went wrong', msgIsError: true }));
//     }
//     throw error;
//   }
// });
//
// export const forgotPassword = createAsyncThunk('auth/forgotPassword', async (params: { email: string }, thunkAPI) => {
//   try {
//     await forgotPasswordRequest(params.email);
//     thunkAPI.dispatch(setStatusMsg({ statusMsg: 'Check your email', msgIsError: false }));
//   } catch (error: any) {
//     if (error.response.data.message) {
//       thunkAPI.dispatch(
//         setStatusMsg({
//           statusMsg: error.response.data.message,
//           msgIsError: true,
//         }),
//       );
//     } else {
//       thunkAPI.dispatch(setStatusMsg({ statusMsg: 'Something went wrong', msgIsError: true }));
//     }
//     throw error;
//   }
// });
//
// export const resetPassword = createAsyncThunk(
//   'auth/resetPassword',
//   async (params: { token: string; password: string }, thunkAPI) => {
//     try {
//       await resetPasswordRequest(params.token, params.password);
//       thunkAPI.dispatch(setStatusMsg({ statusMsg: 'Your password has been reset', msgIsError: false }));
//     } catch (error: any) {
//       if (error.response.data.message) {
//         thunkAPI.dispatch(
//           setStatusMsg({
//             statusMsg: error.response.data.message,
//             msgIsError: true,
//           }),
//         );
//       } else {
//         thunkAPI.dispatch(setStatusMsg({ statusMsg: 'Something went wrong', msgIsError: true }));
//       }
//       throw error;
//     }
//   },
// );
//
// export const changePassword = createAsyncThunk(
//   'auth/changePassword',
//   async (params: { currentPassword: string; newPassword: string }, thunkAPI) => {
//     try {
//       await changePasswordRequest(params.currentPassword, params.newPassword);
//       thunkAPI.dispatch(setStatusMsg({ statusMsg: 'Your password has been changed', msgIsError: false }));
//     } catch (error: any) {
//       if (error.response.data.message) {
//         thunkAPI.dispatch(
//           setStatusMsg({
//             statusMsg: error.response.data.message,
//             msgIsError: true,
//           }),
//         );
//       } else {
//         thunkAPI.dispatch(setStatusMsg({ statusMsg: 'Something went wrong', msgIsError: true }));
//       }
//       throw error;
//     }
//   },
// );
//
// export const changeName = createAsyncThunk(
//   'auth/changeName',
//   async (params: { name: string; callback?: () => void }, thunkAPI) => {
//     try {
//       const { data } = await changeNamedRequest(params.name);
//       if (data && data.document) {
//         utilSetUser(data.document);
//       }
//       if (params.callback) params.callback();
//     } catch (error: any) {
//       if (error.response.data.message) {
//         thunkAPI.dispatch(
//           setStatusMsg({
//             statusMsg: error.response.data.message,
//             msgIsError: true,
//           }),
//         );
//       } else {
//         thunkAPI.dispatch(setStatusMsg({ statusMsg: 'Something went wrong', msgIsError: true }));
//       }
//       throw error;
//     }
//   },
// );
//
// export const sendFeedback = createAsyncThunk(
//   'auth/sendFeedback',
//   async (params: { content: string; callback?: () => void }, thunkAPI) => {
//     try {
//       const { data } = await sendFeedbackRequest(params.content);
//       if (data && data.document) {
//         utilSetUser(data.document);
//       }
//       if (params.callback) params.callback();
//     } catch (error: any) {
//       if (error.response.data.message) {
//         thunkAPI.dispatch(
//           setStatusMsg({
//             statusMsg: error.response.data.message,
//             msgIsError: true,
//           }),
//         );
//       } else {
//         thunkAPI.dispatch(setStatusMsg({ statusMsg: 'Something went wrong', msgIsError: true }));
//       }
//       throw error;
//     }
//   },
// );
//
// export const register = createAsyncThunk(
//   'auth/register',
//   async (
//     params: {
//       body: {
//         name: string;
//         email: string;
//         password: string;
//         passwordConfirm: string;
//       };
//       successCallback?: () => void;
//     },
//     thunkAPI,
//   ) => {
//     try {
//       await registerRequest(params.body);
//       if (params.successCallback) params.successCallback();
//     } catch (error: any) {
//       if (error.response.data.error.code && error.response.data.error.code === 11000) {
//         thunkAPI.dispatch(
//           setStatusMsg({
//             statusMsg: 'There is already an account with this email',
//             msgIsError: true,
//           }),
//         );
//         throw Error;
//       }
//       if (error.response.data.error.errors) {
//         const {
//           email = undefined,
//           password = undefined,
//           confirmPassword = undefined,
//         } = error.response.data.error.errors;
//
//         if (email) {
//           thunkAPI.dispatch(setStatusMsg({ statusMsg: email.message, msgIsError: true }));
//         } else if (password) {
//           thunkAPI.dispatch(setStatusMsg({ statusMsg: password.message, msgIsError: true }));
//         } else if (confirmPassword) {
//           thunkAPI.dispatch(
//             setStatusMsg({
//               statusMsg: confirmPassword.message,
//               msgIsError: true,
//             }),
//           );
//         } else {
//           thunkAPI.dispatch(setStatusMsg({ statusMsg: 'There was an error', msgIsError: true }));
//         }
//         throw Error;
//       } else {
//         thunkAPI.dispatch(setStatusMsg({ statusMsg: 'There was an error', msgIsError: true }));
//         throw Error;
//       }
//     }
//   },
// );
//
// export const logout = createAsyncThunk('auth/logout', async (_params, thunkAPI) => {
//   try {
//     localStorage.removeItem('jwt_dodge');
//     thunkAPI.dispatch({ type: 'STORE_RESET' });
//   } catch (error) {
//     throw error;
//   }
// });
//
// export const getMe = createAsyncThunk('auth/getMe', async (_params, thunkAPI) => {
//   try {
//     const { data } = await getMeRequest();
//     if (data && data.document) {
//       utilSetUser(data.document);
//     } else {
//       console.error('Something wrong with auth/getMe');
//       return thunkAPI.rejectWithValue('');
//     }
//   } catch (error) {
//     console.error(error);
//     throw error;
//   }
// });
//
// export const beatLevel = createAsyncThunk(
//   'auth/beatLevel',
//   async (params: { level: string; stars: number; unlockNext?: boolean; score?: number }, thunkAPI) => {
//     thunkAPI.dispatch(resetLastRun());
//     try {
//       const cypher = encryptObject(params, import.meta.env.VITE_CYPHER_KEY);
//       const { data } = await beatLevelRequest(cypher);
//       if (data && data.documents) {
//         utilSetUser(data.documents.user);
//         if (data.documents.lastRun) {
//           thunkAPI.dispatch(setLastRun(data.documents.lastRun));
//         }
//       } else {
//         console.error('Something wrong with auth/beatLevel');
//         return thunkAPI.rejectWithValue('');
//       }
//     } catch (error) {
//       console.error(error);
//       throw error;
//     }
//   },
// );
//
// export const unlockLevel = createAsyncThunk(
//   'auth/unlockLevel',
//   async (params: { unlockLevel: string; cost: number }, thunkAPI) => {
//     try {
//       const { data } = await unlockLevelRequest(params);
//       if (data && data.document) {
//         utilSetUser(data.document);
//       } else {
//         console.error('Something wrong with auth/unlockLevel');
//         return thunkAPI.rejectWithValue('');
//       }
//     } catch (error) {
//       console.error(error);
//       throw error;
//     }
//   },
// );
//
// export const unlockAugment = createAsyncThunk(
//   'auth/unlockAugment',
//   async (params: { augment: string; cost: number }, thunkAPI) => {
//     try {
//       const { data } = await unlockAugmentRequest(params);
//       if (data && data.document) {
//         utilSetUser(data.document);
//       } else {
//         console.error('Something wrong with auth/unlockAugment');
//         return thunkAPI.rejectWithValue('');
//       }
//     } catch (error) {
//       console.error(error);
//       throw error;
//     }
//   },
// );
//
// export const selectAugment = createAsyncThunk('auth/selectAugment', async (params: { augment: AUGMENTS }, thunkAPI) => {
//   try {
//     const { data } = await selectAugmentRequest(params);
//     console.log('selectAugment data', data);
//     if (data && data.document) {
//       utilSetUser(data.document);
//     } else {
//       console.error('Something wrong with auth/selectAugment');
//       return thunkAPI.rejectWithValue('');
//     }
//   } catch (error) {
//     console.error(error);
//     throw error;
//   }
// });

type User = {
  _id: string;
  email: string;
  name: string;
  feedbackSentAt: Date | null;
  stars: number;
};

type authSliceType = {
  accessToken: string | null;
  user: User;
  userIsLoading: boolean;
  meta: {
    loading: boolean;
    statusMsg: string;
    msgIsError: boolean;
    changePasswordIsLoading: boolean;
    changeNameIsLoading: boolean;
    sendFeedbackIsLoading: boolean;
    augmentIsLoading: boolean;
    levelIsLoading: boolean;
  };
};

const initialState: authSliceType = {
  accessToken: null,
  userIsLoading: false,
  user: {
    _id: '',
    email: '',
    name: '',
    feedbackSentAt: null,
    stars: 0,
  },
  meta: {
    loading: false,
    statusMsg: '',
    msgIsError: true,
    changePasswordIsLoading: false,
    changeNameIsLoading: false,
    sendFeedbackIsLoading: false,
    augmentIsLoading: false,
    levelIsLoading: false,
  },
};

// const loadingBuilder = (builder: any, thunk: any, metaField: string) => {
//   builder.addCase(thunk.fulfilled, (state: any) => {
//     state.meta[metaField] = false;
//   });
//   builder.addCase(thunk.pending, (state: any) => {
//     state.meta[metaField] = true;
//   });
//   builder.addCase(thunk.rejected, (state: any) => {
//     state.meta[metaField] = false;
//   });
// };

const authSlice = createSlice({
  name: 'auth',
  initialState: initialState,
  reducers: {
    setToken(state, action: PayloadAction<string | null>) {
      state.accessToken = action.payload;
    },
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
    },
    setStatusMsg(state, action: PayloadAction<{ statusMsg: string; msgIsError: boolean }>) {
      state.meta.statusMsg = action.payload.statusMsg;
      state.meta.msgIsError = action.payload.msgIsError;
    },
  },
});

export const { setToken, setStatusMsg, setUser } = authSlice.actions;
export default authSlice.reducer;
