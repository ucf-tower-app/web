import { useEffect } from 'react';
import { useQuery } from 'react-query';
import { Box, Center, Text } from 'native-base';
import { Route, Forum } from '../../xplat/types';
import { getForumById } from '../../xplat/api';
import AuthorHandle from '../User/AuthorHandle';

const RouteDetailsPanel = ({ route, forumSetter }: { route: Route, forumSetter: (forum: Forum) => void }) => {
  const { isLoading, isError, data } = useQuery(['route', { id: route.getId() }], route.buildFetcher());

  useEffect(() => {
    if (data !== undefined) {
      forumSetter(getForumById(data.forumDocRefID));
    }
  }, [data]);

  if (isLoading) {
    return (
      <Box flexDir={'column'} width={'25%'} top={'100px'} position='fixed'>
        <Center>
          <Text fontSize={'2xl'} bold>Loading...</Text>
        </Center>
      </Box>
    );
  }

  if (isError || data === undefined) {
    return (
      <Box flexDir={'column'} width={'25%'} top={'100px'} position='fixed'>
        <Center>
          <Text fontSize={'2xl'} bold>Error loading route</Text>
        </Center>
      </Box>
    );
  }

  return (
    <Box flexDir={'column'} width={'25%'} top={'100px'} position='fixed'>
      <Center>
        <Text fontSize={'2xl'} bold>{data.name}</Text>
        {data.thumbnailUrl !== undefined && <img src={data.thumbnailUrl} className='route-avatar' alt='route' />}
        {data.description !== undefined && <Text>{data.description}</Text>}
        {data.setterRawName !== undefined && <Text> Set by {data.setterRawName}</Text>}
        {data.setter !== undefined && <AuthorHandle author={data.setter}/>}
      </Center>
    </Box>
  );
};

export default RouteDetailsPanel;