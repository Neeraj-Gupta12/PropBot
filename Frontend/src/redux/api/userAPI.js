import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: import.meta.env.VITE_BASE_URL,
    prepareHeaders:(Headers)=>{
      const token=localStorage.getItem('token');
      if(token){
        Headers.set('Authorization',`Bearer ${token}`);
      }
      return Headers;
    }
   }), 
  endpoints: (builder) => ({
    loginUser: builder.mutation({
      query: (credentials) => ({
        url: '/api/user/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    googleLogin: builder.mutation({
      query: ({ email, name, photo, firebaseToken }) => ({
        url: '/api/user/google',
        method: 'POST',
        body: { email, name, photo },
        headers: {
          Authorization: `Bearer ${firebaseToken}`,
        },
      }),
    }),
    
    registerUser: builder.mutation({
      query: (userData) => ({
        url: '/api/user/signup',
        method: 'POST',
        body: userData,
      }),
    }),
    updateUser: builder.mutation({
      query:(userData)=>({
        url:'/api/user/update',
        method:'POST',
        body: userData
      })
    }),
    logoutUser: builder.mutation({
      query: () => ({
        url: '/api/user/logout',
        method: 'POST',
      }),
    }),
    allUsers: builder.mutation({
      query: () => ({
        url: '/api/user/allUsers',
        method: 'GET',
      }),
    }),
    resetPassword: builder.mutation({
      query: ({ email, newPassword, confirmPassword }) => ({
        url: '/api/user/reset-password',
        method: 'POST',
        body: { email, newPassword, confirmPassword },
      }),
    })
  }),
});

export const { useLoginUserMutation, useRegisterUserMutation, useUpdateUserMutation,
  useLogoutUserMutation, useAllUsersMutation, useResetPasswordMutation, useGoogleLoginMutation } = userApi;
export { userApi };
