import { useEffect, useState } from 'react';
import { Forum } from '../xplat/types/forum';
import { Route } from '../xplat/types/route';
import ForumDisplay from './ForumDisplay';

const RouteDisplay = ({route}: {route: Route}) => {
    const [routeName, setRouteName] = useState('!!!');
    const [routeDiff, setRouteDiff] = useState('!!!');
    const [routeSetter, setRouteSetter] = useState('!!!');
    const [forum, setForum] = useState<Forum | undefined>(undefined);
    
    useEffect(() => {route.getName().then((name) => setRouteName(name));}, [route]);
    useEffect(() => {route.getRating().then((grade) => setRouteDiff(grade));}, [route]);
    useEffect(() => {
        route.getSetter().then(async (setter) => {
            if(setter !== undefined) 
                setRouteSetter(await setter.getUsername());
        });
    }, [route]);
    useEffect(() => {route.getForum().then((_forum) => setForum(_forum));}, [route]);
    
    
    return (
        <div>
            <div className="hbox">
                <p>{routeName}</p>
                <p>{routeDiff}</p>
                {routeSetter !== '!!!' ? <p>{routeSetter}</p> : <div/>}
            </div>
            {forum && <ForumDisplay forum={forum!}/>}
        </div>
    );
};

export default RouteDisplay;