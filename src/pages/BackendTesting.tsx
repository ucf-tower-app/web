import React from 'react';
import logo from '../logo.svg';
import '../App.css';
import { Page } from '../App';

import { createUser, getCurrentUser, getRouteById, getUrl, getUserByUsername, sendAuthEmail, signIn } from '../xplat/api'
import RouteDisplay from '../components/RouteDisplay';

const route = getRouteById("hF9CkVxiqytZ9BsaRGrW")

const BackendTesting = ({ setCurrentPage }: { setCurrentPage: (arg0: Page) => void; }) => {
  console.log("Render backend test")
  const [email, onChangeEmail] = React.useState("lkf53414@xcoxc.com");
  const [username, onChangeUsername] = React.useState("BinLiftingSux");
  const [password, onChangePassword] = React.useState("password");
  const [imgSrc, setImgSrc] = React.useState(logo);
  const [targUsername, setTargUsername] = React.useState("CringePotato49");

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
    const cur = await getCurrentUser();
    const other = await getUserByUsername(targUsername);
    
    await cur.followUser(other!);
    console.log(cur);
    console.log(other);
  }

  async function testGet() {
    const guy = await getUserByUsername(targUsername)
    await guy?.getData();
    console.log(guy)
  }

  async function getURL() {
    setImgSrc(await getUrl('avatars/climber.png'))
  }

  const _onChangeEmail = (evt: { target: { value: React.SetStateAction<string>; }; }) => { onChangeEmail(evt.target.value) }
  const _onChangeUsername = (evt: { target: { value: React.SetStateAction<string>; }; }) => { onChangeUsername(evt.target.value) }
  const _onChangePassword = (evt: { target: { value: React.SetStateAction<string>; }; }) => { onChangePassword(evt.target.value) }

  

  return (
    <div className="App">
      <header className="App-header">
        <img src={imgSrc} className="App-logo" alt="logo" />
        <input type="text" value={email} onChange={_onChangeEmail} />
        <input type="text" value={username} onChange={_onChangeUsername} />
        <input type="text" value={password} onChange={_onChangePassword} />
        <div className='hbox'>
          <button onClick={makeUser}>Make new user  </button>
          <button onClick={signin}>Sign in</button>
          <button onClick={sendAuthEmail}>Send Verify Email  </button>
          </div>
        <div className='hbox'>
          <input type="text" value={targUsername} onChange={(evt) => {setTargUsername(evt.target.value)}} />
          <button onClick={testGet}>Get</button>
          <button onClick={testFollow}>Follow</button>
        </div>
        <button onClick={getURL}>Get the URL </button>
        <RouteDisplay route={route}/>
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