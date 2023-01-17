import { NavBar } from '../components/NavigationBar';
import { Box, Button, Center, Divider, HStack, Text} from 'native-base';
import { useNavigate, createSearchParams } from 'react-router-dom';


const Routes = () => {
    const navigate = useNavigate();
    const exampleSearchParams = {uid: 'GQBdclAMmE2v4nDPphsc'};
    const navToRoute = () => {
        navigate({
            pathname: '/route',
            search: `?${createSearchParams(exampleSearchParams)}`
        });
    };

    return (
        <Box flexDir={'column'}>
            <Box height={'50px'} marginBottom={1}><NavBar/></Box>
            <Box>
                <Button onPress={navToRoute}>
                    <Text variant={'button'}> Go to Route</Text>
                </Button>
            </Box>
            <HStack width={'100%'}>
                <Center width={'50%'} position='fixed'>
                    <Text> Active Routes </Text>
                    {/* TODO: add active routes */}
                </Center>
                <Divider orientation='vertical' top={'100px'} left={'50%'} height={'75vh'} position='fixed'/>
                <Center left={'50%'} width={'50%'} position='fixed'>
                    <Text> Archived Routes </Text>
                    {/* TODO: add archived routes */}
                </Center>
            </HStack>
        </Box>
        

    );
};

export default Routes;