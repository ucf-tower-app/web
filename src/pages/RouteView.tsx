import { Box, Button, Center, Flex, Text, VStack } from 'native-base';
import { NavBar } from '../components/NavigationBar';
import { createSearchParams, useNavigate, useSearchParams } from 'react-router-dom';
import { getRouteById } from '../xplat/api';
import { useQuery } from 'react-query';
import { NaturalRules, Route, RouteStatus, invalidateDocRefId } from '../xplat/types';
import { queryClient } from '..';
import placeholder_image from '../placeholder_image.jpg';

const RouteView = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const hasUID: boolean = params.has('uid');
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const myUID: string = (hasUID ? params.get('uid')! : '');

  const { isLoading, isError, data, error } = useQuery(
    ['routes', myUID],
    Route.buildFetcherFromDocRefId(myUID),
    {
      enabled: hasUID
    }
  );

  if (!hasUID) {
    // with our navigation this should never happen, but can never be too safe?
    console.error('no uid params given');
    return null;
  }

  if (isLoading) {
    return null;
  }

  if (isError || data === undefined) {
    console.error(error);
    return null;
  }

  const navToRouteFeed = () => {
    navigate({
      pathname: '/routefeed',
      search: `?${createSearchParams({ uid: myUID })}`
    });
  };

  const archiveThisRoute = async () => {
    getRouteById(myUID).upgradeStatus().then(() => {
      invalidateDocRefId(myUID);
      queryClient.invalidateQueries({ queryKey: ['routes', myUID] });
    });
  };

  const notAssigned = 'not assigned';
  const displayNaturalRules = data.naturalRules ? NaturalRules[data.naturalRules] : notAssigned;

  return (
    <Box>
      <VStack>
        <NavBar />
        <Flex flexDir='column' justifyContent='center' top='70px' width='100%' position='fixed'>
          <Center><Text fontSize='2xl' bold>{data.name}</Text></Center>
          <Flex flexDir='row' justifyContent='center' width='100%'>
            <Button onPress={navToRouteFeed}>
              <Text variant='button'>View Route Feed</Text>
            </Button>
            {data.status === RouteStatus.Active ?
              <Button onPress={archiveThisRoute}>
                <Text variant='button'>Archive This Route</Text>
              </Button>
              :
              null
            }
          </Flex>
          <Flex flexDir='row' justifyContent='center' width='100%'>
            <Box width='30%' height='30%'>
              <img src={data.thumbnailUrl ?? placeholder_image} className='route-avatar' alt='route' />
            </Box>
            <VStack>
              <Text> Status: {RouteStatus[data.status]} </Text>
              <Text> Type: {data.classifier.type} </Text>
              <Text> Color: {data.color} </Text>
              <Text> Grade: {data.gradeDisplayString} </Text>
              <Text> Natural Rules: {displayNaturalRules} </Text>
              <Text> Tags: {data.stringifiedTags} </Text>
              <Text> Rope: {data.rope ?? notAssigned} </Text>
              <Text> Setter: {data.setterRawName ?? notAssigned} </Text>
              {/* TODO: make this a readable date format? Also it is not even accurate atm */}
              <Text> Date Set: {data.timestamp?.toDateString() ?? notAssigned} </Text>
              <Text> Sends: {data.numSends} </Text>
              <Text> Likes: {data.likes.length} </Text>
              {/* TODO: make this stars field only visible to managers */}
              <Text> Rating: {data.starRating ?? 5} stars </Text>
            </VStack>
          </Flex>
        </Flex>
      </VStack>
    </Box>
  );
};

export default RouteView;