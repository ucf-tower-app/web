import { Box, Flex, Text } from 'native-base';
import { User } from '../xplat/types/user';
import { useQuery } from 'react-query';
import { createSearchParams, useNavigate } from 'react-router-dom';
import { Pressable } from 'react-native';

type Props = {
  user: User;
};
export const UserRow = ({ user }: Props) => {
  const navigate = useNavigate();

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const { isLoading, isError, error, data } = useQuery(user.docRef!.id, user.buildFetcher());

  if (isLoading) {
    return null;
  }

  if (isError || data === undefined) {
    console.error(error);
    return null;
  }

  const navToProfile = () => {
    navigate({
      pathname: '/profile',
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      search: `?${createSearchParams({ uid: user.docRef!.id })}`
    });
  };

  return (
    <Box width='100%'>
      <Pressable onPress={navToProfile} >
        <Flex flexDirection="row" justifyContent="space-between" >
          <Text>{data.displayName}</Text>
          <Text>{data.username}</Text>
        </Flex>
      </Pressable>
    </Box>
  );
};