import { NativeBaseProvider } from 'native-base';
import { lazy, Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import theme from './components/NativeBaseStyling';
import './index.css';
import Login from './pages/Login';
import PageNotFound from './pages/PageNotFound';
import RequireAuth from './utils/RequireAuth';

const ComponentTesting = lazy(() => import('./pages/ComponentTesting'));
const BackendTesting = lazy(() => import('./pages/BackendTesting'));
const RoutesPage = lazy(() => import('./pages/Routes'));
const RouteView = lazy(() => import('./pages/RouteView'));
const RouteFeed = lazy(() => import('./pages/RouteFeed'));
const Signup = lazy(() => import('./pages/Signup'));
const Profile = lazy(() => import('./pages/Profile'));

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * (60 * 1000), // 5 mins
      cacheTime: 10 * (60 * 1000), // 10 mins
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
            <Route path='/' element={<Login />} />
            <Route path='/signup' element={<Signup />} />
            <Route element={<RequireAuth />}>
              <Route path='/routes' element={<RoutesPage />} />
              <Route path='/routeview' element={<RouteView />} />
              <Route path='/routefeed' element={<RouteFeed />} />
              <Route path='/profile' element={<Profile />} />
            </Route>

            {window.location.hostname === 'localhost' &&
              <Route path='/backendtesting' element={<BackendTesting />} />}
            {window.location.hostname === 'localhost' &&
              <Route path='/component' element={<ComponentTesting />} />}
            <Route path='*' element={<PageNotFound />} />
          </Routes>
        </BrowserRouter>
      </NativeBaseProvider>
    </Suspense>
  </QueryClientProvider>
);