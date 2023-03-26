import { Box, Flex, HStack, Text } from 'native-base';
import { Route } from '../xplat/types/route';
import { useQuery } from 'react-query';
import { createSearchParams, useNavigate } from 'react-router-dom';
import { Pressable } from 'react-native';

type Props = {
  route: Route;
};
export const RouteRow = ({ route }: Props) => {
  const navigate = useNavigate();

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const { isLoading, isError, error, data } = useQuery(route.docRef!.id, route.buildFetcher());

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
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      search: `?${createSearchParams({ uid: route.docRef!.id })}`
    });
  };

  return (
    <Box>
      <Pressable onPress={navToRoute}>
        <HStack justifyContent='space-between'>
          <Text p='2' fontSize='4xl'>{data.name}</Text>
          <Box justifyContent='center'>
            <Text p='2' fontSize='4xl'>{data.gradeDisplayString}</Text>
          </Box>
        </HStack>
      </Pressable>
    </Box>
  );
};