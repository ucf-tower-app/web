import { Box, Flex, Text } from 'native-base';
import { Route } from '../xplat/types/route';
import { useQuery } from 'react-query';
import { createSearchParams, useNavigate } from 'react-router-dom';
import { Pressable } from 'react-native';

type Props = {
  route: Route;
};
export const RouteRow = ({ route }: Props) => {
  const { isLoading, isError, error, data } = useQuery(route.docRef!.id, route.buildFetcher());

  const navigate = useNavigate();

  if (isLoading) {
    return null;
  }

  if (isError || data === undefined) {
    console.error(error);
    return null;
  }

  const navToRoute = () => {
    navigate({
      pathname: '/routeview',
      search: `?${createSearchParams({ uid: route.docRef!.id })}`
    });
  };

  return (
    <Box width='100%'>
      <Pressable onPress={navToRoute} >
        <Flex flexDirection="row" justifyContent="space-between" >
          <Text>{data.name}</Text>
          <Text>{data.gradeDisplayString}</Text>
        </Flex>
      </Pressable>
    </Box>
  );
};