import { NavBar } from '../components/NavigationBar';
import { Box, Divider, Flex, Text, VStack, Button } from 'native-base';
import { useState, useEffect } from 'react';
import { Route } from '../xplat/types/route';
import { RouteRow } from '../components/RouteRow';
import { QueryCursor } from '../xplat/types';
import { queryClient } from '../App';
import { isError, useQuery } from 'react-query';
import { buildRouteListFetcher } from '../utils/queries';
import { CURSOR_INCREMENT, INITIAL_CURSOR_SIZE } from '../utils/constants';
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

  if (isLoading) {
    return (
      <Box flexDir={'column'}>
        <Box height={'50px'} marginBottom={1}><NavBar /></Box>
        <Flex flexDirection='row' justifyContent='space-evenly' width='100%' top='50px'>
          <Flex flexDirection='row' justifyContent='center' width='30%'>
            <Flex flexDirection='column' alignItems='center' width='100%'>
              <Text>Active Routes</Text>
              <Text>Loading...</Text>
            </Flex>
          </Flex>
          <Divider orientation='vertical' height={'75vh'} position='fixed' />
          <Flex flexDirection='row' justifyContent='center' width='30%'>
            <Flex flexDirection='column' alignItems='center' width='100%'>
              <Text>Archived Routes</Text>
              <Text>Loading...</Text>
            </Flex>
          </Flex>
        </Flex>
      </Box>
    );
  }

  if (isError || data === undefined) {
    return (
      <Box flexDir={'column'}>
        <Box height={'50px'} marginBottom={1}><NavBar /></Box>
        <Flex flexDirection='row' justifyContent='space-evenly' width='100%' top='50px'>
          <Flex flexDirection='row' justifyContent='center' width='30%'>
            <Flex flexDirection='column' alignItems='center' width='100%'>
              <Text>Active Routes</Text>
              <Text>Error loading routes</Text>
            </Flex>
          </Flex>
          <Divider orientation='vertical' height={'75vh'} position='fixed' />
          <Flex flexDirection='row' justifyContent='center' width='30%'>
            <Flex flexDirection='column' alignItems='center' width='100%'>
              <Text>Archived Routes</Text>
              <Text>Error loading routes</Text>
            </Flex>
          </Flex>
        </Flex>
      </Box>
    );
  }
  return (
    <VStack height='100%'>
      <Box height={'50px'} marginBottom={1}><NavBar /></Box>
      <Button onPress={() => setCreateRoutePopup(true)}
        position='sticky' m={1}>
        <Text variant='button'>Create route</Text>
      </Button>
      <Flex flexDirection='row' justifyContent='space-evenly' width='100%' top='50px'>
        <Flex flexDirection='row' justifyContent='center' width='30%'>
          <Flex flexDirection='column' alignItems='center' width='100%'>
            <Text bold fontSize='lg'>Active Routes</Text>
            {
              data.activeRoutes.map((currRoute: Route) => (
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
            <Text bold fontSize='lg'>Archived Routes</Text>
            {isLoading ? <Text>Loading...</Text> :
              archivedRoutes.map((currRoute: Route) => (
                <VStack key={currRoute.docRef?.id} width='100%'>
                  <Divider orientation='horizontal' height='2px' />
                  <RouteRow route={currRoute} />
                </VStack>
              ))
            }
            {hasMore ? <Text onPress={fetchMoreArchivedRoutes}>Load More</Text> : null}
          </Flex>
        </Flex>
      </Flex>

      <CreateRoute refreshRoutes={() => queryClient.invalidateQueries('routes')}
        isOpen={createRoutePopup} setIsOpen={setCreateRoutePopup} />
    </VStack>
  );
};

export default Routes;