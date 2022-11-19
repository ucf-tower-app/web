import React from 'react';
import './App.css';

import BackendTesting from './pages/BackendTesting';
import LandingPage from './pages/LandingPage';

export enum Page {
  LandingPage,
  BackendTesting,
}

function App() {
  const [currentPage, setCurrentPage] = React.useState(Page.LandingPage)

  switch (currentPage) {
    default:
    case Page.LandingPage:
      return <div className='App'> <LandingPage setCurrentPage={setCurrentPage} /> </div>
    case Page.BackendTesting:
      return <div className='App'> <BackendTesting setCurrentPage={setCurrentPage} /> </div>
  }
}

export default App;
