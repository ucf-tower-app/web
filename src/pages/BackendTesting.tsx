import React, { useState } from 'react';
import logo from '../logo.svg';
import '../App.css';
import { Page } from '../App';

import { createRoute, createUser, getCurrentUser, getRouteById, getUrl, getUserByUsername, sendAuthEmail, signIn } from '../xplat/api'
import RouteDisplay from '../components/RouteDisplay';

const BackendTesting = ({ setCurrentPage }: { setCurrentPage: (arg0: Page) => void; }) => {
  console.log("Render backend test")
  const [email, onChangeEmail] = useState("lkf53414@xcoxc.com");
  const [username, onChangeUsername] = useState("BinLiftingSux");
  const [password, onChangePassword] = useState("password");
  const [imgSrc, setImgSrc] = useState(logo);
  const [targUsername, setTargUsername] = useState("CringePotato49");
  const [route, setRoute] = useState(getRouteById("hF9CkVxiqytZ9BsaRGrW"))
  const [routeName, setRouteName] = useState('New Route')
  const [routeGrade, setRouteGrade] = useState('5.9')
  const [routeSetterUsername, setRouteSetterUsername] = useState('No Setter')

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

  async function testCreateRoute() {
    if (routeSetterUsername === 'No Setter')
      return setRoute(await createRoute(routeName, routeGrade))
    else return setRoute(await createRoute(routeName, routeGrade, await getUserByUsername(routeSetterUsername)))
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
        <div className='hbox'>
          <input type="text" value={routeName} onChange={(evt) => {setRouteName(evt.target.value)}} />
          <input type="text" value={routeGrade} onChange={(evt) => {setRouteGrade(evt.target.value)}} />
          <input type="text" value={routeSetterUsername} onChange={(evt) => {setRouteSetterUsername(evt.target.value)}} />
        
          <button onClick={testCreateRoute}>Create route</button>

        </div>
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