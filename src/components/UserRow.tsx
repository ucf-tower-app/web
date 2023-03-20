import { Box, Flex, Text } from 'native-base';
import { User } from '../xplat/types/user';
import { useQuery } from 'react-query';
import { Pressable } from 'react-native';

type Props = {
  user: User;
  onPress: (docRefID: string) => void;
};
export const UserRow = ({ user, onPress }: Props) => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const myUID = user.docRef!.id;

  const { isLoading, isError, error, data } = useQuery(myUID, user.buildFetcher());

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
          <Text variant='displayname'>{data.displayName}</Text>
          <Box><Text variant='handle'>@{data.username}</Text></Box>
        </Flex>
      </Pressable>
    </Box>
  );
};