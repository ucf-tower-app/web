import React from 'react';
import './App.css';
import BackendTesting from './pages/BackendTesting';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import RoutesPage from './pages/Routes';

export enum Page {
  LandingPage,
  BackendTesting,
  Login,
  RoutesPage
}

function App() {
  const [currentPage, setCurrentPage] = React.useState(Page.Login);

  switch (currentPage) {
  default:
  case Page.LandingPage:
    return <div className='App'> <LandingPage setCurrentPage={setCurrentPage} /> </div>;
  case Page.BackendTesting:
    return <div className='App'> <BackendTesting /> </div>;
  case Page.Login:
    return <div className='App'> <Login/></div>;
  case Page.RoutesPage:
    return <div className='App'> <RoutesPage/></div>;
  }

}

export default App;
