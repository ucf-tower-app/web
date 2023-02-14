import { Box, Text, HStack, VStack, Divider, Center } from 'native-base';
import { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { useSearchParams } from 'react-router-dom';
import { NavBar } from '../components/NavigationBar';
import RouteFeedDisplay from '../components/Route/RouteFeedDisplay';
import { Forum } from '../xplat/types/forum';
import { Route } from '../xplat/types/route';
import { Post } from '../xplat/types/post';
import '../components/css/feed.css';
import CommentPanel from '../components/Post/Comment/CommentPanel';
import RouteDetailsPanel from '../components/Route/RouteDetailsPanel';
import { buildEmptyRouteByID } from '../utils/queries';

const RouteFeed = () => {
  const [route, setRoute] = useState<Route>();
  const [routeForum, setRouteForum] = useState<Forum>();
  const [params] = useSearchParams();
  const [selectedPost, setSelectedPost] = useState<Post | undefined>();
  const { isLoading, data } =
    useQuery(['routeObject', { id: params.get('uid') }], buildEmptyRouteByID(params.get('uid')));


  function setPostToView(passedPost: Post) {
    if (passedPost !== selectedPost)
      setSelectedPost(passedPost);
    else
      setSelectedPost(undefined);
  }

  // runs on query resolve
  useEffect(() => {
    if (data !== undefined) {
      setRoute(data);
    }
  }, [data]);
  if (isLoading) {
    return (
      <Box>
        <VStack>
          <NavBar />
          <Text top='50px'>Loading...</Text>
        </VStack>
      </Box>

    );
  }


  return (
    <Box>
      <VStack>
        <NavBar />
        <HStack top='50px' width={'100%'}>
          {route !== undefined && <RouteDetailsPanel route={route} forumSetter={setRouteForum} />}
          <Divider orientation='vertical' top={'100px'} left={'25%'} height={'75vh'} position='fixed' />
          <Box flexDir={'column'} left={'25%'} width={'50%'} top={'5vh'}>
            <Center>
              {routeForum !== undefined &&
                <RouteFeedDisplay forum={routeForum} setPostInParent={setPostToView} />}
            </Center>
          </Box>
          <Divider orientation='vertical' top={'100px'} right={'25%'} height={'75vh'} position='fixed' />
          <Box flexDir={'column'} left={'25%'} width={'25%'} top={'5vh'}>
            <CommentPanel post={selectedPost} />
          </Box>
        </HStack>
      </VStack>
    </Box>
  );
};

export default RouteFeed;