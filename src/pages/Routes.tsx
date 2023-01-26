import { NavBar } from '../components/NavigationBar';
import { Box, Button, Divider, Flex, Text } from 'native-base';
import { useNavigate, createSearchParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Route } from '../xplat/types/route';
import { getActiveRoutesCursor, getArchivedRoutesCursor } from '../xplat/api';
import { RouteRow } from '../components/RouteRow';

const Routes = () => {
    const [activeRoutes, setActiveRoutes] = useState<Route[]>([]);
    const [archivedRoutes, setArchivedRoutes] = useState<Route[]>([]);

    useEffect(() => {
        const fetchActiveRoutes = async () => {
            const activeRoutesCursor = getActiveRoutesCursor();
            const tempActiveRoutes: Route[] = [];
            while ((await activeRoutesCursor.hasNext())) {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                tempActiveRoutes.push((await activeRoutesCursor.pollNext())!);
            }
            setActiveRoutes(tempActiveRoutes);
        };
        fetchActiveRoutes();
    }, []);

    useEffect(() => {
        const fetchArchivedRoutes = async () => {
            const archivedRoutesCursor = getArchivedRoutesCursor();
            const tempArchivedRoutes: Route[] = [];
            while ((await archivedRoutesCursor.hasNext())) {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                tempArchivedRoutes.push((await archivedRoutesCursor.pollNext())!);
            }
            setArchivedRoutes(tempArchivedRoutes);
        };
        fetchArchivedRoutes();
    }, []);

    const navigate = useNavigate();
    const exampleSearchParams = { uid: 'GQBdclAMmE2v4nDPphsc' };
    const navToRoute = () => {
        navigate({
            pathname: '/route',
            search: `?${createSearchParams(exampleSearchParams)}`
        });
    };

    return (
        <Box flexDir={'column'}>
            <Box height={'50px'} marginBottom={1}><NavBar /></Box>
            <Box>
                <Button onPress={navToRoute}>
                    <Text variant={'button'}> Go to Route </Text>
                </Button>
            </Box>
            <Flex flexDirection='row' justifyContent='space-evenly' width='100%'>
                <Flex flexDirection='row' justifyContent='center' width='30%'>
                    <Flex flexDirection='column' alignItems='center' width='100%'>
                        <Text>Active Routes</Text>
                        {
                            activeRoutes.map((currRoute: Route, index: number) => (
                                <>
                                    <Divider orientation='horizontal' height='0.5' />
                                    <RouteRow route={currRoute} key={index} />
                                </>
                            ))
                        }
                    </Flex>
                </Flex>
                <Divider orientation='vertical' height={'75vh'} position='fixed' />
                <Flex flexDirection='row' justifyContent='center' width='30%'>
                    <Flex flexDirection='column' alignItems='center' width='100%'>
                        <Text>Archived Routes</Text>
                        {
                            archivedRoutes.map((currRoute: Route, index: number) => (
                                <>
                                    <Divider orientation='horizontal' height='0.5' />
                                    <RouteRow route={currRoute} key={index} />
                                </>
                            ))
                        }
                    </Flex>
                </Flex>
            </Flex>
        </Box>
    );
};

export default Routes;