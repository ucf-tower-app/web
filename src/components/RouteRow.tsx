import { Box, Flex, Text } from 'native-base';
import { Route } from '../xplat/types/route';
import { useQuery } from 'react-query';
import { createSearchParams, useNavigate } from 'react-router-dom';
import { Pressable } from 'react-native';
import { buildRouteFetcher } from '../utils/queries';

type Props = {
  route: Route;
};
export const RouteRow = ({ route }: Props) => {
  const { isLoading, isError, error, data } = useQuery(route.docRef!.id, buildRouteFetcher(route));

  const navigate = useNavigate();
  const navToRoute = () => {
    const searchParams = { uid: route.docRef!.id };
    navigate({
      pathname: '/route',
      search: `?${createSearchParams(searchParams)}`
    });
  };

  console.log('renderin route row');

  if (isLoading) {
    return (
      <Box width='100%'>
        <Text>Loading...</Text>
      </Box>
    );
  }

  if (isError || data === undefined) {
    console.log(error);
    return null;
  }

  console.log('full render');

  return (
    <Box width='100%'>
      <Pressable onPress={navToRoute} >
        <Flex flexDirection="row" justifyContent="space-between" >
          <Text>{data.name}</Text>
          <Text>{data.grade}</Text>
        </Flex>
      </Pressable>
    </Box>
  );
};