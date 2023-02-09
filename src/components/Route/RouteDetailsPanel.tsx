import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { Box, Center, Text } from 'native-base';
import placeholder_image from '../../placeholder_image.jpg';
import { Route, Forum } from '../../xplat/types';
import { buildRouteFetcher } from '../../utils/queries';

const RouteDetailsPanel = ({ route, forumSetter }: { route: Route, forumSetter: (forum: Forum) => void}) => {
  const {isLoading, isError, data} = useQuery(['route', {id: route.docRef!.id}], buildRouteFetcher(route));

  useEffect(() => {
    if (data !== undefined) {
      forumSetter(data.forum);
    }
  }, [data]);

  if (isLoading)
  {
    return (
      <Box flexDir={'column'} width={'25%'} top={'100px'} position='fixed'>
        <Center>
          <Text fontSize={'2xl'} bold>Loading...</Text>
        </Center>
      </Box>
    );
  }

  if (isError || data === undefined)
  {
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
        {data.image !== undefined && <img src={data.image} className='route-avatar' alt='route' />}
        {data.setter !== undefined && <Text> Set by {data.setter.string}</Text>}
      </Center>
    </Box>
  );
};

export default RouteDetailsPanel;