import { NativeBaseProvider } from 'native-base';
import { lazy, Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import theme from './components/NativeBaseStyling';
import './index.css';
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