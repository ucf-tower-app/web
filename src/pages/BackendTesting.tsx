import React from 'react';
import logo from '../logo.svg';
import '../App.css';
import { Page } from '../App';

import { createUser, getCurrentUser, getUserById, sendAuthEmail, signIn } from '../xplat/api'

const BackendTesting = ({ setCurrentPage }: { setCurrentPage: (arg0: Page) => void; }) => {
  const [email, onChangeEmail] = React.useState("email");
  const [username, onChangeUsername] = React.useState("username");
  const [password, onChangePassword] = React.useState("password");

  async function makeUser() {
    await createUser(email, password, username);
    console.log("done")
    console.log(await getCurrentUser())
  }
  
  async function signin() {
    await signIn(email, password);
    const user = await getCurrentUser();
    console.log(await user.getUsername());
    console.log(await user.getStatus());
  }

  async function testFollow() {
    const other = await getUserById("mKFX0DOUHsXGilrc0FeTsI61O3s1");
    const cur = await getCurrentUser();
    
    await cur.followUser(other);
    console.log(cur);
    console.log(other);
    
  }

  const _onChangeEmail = (evt: { target: { value: React.SetStateAction<string>; }; }) => { onChangeEmail(evt.target.value) }
  const _onChangeUsername = (evt: { target: { value: React.SetStateAction<string>; }; }) => { onChangeUsername(evt.target.value) }
  const _onChangePassword = (evt: { target: { value: React.SetStateAction<string>; }; }) => { onChangePassword(evt.target.value) }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <input type="text" value={email} onChange={_onChangeEmail} />
        <input type="text" value={username} onChange={_onChangeUsername} />
        <input type="text" value={password} onChange={_onChangePassword} />
        <button onClick={makeUser}>Make a user  </button>
        <button onClick={signin}>Sign in </button>
        <button onClick={sendAuthEmail}>Send the email  </button>
        <button onClick={testFollow}>Follow that one guy </button>
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