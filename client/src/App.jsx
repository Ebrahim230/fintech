import React from 'react'
import { Route, Routes } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import Home from './pages/Home';
import UnAuth from './pages/UnAuth';
import PrivateRoutes from './components/PrivateRoutes';
import AdminLayout from './components/AdminLayout';
import CreateAccount from './pages/createAccount'
import UpdateAccount from './pages/UpdateAccount';
import AccountDetailsPage from './pages/AccountDetails';
const App = () => {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/register' element={<Register />} />
      <Route path='/login' element={<Login />} />
      <Route path='/user-dashboard' element={
        <PrivateRoutes roles={['user']}>
          <UserDashboard />
        </PrivateRoutes>
      } />
      <Route path='/admin' element={<AdminLayout />}>
        <Route path='dashboard' element={
          <PrivateRoutes roles={['admin']}>
            <AdminDashboard />
          </PrivateRoutes>
        } />
        <Route path='accounts/create' element={<PrivateRoutes roles={['admin']}>
          <CreateAccount/>
        </PrivateRoutes>}/>
        <Route path='accounts/update/:id' element={
          <PrivateRoutes roles={['admin']}>
            <UpdateAccount/>
          </PrivateRoutes>
        }/>
        <Route path='accounts/:id' element={
          <PrivateRoutes roles={['admin']}>
            <AccountDetailsPage/>
          </PrivateRoutes>
        }/>
      </Route>
      <Route path='/unauth-page' element={<UnAuth />} />
    </Routes>
  )
}

export default App;