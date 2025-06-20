import { create } from 'zustand'
import { axiosInsatnce } from './../utils/Axios'
import toast from 'react-hot-toast';
import {io} from 'socket.io-client'



const BASE_URL = 'http://localhost:3000';


export const useAuthStore = create((set ,get) => ({
  authUser: null,
  isCheckingAuth: true,

  isSigningup: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  onlineUsers : [],
  socket : null,

  checkAuth: async () => {
    try {
      const response = await axiosInsatnce.get('/auth/check', {
        withCredentials: true,
      });
      // console.log(response.data);
      set({ authUser: response.data });
      get().connectionSocket()
    } catch (error) {
      console.log('Error checking auth', error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },


  // sign up
  signup : async(data) => {
    set({isSigningup : true})
    try {
        const resp = await axiosInsatnce.post('/auth/signup',data)
        set({authUser : resp.data})
        toast.success('Account created successFully')
        get().connectionSocket()
    } catch (error) {
        toast.error(error.response.data?.message || 'Failed to create account!')
    }finally{
        set({isSigningup : false})
    }
  },

  //logout 
  logout : async () => {
    try {
        await axiosInsatnce.post('auth/logout')
        set({authUser : null})
        toast.success("Logged out successfully")
        get().disconnectSocket()
    } catch (error) {
        toast.error(error.response.data?.message)
    }
  },

  // login 
  login : async (data) => {
    set({isLoggingIn : true})
    try {
        const resp = await axiosInsatnce.post('/auth/login',data)
        set({authUser : resp.data})
        toast.success("Logged in successfully")
        get().connectionSocket()
    } catch (error) {
        toast.error(error.response.data?.message || "Login Failed!")
        console.log("error from login " , error.message);
        
    }finally{
        set({isLoggingIn : false})
    }
  },

  // update profile
  updateProfile : async (data)=> {
    set({isUpdatingProfile : true})
    try {
      const resp = await axiosInsatnce.put('/auth/profile',data);
      set({authUser : resp.data})
      toast.success("Profile updated Successfully!")
    } catch (error) {
      console.log("Errorn in update profile" ,error);
      toast.error(error.response.data?.message || "Failed to update Profile!")
      
    }finally{
      set({isUpdatingProfile : false})
    }
  },

  connectionSocket : () => {
    const {authUser} = get()
    if (! authUser || get.socket?.connected) return;

    const socket = io(BASE_URL)
    socket.connect()
  },

  disconnectSocket : () => {}


}));
