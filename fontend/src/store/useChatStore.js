import toast from 'react-hot-toast'
import {create} from 'zustand'
import { axiosInsatnce } from '../utils/Axios'


export const useChatStore = create((set ,get) => ({
    messages : [],
    users : [],
    selectedUser : null,
    isUsersLoading : false,
    isMessagesLoading : false,

    // get user 
    getUser : async() => {
        set({isUsersLoading : true})
        try {
            const resp = await axiosInsatnce.get('/message/users')
            set({users : resp.data})
        } catch (error) {
            toast.error(error.response.data?.message)
        }finally{
            set({isUsersLoading: false})
        }
    },

    // get messages

    getMessages : async (userId) => {
        set({isMessagesLoading : true})
        try {
            const resp = await axiosInsatnce.get(`/message/${userId}`)
            set({messages : resp.data})
        } catch (error) {
            toast.error(error.response.data?.message)
        }finally{
            set({isMessagesLoading : false})
        }
    },

    // sending message
    sendMessage : async (messageData) =>{
        const {selectedUser ,messages} = get()
        console.log(selectedUser , "userID");
        
        try {
            const resp = await axiosInsatnce.post(`/message/send/${selectedUser._id}`,messageData)
            set({messages : [...messages, resp.data]})
        } catch (error) {
            toast.error(error.response.data?.message)
        }
    },



    // set selected user
    // optomise this one later
    setSelectedUser : (selectedUser) => set({selectedUser}),

 }))