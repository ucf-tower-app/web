import { NavBar } from '../components/NavigationBar';
import { Box, Divider, Flex, Text, VStack, Button, HStack, Center } from 'native-base';
import { useState, useEffect } from 'react';
import { Route, RouteType } from '../xplat/types/route';
import { RouteRow } from '../components/RouteRow';
import { QueryCursor, invalidateDocRefId } from '../xplat/types';
import { queryClient } from '../App';
import { useQuery } from 'react-query';
import { buildRouteListFetcher } from '../utils/queries';
import { CURSOR_INCREMENT } from '../utils/constants';
import CreateRoute from '../components/Route/CreateRoute';

const Routes = () => {
  const [archivedRoutes, setArchivedRoutes] = useState<Route[]>([]);
  const [archivedCursor, setArchivedCursor] = useState<QueryCursor<Route> | undefined>();
  const [hasMore, setHasMore] = useState(false);
  const [createRoutePopup, setCreateRoutePopup] = useState(false);
  const { isLoading, isError, data } = useQuery('routes', buildRouteListFetcher());

  async function fetchMoreArchivedRoutes() {
    if (archivedCursor) {
      const newRoutes: Route[] = [];
      let hasNext = await archivedCursor.hasNext();
      while (hasNext && newRoutes.length < CURSOR_INCREMENT) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        newRoutes.push((await archivedCursor.pollNext())!);
        hasNext = await archivedCursor.hasNext();
      }
      setHasMore(hasNext);
      if (archivedRoutes) {
        setArchivedRoutes([...archivedRoutes, ...newRoutes]);
      }
      else {
        setArchivedRoutes(newRoutes);
      }
    }
  }


  useEffect(() => {
    if (data !== undefined) {
      setArchivedCursor(data.archivedCursor);
      setArchivedRoutes(data.archivedRoutes);
      setHasMore(data.hasNext);
    }
  }, [data]);

  const archiveAllOfType = async (type: RouteType) => {
    data?.activeRoutes.forEach(async (route: Route) => {
      if (await route.getType() == type) {
        route.upgradeStatus().then(() => {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          invalidateDocRefId(route.docRef!.id);
          queryClient.invalidateQueries('routes');
        });
      }
    });
  };

  if (isLoading) {
    return (
      <Center>
        <HStack justifyContent='space-around' w='4/6' space='10'>
          <Box w='1/2' alignItems='center'>
            <Text bold fontSize='5xl'>Active Routes</Text>
            <Text fontSize='4xl'>Loading...</Text>
          </Box>
          <Box w='1/2' alignItems='center'>
            <Text bold fontSize='5xl'>Archived Routes</Text>
            <Text fontSize='4xl'>Loading...</Text>
          </Box>
        </HStack>
      </Center>
    );
  }

  if (isError || data === undefined) {
    return (
      <Center>
        <HStack justifyContent='space-around' w='4/6' space='10'>
          <Box w='1/2' alignItems='center'>
            <Text bold fontSize='5xl'>Active Routes</Text>
            <Text fontSize='4xl'>Error loading routes</Text>
          </Box>
          <Box w='1/2' alignItems='center'>
            <Text bold fontSize='5xl'>Archived Routes</Text>
            <Text fontSize='4xl'>Error loading routes</Text>
          </Box>
        </HStack>
      </Center>
    );
  }
  return (
    <Box>
      <Box height={'50px'} marginBottom={1}><NavBar /></Box>
      <Center>
        {/* TODO: add 'are you sure?' popup to buttons */}
        <HStack p='3' space='lg'>
          <Button onPress={() => setCreateRoutePopup(true)}>
            <Text variant='button'>Create route</Text>
          </Button>
          <Button onPress={() => archiveAllOfType(RouteType.Boulder)}>
            <Text variant='button'>Archive All Boulders</Text>
          </Button>
          <Button onPress={() => archiveAllOfType(RouteType.Traverse)}>
            <Text variant='button'>Archive All Traverses</Text>
          </Button>
          <Button onPress={() => archiveAllOfType(RouteType.Toprope)}>
            <Text variant='button'>Archive All Top Ropes</Text>
          </Button>
        </HStack>
      </Center>

      <Center>
        <HStack justifyContent='space-around' w='4/6' space='10'>
          <Box w='1/2' alignItems='center'>
            <Text bold fontSize='5xl'>Active Routes</Text>
            {
              data.activeRoutes.map((currRoute: Route) => (
                <VStack key={currRoute.docRef?.id} width='100%'>
                  <Divider thickness='3' />
                  <RouteRow route={currRoute} />
                </VStack>
              ))
            }
          </Box>
          <Box w='1/2' alignItems='center'>
            <Text bold fontSize='5xl'>Archived Routes</Text>
            {isLoading ? <Text>Loading...</Text> :
              archivedRoutes.map((currRoute: Route) => (
                <VStack key={currRoute.docRef?.id} width='100%'>
                  <Divider thickness='3' />
                  <RouteRow route={currRoute} />
                </VStack>
              ))
            }
          </Box>
        </HStack>
      </Center>
      
      <CreateRoute refreshRoutes={() => queryClient.invalidateQueries('routes')}
        isOpen={createRoutePopup} setIsOpen={setCreateRoutePopup} />

    </Box >
  );
};

export default Routes;