import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { auth as FirebaseAuth} from '../xplat/Firebase';
import { useQuery } from 'react-query';
import { queryClient } from '..';
import { useEffect } from 'react';
import { buildUserByIDFetcher } from './queries';
import { invalidateDocRefId, UserStatus } from '../xplat/types';
import { Link } from 'native-base';

const RequireAuth = () => {
  const location = useLocation();

  useEffect( () => {
    FirebaseAuth.beforeAuthStateChanged( (user) => {
      if (user)
      {
        invalidateDocRefId(user.uid);
      }
    });
    FirebaseAuth.onAuthStateChanged( () => {
      queryClient.invalidateQueries('loggedUser');
    });
  }, []);
  
  if (FirebaseAuth.currentUser === null)
    return <Navigate to={'/'} state={{ from: location }} replace/>;

  const {isLoading, isError, data} = 
    useQuery(['loggedUser', FirebaseAuth.currentUser.uid], buildUserByIDFetcher(FirebaseAuth.currentUser.uid));
  
  if (isLoading)
    return <>Loading user authentication</>;
  if (isError || data === undefined)
    return (
      <>
        There was an error loading the user authentication. 
        <Link href='/'>Click here to return to the login screen.</Link>
      </>
    );

  if (data.status < UserStatus.Employee)
  {
    FirebaseAuth.signOut();
    return <Navigate to={'/'} state={{ from: location }} replace/>;
  }

  return <Outlet/>;
};

export default RequireAuth;