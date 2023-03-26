import React, { useContext } from 'react';
import {AuthContext}from './AuthContext';
import {Navigate, Outlet} from 'react-router-dom';
import { UserStatus } from '../xplat/types';
import Loading from './Loading';
import { NavBar } from '../components/NavigationBar';

export default function ProtectedRoute({redirectTo}: 
  {redirectTo: string}){
   
  const authValue = useContext(AuthContext);
  if (authValue.waiting === false){
    if(authValue.user === null || authValue.user.status < UserStatus.Employee){
      return(<Navigate to={redirectTo}/>);
    }
    else{
      return(
        <>
          <NavBar />
          <Outlet/>
        </>
      );
    }
  }
  else{
    return <Loading/>;
  }
}