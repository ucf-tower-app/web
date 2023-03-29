import { Box, Button, Center, Flex, HStack, Text, VStack } from 'native-base';
import { createSearchParams, useNavigate, useSearchParams } from 'react-router-dom';
import { getRouteById } from '../xplat/api';
import { useQuery } from 'react-query';
import { NaturalRules, Route, RouteStatus, UserStatus, invalidateDocRefId } from '../xplat/types';
import { queryClient } from '../App';
import placeholder_image from '../placeholder_image.jpg';
import { useContext, useState } from 'react';
import { AuthContext } from '../utils/AuthContext';
import { ConfirmationPopup } from '../components/ConfirmationPopup';
import EditRoute from '../components/Route/EditRoute';

const RouteView = () => {
  const [params] = useSearchParams();
  const [showEditPopup, setShowEditPopup] = useState(false);
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);

  const [archivePopupOpen, setArchivePopupOpen] = useState<boolean>(false);

  const hasRouteUID: boolean = params.has('uid');
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const routeUID: string = (hasRouteUID ? params.get('uid')! : '');

  const { isLoading, isError, error, data } = useQuery(
    routeUID,
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

  if (isLoading) {
    return null;
  }

  if (isError || data === undefined) {
    console.error(error);
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
      queryClient.invalidateQueries({ queryKey: routeUID });
    });
  };

  const notAssigned = 'not assigned';

  return (
    <Box>
      <VStack>
        <Flex flexDir='column' justifyContent='center' top='70px' width='100%' position='fixed'>
          <Center><Text fontSize='2xl' bold>{data.name}</Text></Center>
          <Flex flexDir='row' justifyContent='center' width='100%' marginTop={1}>
            <Button onPress={navToRouteFeed}>
              <Text variant='button'>View Route Feed</Text>
            </Button>
            {data.status === RouteStatus.Active ?
              <>
                <Button onPress={() => setArchivePopupOpen(true)}>
                  <ConfirmationPopup
                    open={archivePopupOpen}
                    onCancel={() => setArchivePopupOpen(false)}
                    onConfirm={() => {
                      archiveThisRoute();
                      setArchivePopupOpen(false);
                    }}
                  />
                  <Text variant='button'>Archive This Route</Text>
                </Button>
                <Button onPress={() => setShowEditPopup(true)}>
                  <Text variant='button'>Edit Route</Text>
                  <EditRoute route={data} open={showEditPopup} setOpen={setShowEditPopup} />
                </Button>
              </>
              :
              null
            }
          </Flex>
          <HStack justifyContent='center' alignSelf='center' marginTop={3}>
            <img src={data.thumbnailUrl ?? placeholder_image} className='route-view-avatar' alt='route' />
            <Flex backgroundColor='gray.300' flexDir='column' rounded='md' p='2' marginLeft={3}>
              <Text><Text bold>Status: </Text>{RouteStatus[data.status]}</Text>
              <Text><Text bold>Type: </Text>{data.classifier.type}</Text>
              <Text><Text bold>Color: </Text>{data.color}</Text>
              <Text><Text bold>Grade: </Text>{data.gradeDisplayString}</Text>
              <Text><Text bold>Natural Rules: </Text>{
                data.naturalRules ? NaturalRules[data.naturalRules] : notAssigned
              }</Text>
              <Text><Text bold>Tags: </Text>{
                data.stringifiedTags === '' ? notAssigned : data.stringifiedTags
              }</Text>
              <Text><Text bold>Rope: </Text>{data.rope ?? notAssigned}</Text>
              <Text><Text bold>Setter: </Text>{data.setterRawName ?? notAssigned}</Text>
              <Text><Text bold>Date Set: </Text>{data.timestamp?.toLocaleDateString() ?? notAssigned}</Text>
              <Text><Text bold>Sends: </Text>{data.numSends}</Text>
              <Text><Text bold>Likes: </Text>{data.likes.length}</Text>
              {authContext.user.status >= UserStatus.Manager ?
                <Text><Text bold>Rating: </Text>{(data.starRating ?? 5).toFixed(1)} stars </Text>
                :
                null
              }
            </Flex>
          </HStack>
        </Flex>
      </VStack>
    </Box>
  );
};

export default RouteView;