import { NativeBaseProvider, Box , Button, Text} from "native-base";
import theme from '../components/NativeBaseStyling'
import { NavBar } from "../components/NavigationBar";


const Routes = () => {


    return (
        <NativeBaseProvider theme = {theme}>
            <NavBar/>

        </NativeBaseProvider>
    )
}

export default Routes;