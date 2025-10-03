import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import adminReducer from './adminSlice';
import accountReducer from './accountSlice';

const store = configureStore({
    reducer:{
        auth: authReducer,
        adminAccounts: adminReducer,
        account: accountReducer
    },
    middleware:(getDefaultMiddleware)=> getDefaultMiddleware({
        thunk:true,
        serializableCheck: false
    })
})

export default store;