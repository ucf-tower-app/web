import {lazy, useEffect, useState} from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
// import { Redirect } from 'react-router';
import './App.css';
import Login from './pages/Login';
import Signup from './pages/Signup';
import PageNotFound from './pages/PageNotFound';
import AuthenticatedRoute from './utils/RequireAuth';


const ComponentTesting = lazy(() => import('./pages/ComponentTesting'));
const BackendTesting = lazy(() => import('./pages/BackendTesting'));
const RouteFeed = lazy(() => import('./pages/RouteFeed'));
const RoutesPage = lazy(() => import('./pages/Routes'));
const Profile = lazy(() => import('./pages/Profile'));

function App() {
  return (
    
    <Routes>
      <Route path='/' element={<Login/>}/>
      <Route path='/signup' element={<Signup/>}/>
      
      <Route path='/route' element={<RouteFeed/>}/>
      <Route path='/profile' element={<Profile/>}/>
      {window.location.hostname === 'localhost' &&
        <Route path='/backendtesting' element={<BackendTesting/>}/>}
      {window.location.hostname === 'localhost' &&
        <Route path='/component' element={<ComponentTesting/>}/>}
      <Route path='*' element={<PageNotFound/>}/>
    </Routes>
      
  );
}

export default App;
