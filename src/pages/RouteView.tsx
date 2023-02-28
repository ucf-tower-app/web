import { Box, Button, Center, Flex, Text, VStack } from 'native-base';
import { NavBar } from '../components/NavigationBar';
import { createSearchParams, useNavigate, useSearchParams } from 'react-router-dom';
import { getRouteById } from '../xplat/api';
import { useQuery } from 'react-query';
import { NaturalRules, Route, RouteStatus, UserStatus, invalidateDocRefId } from '../xplat/types';
import { queryClient } from '../App';
import placeholder_image from '../placeholder_image.jpg';
import { useContext } from 'react';
import { AuthContext } from '../utils/AuthContext';

const RouteView = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);

  const hasRouteUID: boolean = params.has('uid');
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const routeUID: string = (hasRouteUID ? params.get('uid')! : '');

  const routeQuery = useQuery(
    ['routes', routeUID],
    Route.buildFetcherFromDocRefId(routeUID),
    {
      enabled: hasRouteUID,
    }
  );

  if (!hasRouteUID) {
    // with our navigation this should never happen, but can never be too safe?
    console.error('no uid params given');
    return null;
  }

  if (routeQuery.isLoading) {
    return null;
  }

  if (routeQuery.isError || routeQuery.data === undefined) {
    console.error(routeQuery.error);
    return null;
  }

  if (authContext.user === null) {
    return (
      <Box h='100px'>
        <Text>You are not currently logged in</Text>
      </Box>
    );
  }

  const navToRouteFeed = () => {
    navigate({
      pathname: '/routefeed',
      search: `?${createSearchParams({ uid: routeUID })}`
    });
  };

  const archiveThisRoute = async () => {
    getRouteById(routeUID).upgradeStatus().then(() => {
      // important to invalidate doc ref id first before invalidating the query
      // so it can run with knowledge of invalidated doc ref id
      invalidateDocRefId(routeUID);
      queryClient.invalidateQueries({ queryKey: ['routes', routeUID] });
    });
  };

  const notAssigned = 'not assigned';

  return (
    <Box>
      <VStack>
        <NavBar />
        <Flex flexDir='column' justifyContent='center' top='70px' width='100%' position='fixed'>
          <Center><Text fontSize='2xl' bold>{routeQuery.data.name}</Text></Center>
          <Flex flexDir='row' justifyContent='center' width='100%' marginTop={1}>
            <Button onPress={navToRouteFeed}>
              <Text variant='button'>View Route Feed</Text>
            </Button>
            {routeQuery.data.status === RouteStatus.Active ?
              <Button onPress={archiveThisRoute}>
                <Text variant='button'>Archive This Route</Text>
              </Button>
              :
              null
            }
          </Flex>
          <Flex flexDir='row' justifyContent='center' width='100%' marginTop={3}>
            {/* TODO: make this image size properly */}
            <Box width='30%' height='30%'>
              <img src={routeQuery.data.thumbnailUrl ?? placeholder_image} className='route-avatar' alt='route' />
            </Box>
            <Flex backgroundColor='gray.300' rounded='md' p='1' marginLeft={3}>
              <Flex flexDir='column' margin={2}>
                <Text> <Text bold>Status: </Text>{RouteStatus[routeQuery.data.status]}</Text>
                <Text> <Text bold>Type: </Text>{routeQuery.data.classifier.type} </Text>
                <Text> <Text bold>Color: </Text>{routeQuery.data.color} </Text>
                <Text> <Text bold>Grade: </Text>{routeQuery.data.gradeDisplayString} </Text>
                <Text> <Text bold>Natural Rules: </Text>{
                  routeQuery.data.naturalRules ? NaturalRules[routeQuery.data.naturalRules] : notAssigned
                } </Text>
                <Text> <Text bold>Tags: </Text>{routeQuery.data.stringifiedTags} </Text>
                <Text> <Text bold>Rope: </Text>{routeQuery.data.rope ?? notAssigned} </Text>
                <Text> <Text bold>Setter: </Text>{routeQuery.data.setterRawName ?? notAssigned} </Text>
                {/* TODO: make this a readable date format? Also it is not even accurate atm */}
                <Text> <Text bold>Date Set: </Text>{routeQuery.data.timestamp?.toDateString() ?? notAssigned} </Text>
                <Text> <Text bold>Sends: </Text>{routeQuery.data.numSends} </Text>
                <Text> <Text bold>Likes: </Text>{routeQuery.data.likes.length} </Text>
                {authContext.user.status >= UserStatus.Manager ?
                  <Text> <Text bold>Rating: </Text>{routeQuery.data.starRating ?? 5} stars </Text>
                  :
                  null
                }
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      </VStack>
    </Box>
  );
};

export default RouteView;