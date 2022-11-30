import { useEffect, useState } from "react";
import { Route } from "../xplat/types/route";

const RouteDisplay = ({route}: {route: Route}) => {
    const [routeName, setRouteName] = useState("!!!");
    
    console.log("Render the route disp")

    useEffect(() => {route.getName().then((name) => setRouteName(name))}, [route]);

    
    
    return (<div>
        <p>{routeName}</p>
    </div> )
}

export default RouteDisplay;