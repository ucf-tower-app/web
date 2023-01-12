import { NavBar } from "../components/NavigationBar";
import { Box, Button, Text} from 'native-base'
import { useNavigate, createSearchParams } from "react-router-dom";


const Routes = () => {
    let navigate = useNavigate();
    const exampleSearchParams = {uid: 'GQBdclAMmE2v4nDPphsc'};
    const navToRoute = () => {
        navigate({
            pathname: '/route',
            search: `?${createSearchParams(exampleSearchParams)}`
        })
    }

    return (
        <Box flexDir={'column'}>
            <Box height={'50px'} marginBottom={1}><NavBar/></Box>
            <Box>
                <Button onPress={navToRoute}>
                    <Text variant={'button'}> Go to Route</Text>
                </Button>
            </Box>
        </Box>
        

    );
}

export default Routes;