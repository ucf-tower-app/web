import { NativeBaseProvider } from 'native-base';
import { lazy, Suspense } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import theme from './components/NativeBaseStyling';
import './index.css';
import Login from './pages/Login';
import PageNotFound from './pages/PageNotFound';
import FirebaseAuthContext from './utils/AuthContext';
import ProtectedRoute from './utils/ProtectedRoute';

const ComponentTesting = lazy(() => import('./pages/ComponentTesting'));
const Reports = lazy(() => import('./pages/Reports'));
const RoutesPage = lazy(() => import('./pages/Routes'));
const RouteView = lazy(() => import('./pages/RouteView'));
const RouteFeed = lazy(() => import('./pages/RouteFeed'));
// const Signup = lazy(() => import('./pages/Signup')); // we're not doing signup on web anymore, but it's subject to change.
const Profile = lazy(() => import('./pages/Profile'));

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * (60 * 1000), // 5 mins
      cacheTime: 10 * (60 * 1000), // 10 mins
    },
  },
});

const App = () => {

  return (
    <QueryClientProvider client={queryClient}>
      <Suspense>
        <NativeBaseProvider theme={theme}>
          <FirebaseAuthContext>
            <BrowserRouter>
              <Routes>
                <Route path='/' element={<Login />} />
                {/* <Route path='/signup' element={<Signup />} /> */}
                <Route path='/' element={<ProtectedRoute redirectTo='/' />}>
                  <Route path='/routes' element={<RoutesPage />} />
                  <Route path='/routeview' element={<RouteView />} />
                  <Route path='/routefeed' element={<RouteFeed />} />
                  <Route path='/profile' element={<Profile />} />
                  <Route path='/reports' element={<Reports />} />
                </Route>
                {window.location.hostname === 'localhost' &&
                  <Route path='/component' element={<ComponentTesting />} />}
                <Route path='*' element={<PageNotFound />} />
              </Routes>
            </BrowserRouter >
          </FirebaseAuthContext >
        </NativeBaseProvider >
      </Suspense >
    </QueryClientProvider >
  );
};

export default App;