import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { auth as FirebaseAuth} from '../xplat/Firebase';


const RequireAuth = () => {
  const location = useLocation();
  
  if (FirebaseAuth.currentUser === null)
    return <Navigate to={'/'} state={{ from: location }} replace/>;
  
  return <Outlet/>;
};

export default RequireAuth;