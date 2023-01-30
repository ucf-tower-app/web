import { NavBar } from '../components/NavigationBar';
import { Box, Divider, Flex, Text, VStack } from 'native-base';
import { useState, useEffect } from 'react';
import { Route } from '../xplat/types/route';
import { getActiveRoutesCursor, getArchivedRoutesCursor } from '../xplat/api';
import { RouteRow } from '../components/RouteRow';
import { QueryCursor } from '../xplat/types/types';

const Routes = () => {
    const [activeRoutes, setActiveRoutes] = useState<Route[]>([]);
    const [archivedRoutes, setArchivedRoutes] = useState<Route[]>([]);

    useEffect(() => {
        const grabRoutes = async (cursor: QueryCursor<Route>) => {
            const routes: Route[] = [];
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            while (await cursor.hasNext()) routes.push((await cursor.pollNext())!);
            return routes;
        };
        const setRoutes = async () => {
            setActiveRoutes(await grabRoutes(getActiveRoutesCursor()));
            // TODO: use the cursor for archived routes, since we don't want to pull
            // every route in history on startup
            setArchivedRoutes(await grabRoutes(getArchivedRoutesCursor()));
        };
        setRoutes();
    }, []);

    return (
        <Box flexDir={'column'}>
            <Box height={'50px'} marginBottom={1}><NavBar /></Box>
            <Flex flexDirection='row' justifyContent='space-evenly' width='100%' top='50px'>
                <Flex flexDirection='row' justifyContent='center' width='30%'>
                    <Flex flexDirection='column' alignItems='center' width='100%'>
                        <Text>Active Routes</Text>
                        {
                            activeRoutes.map((currRoute: Route) => (
                                <VStack key={currRoute.docRef?.id} width='100%'>
                                    <Divider orientation='horizontal' height='2px' />
                                    <RouteRow route={currRoute} />
                                </VStack>
                            ))
                        }
                    </Flex>
                </Flex>
                <Divider orientation='vertical' height={'75vh'} position='fixed' />
                <Flex flexDirection='row' justifyContent='center' width='30%'>
                    <Flex flexDirection='column' alignItems='center' width='100%'>
                        <Text>Archived Routes</Text>
                        {
                            archivedRoutes.map((currRoute: Route) => (
                                <VStack key={currRoute.docRef?.id} width='100%'>
                                    <Divider orientation='horizontal' height='2px' />
                                    <RouteRow route={currRoute} />
                                </VStack>
                            ))
                        }
                    </Flex>
                </Flex>
            </Flex>
        </Box>
    );
};

export default Routes;