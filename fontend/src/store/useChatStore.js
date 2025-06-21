import toast from 'react-hot-toast'
import {create} from 'zustand'
import { axiosInsatnce } from '../utils/Axios'
import { useAuthStore } from './useAuthStore'


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
        
        try {
            const resp = await axiosInsatnce.post(`/message/send/${selectedUser._id}`,messageData)
            set({messages : [...messages, resp.data]})
        } catch (error) {
            toast.error(error.response.data?.message)
        }
    },

    // suscribe the messages
    subscribeToMessages : () =>{
        const {selectedUser} = get()
        if(!selectedUser) return ;

        const socket = useAuthStore.getState().socket;
        // todo : optimise this later
        socket.on("newMessage" ,(newMessage) =>{
            const isMessageSendFromSelectedUser =  newMessage.senderId === selectedUser._id;
            if(!isMessageSendFromSelectedUser) return;
            set(
                {messages : [...get().messages ,newMessage],}
            )
        })
    },


    unSubscribeMessages  :() =>{
        const socket = useAuthStore.getState().socket;
        socket.off("newMessage");

    },




    // set selected user
    setSelectedUser : (selectedUser) => set({selectedUser}),

 }))