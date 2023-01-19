import { NavBar } from '../components/NavigationBar';
import { Box, Button, Center, Divider, HStack, Text, VStack} from 'native-base';
import { useNavigate, createSearchParams } from 'react-router-dom';
import { getActiveRoutes, getAllRoutes } from '../xplat/api';
import { useState, useEffect} from 'react';
import { Route } from '../xplat/types/route';

const Routes = () => {
    const [routes, setRoutes] = useState<Route[]>([]);
    const [routeNames, setRouteNames] = useState<string[]>([]);

    useEffect(() => {
        getAllRoutes().then(setRoutes);
    }, []);
    
    useEffect(() => {
        Promise.all(routes.map((route: Route) => route.getName())).then(setRouteNames);
    }, [routes]);

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
                    <VStack>
                        <Text> Active Routes </Text>
                        {
                            routeNames?.map((routeName: string) => <Text key={routeName}>{routeName}</Text>)
                        }
                        {/* TODO: add active routes */}
                    </VStack>
                </Center>
                <Divider orientation='vertical' top={'100px'} left={'50%'} height={'75vh'} position='fixed'/>
                <Center left={'50%'} width={'50%'} position='fixed'>
                    <VStack>
                        <Text> Archived Routes </Text>
                        {/* TODO: add archived routes */}
                    </VStack>
                </Center>
            </HStack>
        </Box>
        

    );
};

export default Routes;