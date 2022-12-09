import { NativeBaseProvider, Box , Button, Text} from "native-base";
import theme from '../components/NativeBaseStyling'
import { NavBar } from "../components/NavigationBar";
import {Page} from '../App'

const Routes =  ({ setCurrentPage }: { setCurrentPage: (arg0: Page) => void; }) => {



    return (
        <NativeBaseProvider theme = {theme}>
            <NavBar/>

        </NativeBaseProvider>
    )
}

export default Routes;