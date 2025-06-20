import React, { useEffect } from 'react'
import NavBar from './components/NavBar'
import {Routes,Route, Navigate} from 'react-router-dom'
import HomePage from './pages/HomePage'
import SignUpPage from './pages/SignUpPage'
import SettingPage from './pages/SettingPage'
import ProfilePage from './pages/ProfilePage'
import LoginPage from './pages/LoginPage'
import { useAuthStore } from './store/useAuthStore'
import { Loader } from 'lucide-react';
import {Toaster} from 'react-hot-toast'
import { useTheselector } from './store/useThemseclector'


function App() {
    const {authUser , checkAuth ,isCheckingAuth ,onlineUsers} = useAuthStore()
    const {theme} = useTheselector()
   
    useEffect(()=> {      
      checkAuth()
    },[checkAuth])


  // if (isCheckingAuth && !authUser) return (
  if (isCheckingAuth && !authUser) return (
    <div className='flex items-center justify-center h-screen'>
      <Loader  className='size-10 animate-spin'/>
    </div>
  )
  
  return (
    <div className="" data-theme= {theme}>
      <NavBar/>

      <Routes>
        <Route path='/' element={ authUser ? <HomePage /> : <Navigate to={'/login'} />}/>
        <Route path='/signup' element={!authUser ?  <SignUpPage /> :<Navigate to={'/'} /> }/>
        <Route path='/login' element={!authUser ? < LoginPage/> : <Navigate  to={'/'}/> }/>
        <Route path='/settings' element={<SettingPage />}/>
        <Route path='/profile' element={ authUser ?  <ProfilePage /> : <Navigate to={'/login'} /> }/>
      </Routes>
      <Toaster />
    </div>
  )
}

export default App