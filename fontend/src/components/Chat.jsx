import React, { useEffect, useRef } from 'react'
import {useChatStore}  from '../store/useChatStore'
import ChatHeader from './ChatHeader'
import MessageInput from './MessageInput'
import MessageSkeleton from './MessageSkeleton'
import { useAuthStore } from '../store/useAuthStore'

function Chat() {
  const  {messages, getMessages ,isMessagesLoading ,selectedUser,subscribeToMessages ,unSubscribeMessages} = useChatStore()
  const {authUser} = useAuthStore()
  const messageEndRef = useRef(null);

  
  
  useEffect(() => {
    if (selectedUser._id) {
      getMessages(selectedUser._id)
      subscribeToMessages()
    }

    return () => unSubscribeMessages();
    
  },[selectedUser._id ,getMessages ,unSubscribeMessages ,subscribeToMessages])


  useEffect(() => {
    if(messageEndRef.current){
      messageEndRef.current.scrollIntoView({behavior : "smooth"})
    }
  } ,[messages])

  if(isMessagesLoading) return (
    <div className='flex-1 flex flex-col overflow-auto'>
      <ChatHeader />
      <MessageSkeleton/>
      <MessageInput />
    </div>
  )
  
  
  
  return (
    <div className='flex flex-1 flex-col overflow-auto'>
      <ChatHeader />
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          
          <div
            key={msg._id}
           className={`chat ${msg.senderId === authUser.user?._id ? "chat-end" : "chat-start"}`} ref={messageEndRef} >
            <div className=" chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={
                    msg.senderId === authUser._id
                      ? authUser.profile || "/avatar.png"
                      : selectedUser.profile || "/avatar.png"
                  }
                  alt="profile pic"
                />
              </div>
            </div>
            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">
                {new Date(msg.createdAt).toLocaleTimeString()}
              </time>
            </div>
            <div className="chat-bubble flex flex-col">
              {msg.image && (
                <img
                  src={msg.image}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2"
                />
              )}
              {msg.text && <p>{msg.text}</p>}
            </div>
          </div>
          ))}
      </div>
      <MessageInput />
    </div>
  )
}

export default Chat