import React, {createContext,useState, useEffect} from 'react';
import {auth} from '../xplat/Firebase';
import { User } from '../xplat/types';
import { FetchedUser } from '../xplat/types';

type AuthStateReturnType = ReturnType<typeof auth.onAuthStateChanged>;
type AuthContextType = {
  userDataPresent:boolean, 
  user: FetchedUser | null, 
  listener: AuthStateReturnType | null
};

export const AuthContext = createContext<AuthContextType>({userDataPresent:false,user:null,listener: null});

export default function FirebaseAuthContext({children}: {children: JSX.Element[] | JSX.Element}){
  const [state,changeState] = useState<AuthContextType>({
    userDataPresent:false,   
    user:null,
    listener:null
  });

  async function setUser(userUID: string)
  {
    const fetched = await User.buildFetcherFromDocRefId(userUID)();
    changeState(prevState=>({...prevState, user:fetched, userDataPresent: true}));
  }

  useEffect( () => {
    if (state.listener === null){
      changeState({...state,listener:auth.onAuthStateChanged((user)=>{
        if (user !== null)
          setUser(user.uid);
        else
          changeState(oldState=>({...oldState,userDataPresent:false,user:null}));
      })
      });
    }
    return ()=>{
      if(state.listener)
        state.listener();
    };
  },[]);
  
  return (
    <AuthContext.Provider value={state}>
      {children}
    </AuthContext.Provider>
  );
}