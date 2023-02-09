import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { auth as FirebaseAuth} from '../xplat/Firebase';
import { useQuery } from 'react-query';
import { buildUserByIDFetcher } from './queries';
import { UserStatus } from '../xplat/types';

const RequireAuth = () => {
  const location = useLocation();
  
  if (FirebaseAuth.currentUser === null)
    return <Navigate to={'/'} state={{ from: location }} replace/>;
  
  const {isLoading, isError, data} = 
    useQuery(FirebaseAuth.currentUser.uid, buildUserByIDFetcher(FirebaseAuth.currentUser.uid));
  
  if (isLoading)
    return <>Loading user authentication</>;
  if (isError || data === undefined)
    return <>Error loading user authentication</>;

  if (data.status < UserStatus.Employee)
  {
    FirebaseAuth.signOut();
    return <Navigate to={'/'} state={{ from: location }} replace/>;
  }

  return <Outlet/>;
};

export default RequireAuth;