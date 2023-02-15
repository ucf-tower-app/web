import { Box, Button, Center, Flex, Text, VStack } from 'native-base';
import { NavBar } from '../components/NavigationBar';
import { createSearchParams, useNavigate, useSearchParams } from 'react-router-dom';
import { getCurrentUser, getRouteById } from '../xplat/api';
import { useQuery } from 'react-query';
import { NaturalRules, Route, RouteStatus, User, UserStatus, invalidateDocRefId } from '../xplat/types';
import { queryClient } from '..';
import placeholder_image from '../placeholder_image.jpg';
import { useEffect, useState } from 'react';

const RouteView = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [hasUserUID, setHasUserUID] = useState<boolean>(false);
  const [userUID, setUserUID] = useState<string>('sugma'); // for some reason, it breaks using ''

  const hasRouteUID: boolean = params.has('uid');
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const routeUID: string = (hasRouteUID ? params.get('uid')! : '');

  const currRoute = useQuery(
    ['routes', routeUID],
    Route.buildFetcherFromDocRefId(routeUID),
    {
      enabled: hasRouteUID,
    }
  );

  useEffect(() => {
    const fetchData = async () => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      setUserUID((await getCurrentUser()).docRef!.id);
      setHasUserUID(true);
    };
    // only refetch data if we have not set userID before
    if (!hasUserUID) {
      fetchData();
    }
  }, []);

  const currUser = useQuery(
    ['currentUser', userUID],
    User.buildFetcherFromDocRefId(userUID),
    {
      enabled: hasUserUID,
    }
  );

  if (!hasRouteUID) {
    // with our navigation this should never happen, but can never be too safe?
    console.error('no uid params given');
    return null;
  }

  if (!hasUserUID || currRoute.isLoading || currUser.isLoading) {
    return null;
  }

  if (currRoute.isError || currRoute.data === undefined) {
    console.error(currRoute.error);
    return null;
  }

  if (currUser.isError || currUser.data === undefined) {
    console.error(currUser.error);
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
  const displayNaturalRules = currRoute.data.naturalRules ? NaturalRules[currRoute.data.naturalRules] : notAssigned;

  return (
    <Box>
      <VStack>
        <NavBar />
        <Flex flexDir='column' justifyContent='center' top='70px' width='100%' position='fixed'>
          <Center><Text fontSize='2xl' bold>{currRoute.data.name}</Text></Center>
          <Flex flexDir='row' justifyContent='center' width='100%'>
            <Button onPress={navToRouteFeed}>
              <Text variant='button'>View Route Feed</Text>
            </Button>
            {currRoute.data.status === RouteStatus.Active ?
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
              <img src={currRoute.data.thumbnailUrl ?? placeholder_image} className='route-avatar' alt='route' />
            </Box>
            <VStack>
              <Text> Status: {RouteStatus[currRoute.data.status]} </Text>
              <Text> Type: {currRoute.data.classifier.type} </Text>
              <Text> Color: {currRoute.data.color} </Text>
              <Text> Grade: {currRoute.data.gradeDisplayString} </Text>
              <Text> Natural Rules: {displayNaturalRules} </Text>
              <Text> Tags: {currRoute.data.stringifiedTags} </Text>
              <Text> Rope: {currRoute.data.rope ?? notAssigned} </Text>
              <Text> Setter: {currRoute.data.setterRawName ?? notAssigned} </Text>
              {/* TODO: make this a readable date format? Also it is not even accurate atm */}
              <Text> Date Set: {currRoute.data.timestamp?.toDateString() ?? notAssigned} </Text>
              <Text> Sends: {currRoute.data.numSends} </Text>
              <Text> Likes: {currRoute.data.likes.length} </Text>
              {currUser.data.status >= UserStatus.Manager ?
                <Text> Rating: {currRoute.data.starRating ?? 5} stars </Text>
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