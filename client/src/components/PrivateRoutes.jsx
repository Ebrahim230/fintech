import React from 'react'
import { Navigate } from 'react-router-dom';

const PrivateRoutes = ({children, roles}) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if(!user){
    return <Navigate to='/login'/>
  }
  if(roles && !roles.includes(user.role)){
    return <Navigate to='/unauth-page'/>
  }
  return children;
}

export default PrivateRoutes;