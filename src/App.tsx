import React from 'react';
import './App.css';
import BackendTesting from './pages/BackendTesting';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Routes from './pages/Routes'

export enum Page {
  LandingPage,
  BackendTesting,
  Login,
  Routes
}

function App() {
  const [currentPage, setCurrentPage] = React.useState(Page.LandingPage)

  switch (currentPage) {
    default:
    case Page.LandingPage:
      return <div className='App'> <LandingPage setCurrentPage={setCurrentPage} /> </div>
    case Page.BackendTesting:
      return <div className='App'> <BackendTesting setCurrentPage={setCurrentPage} /> </div>
    case Page.Login:
      return <div className='App'> <Login setCurrentPage={setCurrentPage}/></div>
    case Page.Routes:
      return <div className='App'> <Routes setCurrentPage={setCurrentPage}/></div>
  }

}

export default App;
