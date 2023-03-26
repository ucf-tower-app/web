import { Box, Divider, Flex, Text, VStack, Button } from 'native-base';
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
      <Box flexDir={'column'}>
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
      <Button onPress={() => setCreateRoutePopup(true)} mt='20'>
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
        <Divider orientation='vertical' height={'65vh'} position='fixed' />
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
      {/* TODO: add 'are you sure?' popup to buttons */}
      <Flex flexDir='row' justifyContent='center' width='100%' height='50px' bottom='10px' position='fixed'>
        <Button onPress={() => archiveAllOfType(RouteType.Boulder)}>
          <Text variant='button'>Archive All Boulders</Text>
        </Button>
        <Button onPress={() => archiveAllOfType(RouteType.Traverse)}>
          <Text variant='button'>Archive All Traverses</Text>
        </Button>
        <Button onPress={() => archiveAllOfType(RouteType.Toprope)}>
          <Text variant='button'>Archive All Top Ropes</Text>
        </Button>
      </Flex>

      <CreateRoute refreshRoutes={() => queryClient.invalidateQueries('routes')}
        isOpen={createRoutePopup} setIsOpen={setCreateRoutePopup} />
    </VStack >
  );
};

export default Routes;