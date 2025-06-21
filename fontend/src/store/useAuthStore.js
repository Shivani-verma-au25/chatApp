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
      set({ authUser: response.data });
      get().connectionSocket()
    } catch (error) {
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
      toast.error(error.response.data?.message || "Failed to update Profile!")
      
    }finally{
      set({isUpdatingProfile : false})
    }
  },

  connectionSocket : () => {
    const {authUser} = get()
    if (! authUser || get.socket?.connected) return;

    const socket = io(BASE_URL, {
      query: {
        userId: authUser?.user?._id,
      },
    });
    // connected to the socket
    socket.connect()

    set({socket : socket});

    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },

  disconnectSocket : () => {
    if(get().socket?.connected)  get().socket.disconnect();
  },

}));
