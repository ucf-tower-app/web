import { useEffect, useState } from "react";
import { Route } from "../xplat/types/route";
import { User } from "../xplat/types/user";

const RouteDisplay = ({route}: {route: Route}) => {
    const [routeName, setRouteName] = useState("!!!");
    const [routeDiff, setRouteDiff] = useState("!!!");
    const [routeSetter, setRouteSetter] = useState('!!!');
    
    console.log("Render the route disp")

    useEffect(() => {route.getName().then((name) => setRouteName(name))}, [route]);
    useEffect(() => {route.getRating().then((grade) => setRouteDiff(grade))}, [route]);
    useEffect(() => {
        route.getSetter().then(async (setter) => {
            if(setter !== undefined) 
                setRouteSetter(await setter.getUsername());
            })
    }, [route]);
    
    return (
    <div>
        <div className="hbox">
            <p>{routeName}</p>
            <p>{routeDiff}</p>
            {routeSetter !== '!!!' ? <p>{routeSetter}</p> : <div/>}
        </div>
    </div>
    )
}

export default RouteDisplay;