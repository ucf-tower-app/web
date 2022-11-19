import React from 'react';
import logo from '../logo.svg';
import '../App.css';
import { Page } from '../App';

import { getAuthUser, makeAuthUser, sendAuthEmail, signIn, testConnection } from '../xplat/api'

const BackendTesting = ({ setCurrentPage }: { setCurrentPage: (arg0: Page) => void; }) => {
  const [email, onChangeUsername] = React.useState("email");
  const [password, onChangePassword] = React.useState("password");

  const makeUser = () => {
    makeAuthUser(email, password)
    console.log("done")
    setCurrentPage(Page.BackendTesting);
  }

  const signin = () => {
    signIn(email, password)
  }

  const printuser = () => {
    console.log(getAuthUser())
  }

  const _onChangeUsername = (evt: { target: { value: React.SetStateAction<string>; }; }) => { onChangeUsername(evt.target.value) }
  const _onChangePassword = (evt: { target: { value: React.SetStateAction<string>; }; }) => { onChangePassword(evt.target.value) }


  const printhref = () => { console.log(window.location.href) }
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <button onClick={testConnection}>Test user get</button>
        <button onClick={printuser}>Print auth user</button>
        <input type="text" value={email} onChange={_onChangeUsername} />
        <input type="text" value={password} onChange={_onChangePassword} />
        <button onClick={makeUser}>Make a user  </button>
        <button onClick={signin}>Sign in </button>
        <button onClick={sendAuthEmail}>Send the email  </button>
        <button onClick={printhref}>Href?  </button>
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
}

export default BackendTesting;