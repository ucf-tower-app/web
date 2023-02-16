import { Box, Button, Center, Flex, Text, VStack } from 'native-base';
import { NavBar } from '../components/NavigationBar';
import { createSearchParams, useNavigate, useSearchParams } from 'react-router-dom';
import { getCurrentUser, getRouteById } from '../xplat/api';
import { useQuery } from 'react-query';
import { NaturalRules, Route, RouteStatus, User, UserStatus, invalidateDocRefId } from '../xplat/types';
import { queryClient } from '..';
import placeholder_image from '../placeholder_image.jpg';
import { useEffect, useState } from 'react';
import { buildUserByIDFetcher } from '../utils/queries';

const RouteView = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [hasUserUID, setHasUserUID] = useState<boolean>(false);
  const [userUID, setUserUID] = useState<string>('');

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

  useEffect(() => {
    const fetchUserUID = async () => {
      getCurrentUser().then((user: User) => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        setUserUID(user.docRef!.id);
        setHasUserUID(true);
      });
    };
    // only refetch data if we have not set userID before
    if (!hasUserUID) {
      fetchUserUID();
    }
  }, []);

  // TODO: use xplat user fetcher once it gets updated
  const userQuery = useQuery(
    ['currentUser', userUID],
    buildUserByIDFetcher(userUID),
    {
      enabled: hasUserUID,
    }
  );

  if (!hasRouteUID) {
    // with our navigation this should never happen, but can never be too safe?
    console.error('no uid params given');
    return null;
  }

  if (!hasUserUID || routeQuery.isLoading || userQuery.isLoading) {
    return null;
  }

  if (routeQuery.isError || routeQuery.data === undefined) {
    console.error(routeQuery.error);
    return null;
  }

  if (userQuery.isError || userQuery.data === undefined) {
    console.error(userQuery.error);
    return null;
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
  const displayNaturalRules = routeQuery.data.naturalRules ? NaturalRules[routeQuery.data.naturalRules] : notAssigned;

  return (
    <Box>
      <VStack>
        <NavBar />
        <Flex flexDir='column' justifyContent='center' top='70px' width='100%' position='fixed'>
          <Center><Text fontSize='2xl' bold>{routeQuery.data.name}</Text></Center>
          <Flex flexDir='row' justifyContent='center' width='100%'>
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
          <Flex flexDir='row' justifyContent='center' width='100%'>
            {/* TODO: make this image size properly */}
            <Box width='30%' height='30%'>
              <img src={routeQuery.data.thumbnailUrl ?? placeholder_image} className='route-avatar' alt='route' />
            </Box>
            <VStack>
              <Text> Status: {RouteStatus[routeQuery.data.status]} </Text>
              <Text> Type: {routeQuery.data.classifier.type} </Text>
              <Text> Color: {routeQuery.data.color} </Text>
              <Text> Grade: {routeQuery.data.gradeDisplayString} </Text>
              <Text> Natural Rules: {displayNaturalRules} </Text>
              <Text> Tags: {routeQuery.data.stringifiedTags} </Text>
              <Text> Rope: {routeQuery.data.rope ?? notAssigned} </Text>
              <Text> Setter: {routeQuery.data.setterRawName ?? notAssigned} </Text>
              {/* TODO: make this a readable date format? Also it is not even accurate atm */}
              <Text> Date Set: {routeQuery.data.timestamp?.toDateString() ?? notAssigned} </Text>
              <Text> Sends: {routeQuery.data.numSends} </Text>
              <Text> Likes: {routeQuery.data.likes.length} </Text>
              {userQuery.data.status >= UserStatus.Manager ?
                <Text> Rating: {routeQuery.data.starRating ?? 5} stars </Text>
                :
                null
              }
            </VStack>
          </Flex>
        </Flex>
      </VStack>
    </Box>
  );
};

export default RouteView;