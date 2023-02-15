import React, { useContext } from 'react';
import {AuthContext}from './AuthContext';
import {Route, Navigate, Outlet} from 'react-router-dom';
import { UserStatus } from '../xplat/types';

export default function ProtectedRoute({redirectTo}: 
  {redirectTo: string}){
   
  const authValue = useContext(AuthContext);
  if (authValue.userDataPresent){
    if(authValue.user === null || authValue.user.status < UserStatus.Employee){
      return(<Navigate to={redirectTo}/>);
    }
    else{
      return(
        <Outlet/>
      );
    }
  }
  else{
    return <>No user is currently logged in</>;
  }
}