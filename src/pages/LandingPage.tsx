import logo from '../logo.svg';
import '../App.css';
import { Page } from '../App';

const LandingPage = ({ setCurrentPage }: { setCurrentPage: (arg0: Page) => void; }) => {

  const backendOnLocalhost = () => {
    if (window.location.hostname === 'localhost') setCurrentPage(Page.BackendTesting);
    else console.log('Why did you even know to click this?');
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p onClick={backendOnLocalhost}>
                    Welcome to Tower! We, uh, dont have much for you to do here yet...
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
        </a>
      </header>
    </div>
  );
};

export default LandingPage;