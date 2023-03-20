import { Box, Flex, Text } from 'native-base';
import { Route } from '../../xplat/types/route';
import { useQuery } from 'react-query';
import { Pressable } from 'react-native';

type Props = {
  route: Route;
  onPress: (docRefID: string) => void;
};
export const RouteRow = ({ route, onPress }: Props) => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const myUID: string = route.docRef!.id;

  const { isLoading, isError, error, data } = useQuery(myUID, route.buildFetcher());

  if (isLoading) {
    return null;
  }

  if (isError || data === undefined) {
    console.error(error);
    return null;
  }

  return (
    <Box width='100%'>
      <Pressable onPress={() => onPress(myUID)} >
        <Flex flexDirection="row" justifyContent="space-between" >
          <Text>{data.name}</Text>
          <Text>{data.gradeDisplayString}</Text>
        </Flex>
      </Pressable>
    </Box>
  );
};