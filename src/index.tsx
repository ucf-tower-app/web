import React, {lazy, Suspense} from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import { NativeBaseProvider } from 'native-base';
import './index.css';
import theme from './components/NativeBaseStyling';
import reportWebVitals from './reportWebVitals';
import Login from './pages/Login';
import PageNotFound from './pages/PageNotFound';

const BackendTesting = lazy(() => import('./pages/BackendTesting'));
const RouteFeed = lazy(() => import('./pages/RouteFeed'));
const RoutesPage = lazy(() => import('./pages/Routes'));
const Signup = lazy(() => import('./pages/Signup'));


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
    <Suspense>
        <NativeBaseProvider theme={theme}>
            <BrowserRouter>
                <Routes>
                    <Route path='/' element={<Login/>}/>
                    <Route path='/signup' element={<Signup/>}/>
                    <Route path='/routes' element={<RoutesPage/>}/>
                    <Route path='/route' element={<RouteFeed/>}/>
                    {window.location.hostname === 'localhost' && 
                      <Route path='/backendtesting' element={<BackendTesting/>}/>}
                    <Route path='*' element={<PageNotFound/>}/>
                </Routes>
            </BrowserRouter>
        </NativeBaseProvider>
    </Suspense>
);


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
