import { create } from 'zustand'
import { axiosInsatnce } from './../utils/Axios'
import toast from 'react-hot-toast';

export const useAuthStore = create((set) => ({
  authUser: null,
  isCheckingAuth: true,

  isSigningup: false,
  isLoggingIn: false,
  isUpdatingProfile: false,

  checkAuth: async () => {
    try {
      const response = await axiosInsatnce.get('/auth/check', {
        withCredentials: true,
      });
      console.log(response.data);
      set({ authUser: response.data });
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
    } catch (error) {
        toast.error(error.response.data?.message)
    }
  },

  // login 
  login : async (data) => {
    set({isLoggingIn : true})
    try {
        const resp = await axiosInsatnce.post('auth/login',data)
        set({authUser : resp.data})
        toast.success("Logged in successfully")
    } catch (error) {
        toast.error(error.response.data?.message || "Login Failed!")
    }finally{
        set({isLoggingIn : false})
    }
  }
}));
