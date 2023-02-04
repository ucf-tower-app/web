import { NativeBaseProvider } from 'native-base';
import { lazy, Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import theme from './components/NativeBaseStyling';
import './index.css';
import Login from './pages/Login';
import PageNotFound from './pages/PageNotFound';

const ComponentTesting = lazy(() => import('./pages/ComponentTesting'));
const BackendTesting = lazy(() => import('./pages/BackendTesting'));
const RouteFeed = lazy(() => import('./pages/RouteFeed'));
const RoutesPage = lazy(() => import('./pages/Routes'));
const Signup = lazy(() => import('./pages/Signup'));
const Profile = lazy(() => import('./pages/Profile'));

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5*(60*1000), // 5 mins
      cacheTime: 10*(60*1000), // 10 mins
    },
  },
});


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <QueryClientProvider client={queryClient}>
    <Suspense>
      <NativeBaseProvider theme={theme}>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Login/>}/>
            <Route path='/signup' element={<Signup/>}/>
            <Route path='/routes' element={<RoutesPage/>}/>
            <Route path='/route' element={<RouteFeed/>}/>
            <Route path='/profile' element={<Profile/>}/>
            {window.location.hostname === 'localhost' &&
                        <Route path='/backendtesting' element={<BackendTesting/>}/>}
            {window.location.hostname === 'localhost' &&
                        <Route path='/component' element={<ComponentTesting/>}/>}
            <Route path='*' element={<PageNotFound/>}/>
          </Routes>
        </BrowserRouter>
      </NativeBaseProvider>
    </Suspense>
  </QueryClientProvider>
);