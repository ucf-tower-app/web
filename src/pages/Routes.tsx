import { Box, Divider, Text, VStack, Button, HStack, Center } from 'native-base';
import { useState, useEffect } from 'react';
import { Route, RouteType } from '../xplat/types/route';
import { RouteRow } from '../components/Route/RouteRow';
import { QueryCursor, invalidateDocRefId } from '../xplat/types';
import { queryClient } from '../App';
import { useQuery } from 'react-query';
import { buildRouteListFetcher } from '../utils/queries';
import { CURSOR_INCREMENT } from '../utils/constants';
import CreateRoute from '../components/Route/CreateRoute';
import { ConfirmationPopup } from '../components/ConfirmationPopup';
import { createSearchParams, useNavigate } from 'react-router-dom';

const Routes = () => {
  const [archivedRoutes, setArchivedRoutes] = useState<Route[]>([]);
  const [archivedCursor, setArchivedCursor] = useState<QueryCursor<Route> | undefined>();
  const [hasMore, setHasMore] = useState(false);
  const [createRoutePopup, setCreateRoutePopup] = useState(false);
  const [archiveAllPopup, setArchiveAllPopup] = useState<RouteType | undefined>(undefined);
  const navigate = useNavigate();
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

  const navToRoute = (docRefID: string) => {
    navigate({
      pathname: '/routeview',
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      search: `?${createSearchParams({ uid: docRefID })}`
    });
  };

  const onConfirmOfType = (type: RouteType) => {
    // archive routes of this type
    data?.activeRoutes.forEach(async (route: Route) => {
      if (await route.getType() == type) {
        route.upgradeStatus().then(() => {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          invalidateDocRefId(route.docRef!.id);
          queryClient.invalidateQueries('routes');
        });
      }
    });
    // close popup
    setArchiveAllPopup(undefined);
  };

  if (isLoading) {
    return (
      <Center>
        <VStack alignItems='center' space={2}>
          <Text variant='header' bold fontSize='3xl' justifyContent='center'>Route Management</Text>
        </VStack>
        <HStack justifyContent='space-around' w='4/6' space='10'>
          <Box w='1/2' alignItems='center'>
            <Text bold fontSize='3xl'>Active Routes</Text>
            <Text fontSize='2xl'>Loading...</Text>
          </Box>
          <Box w='1/2' alignItems='center'>
            <Text bold fontSize='3xl'>Archived Routes</Text>
            <Text fontSize='2xl'>Loading...</Text>
          </Box>
        </HStack>
      </Center>
    );
  }

  if (isError || data === undefined) {
    return (
      <Center>
        <VStack alignItems='center' space={2}>
          <Text variant='header' bold fontSize='3xl' justifyContent='center'>Route Management</Text>
        </VStack>
        <HStack justifyContent='space-around' w='4/6' space='10'>
          <Box w='1/2' alignItems='center'>
            <Text bold fontSize='3xl'>Active Routes</Text>
            <Text fontSize='2xl'>Error loading routes</Text>
          </Box>
          <Box w='1/2' alignItems='center'>
            <Text bold fontSize='3xl'>Archived Routes</Text>
            <Text fontSize='2xl'>Error loading routes</Text>
          </Box>
        </HStack>
      </Center>
    );
  }
  return (
    <Box>
      <VStack alignItems='center' space={2}>
        <Text variant='header' bold fontSize='3xl' justifyContent='center'>Route Management</Text>
      </VStack>
      <Center p='5'>
        {/* TODO: add 'are you sure?' popup to buttons */}
        <HStack p='3' space='lg'>
          <Button onPress={() => setCreateRoutePopup(true)} background='green.500'>
            <Text variant='button'>Create route</Text>
          </Button>
          <Button onPress={() => setArchiveAllPopup(RouteType.Boulder)} background='red.400'>
            <ConfirmationPopup
              open={archiveAllPopup === RouteType.Boulder}
              onCancel={() => setArchiveAllPopup(undefined)}
              onConfirm={() => onConfirmOfType(RouteType.Boulder)}
            />
            <Text variant='button'>Archive All Boulders</Text>
          </Button>
          <Button onPress={() => setArchiveAllPopup(RouteType.Traverse)} background='red.400'>
            <ConfirmationPopup
              open={archiveAllPopup === RouteType.Traverse}
              onCancel={() => setArchiveAllPopup(undefined)}
              onConfirm={() => onConfirmOfType(RouteType.Traverse)}
            />
            <Text variant='button'>Archive All Traverses</Text>
          </Button>
          <Button onPress={() => setArchiveAllPopup(RouteType.Toprope)} background='red.400'>
            <ConfirmationPopup
              open={archiveAllPopup === RouteType.Toprope}
              onCancel={() => setArchiveAllPopup(undefined)}
              onConfirm={() => onConfirmOfType(RouteType.Toprope)}
            />
            <Text variant='button'>Archive All Top Ropes</Text>
          </Button>
        </HStack>
      </Center>

      <Center pt='5'>
        <HStack justifyContent='space-around' w='4/6' space='16'>
          <Box w='1/2' alignItems='center'>
            <Text bold fontSize={{
              base: 'xl',
              lg: '2xl',
              xl: '3xl'
            }}>Active Routes</Text>
            {
              data.activeRoutes.map((currRoute: Route) => (
                <VStack key={currRoute.docRef?.id} width='100%'>
                  <Divider thickness='3' />
                  <RouteRow route={currRoute} onPress={navToRoute}/>
                </VStack>
              ))
            }
          </Box>
          <Box w='1/2' alignItems='center'>
            <Text bold  fontSize={{
              base: 'xl',
              lg: '2xl',
              xl: '3xl'
            }}>Archived Routes</Text>
            {isLoading ? <Text>Loading...</Text> :
              archivedRoutes.map((currRoute: Route) => (
                <VStack key={currRoute.docRef?.id} width='100%'>
                  <Divider thickness='3' />
                  <RouteRow route={currRoute} onPress={navToRoute} />
                </VStack>
              ))
            }
            {hasMore ? <Text onPress={fetchMoreArchivedRoutes}>Load More</Text> : null}
          </Box>
        </HStack>
      </Center>
      
      <CreateRoute refreshRoutes={() => queryClient.invalidateQueries('routes')}
        isOpen={createRoutePopup} setIsOpen={setCreateRoutePopup} />

    </Box >
  );
};

export default Routes;