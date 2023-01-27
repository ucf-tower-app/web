import { Spacer } from 'native-base';
import { useEffect, useState } from 'react';
import { Forum, Route } from '../../xplat/types/types';
import ForumDisplay from './ForumDisplay';

const RouteDisplay = ({route}: {route: Route}) => {
    const [routeName, setRouteName] = useState('!!!');
    const [routeDiff, setRouteDiff] = useState('!!!');
    const [routeSetter, setRouteSetter] = useState('!!!');
    const [forum, setForum] = useState<Forum | undefined>(undefined);
    const [thumbnail, setThumbnail] = useState<string | undefined>(undefined);
    
    useEffect(() => {
        const run = async () => {
            await route.getData();
            route.getName().then(setRouteName);
            route.getGradeDisplayString().then(setRouteDiff);
            route.hasThumbnail().then(async (yeah) => yeah ? route.getThumbnailUrl().then(setThumbnail) : undefined);
            route.getSetter().then(async (setter) => {
                if(setter !== undefined) 
                    setRouteSetter(await setter.getUsername());
            });
            route.getForum().then(setForum);
        };
        run();
    });
    
    
    return (
        <div>
            <div className="hbox">
                <p>{routeName}</p>
                <Spacer width='20px'/>
                {thumbnail && <img src={thumbnail} className="fillHeight" style={{ width: 45, height: 45 }} alt=""/>}
                <Spacer width='20px'/>
                <p>{routeDiff}</p>
                <Spacer width='20px'/>
                {routeSetter !== '!!!' ? <p>{routeSetter}</p> : <div/>}
                <Spacer width='20px'/>
                <button onClick={() => console.log(route)}>Print Route</button>
            </div>
            {forum && <ForumDisplay forum={forum!}/>}
        </div>
    );
};

export default RouteDisplay;