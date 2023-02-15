import React, {createContext,useState, useEffect} from 'react';
import {auth} from '../xplat/Firebase';
import { User } from '../xplat/types';
import { FetchedUser } from '../xplat/types';

type authStateReturnType = ReturnType<typeof auth.onAuthStateChanged>;
type authContext = {
  userDataPresent:boolean, 
  user: FetchedUser | null, 
  listener: authStateReturnType | null
};

export const AuthContext= 
  createContext<authContext>({userDataPresent:false,user:null,listener: null});
export default function FirebaseAuthContext({children}: {children: JSX.Element[] | JSX.Element}){
  const [state,changeState] = useState<authContext>({
    userDataPresent:false,   
    user:null,
    listener:null
  });

  async function setUser(userUID: string)
  {
    const fetched = await User.buildFetcherFromDocRefId(userUID)();
    changeState({...state, user:fetched, userDataPresent: true});
  }

  useEffect(()=>{
        
    if(state.listener==null){
        
       
      changeState({...state,listener:auth.onAuthStateChanged((user)=>{
        if(user)
        {
          setUser(user.uid);
        }
        else
          changeState(oldState=>({...oldState,userDataPresent:true,user:null}));
      })});
        
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