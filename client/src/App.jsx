
import './App.css'
import { Navigate, Route, Routes } from 'react-router-dom'
import Signup from './pages/Signup'
import Login from './pages/Login'
import Profile from './pages/Profile'
import ProtectedRoute from './components/ProtectedRoute'
import AdminDashboard from './pages/AdminDashboard'
import AdminLogin from './pages/adminLogin'
import EditUser from './pages/EditUser'
import CreateUser from './pages/createUser'



function App() {

  return (
    <>
      <Routes>
        
        <Route path='/signup' element={<Signup />}/>
        <Route path='/login' element={<Login />}/>
        <Route path='/admin' element={<AdminLogin />}/>
        
        <Route element={<ProtectedRoute />}>
          <Route path='/' element={<Profile />}/>
          <Route path='/admin/dashboard' element={<AdminDashboard />}/>
          <Route path='/admin/edit-user/:id' element={<EditUser />}/>
          <Route path='/admin/create-user' element={<CreateUser />}/>
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  )
}

export default App
