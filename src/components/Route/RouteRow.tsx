import { Box, HStack, Text } from 'native-base';
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
    <Box>
      <Pressable onPress={() => onPress(myUID)}>
        <HStack justifyContent='space-between'>
          <Text p='2' fontSize={{
            base: 'md',
            lg: 'lg',
            xl: 'xl'
          }}>{data.name}</Text>
          <Box justifyContent='center'>
            <Text p='2' fontSize={{
              base: 'md',
              lg: 'lg',
              xl: 'xl'
            }}>{data.gradeDisplayString}</Text>
          </Box>
        </HStack>
      </Pressable>
    </Box>
  );
};