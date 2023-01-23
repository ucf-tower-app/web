/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import '../App.css';
import logo from '../logo.svg';

import RouteDisplay from '../components/backend/RouteDisplay';
import { createPost, createUser, getActiveRoutesCursor, getAllPostsCursor, getAllRoutesCursor, getAllTopropeRouteClassifiers, getCurrentUser, getRouteById, getSendById, getUserByUsername, sendAuthEmail, signIn } from '../xplat/api';
import { getTestMergePostsCursor } from '../xplat/types/queryCursors';

const BackendTesting = () => {
    const [email, onChangeEmail] = useState('lkf53414@xcoxc.com');
    const [username, onChangeUsername] = useState('BinLiftingSux');
    const [password, onChangePassword] = useState('password');
    const [imgSrc] = useState(logo);
    const [targUsername, setTargUsername] = useState('CringePotato49');
    const [route, setRoute] = useState(getRouteById('98sSTIj8FVYUaFGTQOR1'));
    const [routeName, setRouteName] = useState('New Route');
    const [routeGrade, setRouteGrade] = useState(3);
    const [routeType, setRouteType] = useState('Boulder');
    const [routeDescription, setRouteDescription] = useState('description');
    const [rope, setRope] = useState(-1);
    const [routeThumbnail, setRouteThumbnail] = useState<Blob | undefined>();
    const [routeSetterUsername, setRouteSetterUsername] = useState('No Setter');
    const [postText, setPostText] = useState('Hello there!');
    const [postImages, setPostImages] = useState<Blob[] | undefined>();
    const [postVideoThumbnail, setPostVideoThumbnail] = useState<Blob | undefined>(undefined);
    const [postVideo, setPostVideo] = useState<Blob | undefined>(undefined);
    const [allRoutesCursor] = useState(getAllRoutesCursor());
    const [activeRoutesCursor] = useState(getActiveRoutesCursor());
    const [postsCursor] = useState(getAllPostsCursor());
    const [mergeCursor] = useState(getTestMergePostsCursor());

    useEffect(() => {
        const go = async () => {
            console.log('shrt'.match('^[a-z]{5,15}$'));
            console.log('goldilocks'.match('^[a-z]{5,15}$'));
            console.log('waaaaaaaaaaaytoolong'.match('^[a-z]{5,15}$'));
            console.log('Uppercase'.match('^[a-z]{5,15}$'));
            console.log('Symbo$^ls!'.match('^[a-z]{5,15}$'));
            console.log('Sp aa ces'.match('^[a-z]{5,15}$'));
            console.log('trailspace '.match('^[a-z]{5,15}$'));


            const send = getSendById('p5PZ9j3JaH7Ry9dDYVWv');
            await send.getData();
            console.log(send);
            const prom = Promise.resolve('gaming');
            console.log(prom);
            console.log(getAllTopropeRouteClassifiers().map((c) => c.displayString));
        // console.log(getAllRouteClassifiers());
        };
        go();
    }, []);

    async function makeUser() {
        const cur = await createUser(email, password, username, 'Display Name');
        console.log('done');
        console.log(cur);
    }
  
    async function signin() {
        await signIn(email, password);
        const user = await getCurrentUser();
        await user.getData();
        console.log(user);
    }

    async function printcurrent() {
        const user = await getCurrentUser();
        await user.getData();
        console.log(user);
    }

    async function testFollow() {
        const cur = await getCurrentUser();
        const other = await getUserByUsername(targUsername);
    
        await cur.followUser(other!);
        console.log(cur);
        console.log(other);
    }

    async function testGet() {
        const guy = await getUserByUsername(targUsername);
        await guy?.getData();
        console.log(guy);
    }

    async function testCreateRoute() {
        // await setRoute(
        //     await createRoute({
        //         name: routeName, 
        //         classifier: new RouteClassifier(routeGrade, routeType as RouteType),
        //         ...(rope != -1 && {rope: rope}),
        //         ...(routeThumbnail && {thumbnail: routeThumbnail}),
        //         ...(routeSetterUsername && {setter: await getUserByUsername(routeSetterUsername) })
        //     }));
        console.log(route);
    }

    async function testCreatePost() {
        const post = await createPost(
            await getCurrentUser(), 
            postText, 
            await route.getForum(), 
            postImages, 
            postVideo && postVideoThumbnail && {video: postVideo!, thumbnail: postVideoThumbnail!}
        );
        await post.getData();
        setRoute(route);
        console.log(post);
    }

    const handleFilesSelected = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const files = Array.from(e.target.files!);
        if(files.length > 0) {
            console.log('Update postImage with ', files);
            setPostImages(files);
        }
        console.log('files:', files);
        console.log(postImages);
    };

    const deleteUser = async () => {
        const del = (await getCurrentUser()).delete(password);
        console.log(del);
        await del;
        console.log('It is done.');
    };

    const testGetAllPosts = async () => {
        const post = await postsCursor.pollNext();
        console.log(post);
    };

    const testGetMergePosts = async () => {
        const post = await mergeCursor.pollNext();
        console.log(post);
    };


    const _onChangeEmail = (evt: { target: { value: React.SetStateAction<string>; }; }) => { onChangeEmail(evt.target.value); };
    const _onChangeUsername = (evt: { target: { value: React.SetStateAction<string>; }; }) => { onChangeUsername(evt.target.value); };
    const _onChangePassword = (evt: { target: { value: React.SetStateAction<string>; }; }) => { onChangePassword(evt.target.value); };
  
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
                    <button onClick={printcurrent}>Print current user</button>
                    <button onClick={deleteUser}>Delete current user</button>
                </div>
                <div className='hbox'>
                    <input type="text" value={targUsername} onChange={(evt) => {setTargUsername(evt.target.value);}} />
                    <button onClick={testGet}>Get</button>
                    <button onClick={testFollow}>Follow</button>
                </div>
                {/* <div className='hbox'>
                    <button onClick={testGetAllPosts}>Get next post </button>
                    <button onClick={testGetMergePosts}>Get next merge post </button>
                    <button onClick={() => console.log(mergeCursor)}>Print merger </button>
                </div> */}
                <div className='hbox'>
                    <input style={{ width:'90px' }} type="text" value={routeName} onChange={(evt) => {setRouteName(evt.target.value);}} />
                    <input style={{ width:'90px' }} type="text" value={routeGrade} onChange={(evt) => {setRouteGrade(parseInt(evt.target.value));}} />
                    <input style={{ width:'90px' }} type="text" value={routeType} onChange={(evt) => {setRouteType(evt.target.value);}} />
                    <input style={{ width:'90px' }} type="text" value={rope} onChange={(evt) => {setRope(parseInt(evt.target.value));}} />
                    <input onChange={(evt) => {setRouteThumbnail(evt.target.files![0]);}} type="file" accept="image/*" />
                    <input style={{ width:'90px' }} type="text" value={routeSetterUsername} onChange={(evt) => {setRouteSetterUsername(evt.target.value);}} />
        
                    <button onClick={testCreateRoute}>Create route</button>
                    <button onClick={async () => {console.log(await activeRoutesCursor.pollNext());}}>Get Active Route</button>
                    <button onClick={async () => {console.log(await allRoutesCursor.pollNext());}}>Get All Route</button>

                </div>
                <RouteDisplay route={route}/>
                <div className='hbox'>
                    <input onChange={handleFilesSelected} type="file" multiple accept="image/*" />
                    <input type="text" value={postText} onChange={(evt) => {setPostText(evt.target.value);}} />
                    <input onChange={(evt) => {setPostVideoThumbnail(evt.target.files![0]);}} type="file" accept="image/*" />
                    <input onChange={(evt) => {setPostVideo(evt.target.files![0]);}} type="file" accept="video/*" />
                    <button onClick={testCreatePost}>Create post to this route</button>
                </div>
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

// const BackendTesting = () => {
//     const [postsCursor, _] = useState(getAllPostsCursor());

//     const testGetAllPosts = async () => {
//         const post = await postsCursor.pollNext();
//         console.log(post);
//     };


//     return (
//         <div className="App">
//             <header className="App-header">
//                 <button onClick={testGetAllPosts}>Get next post </button>
//             </header>
//         </div>);
// };

export default BackendTesting;
