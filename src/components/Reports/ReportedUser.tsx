import { User } from '../../xplat/types';
import { useQuery } from 'react-query';
import { Box, HStack, Text } from 'native-base';

const ReportedUser = ({user}: {user: User}) => {
  const {data, isLoading, isError} = useQuery(user.getId(), () => user.fetch());

  if (isLoading)
  {
    return (
      <Box bg='primary.200' p={1} rounded='md' w='40%' borderColor='black' borderWidth='1'>
        <Text>
          Loading user details
        </Text>
      </Box>
    );
  }

  if (data === undefined || isError)
  {
    return (
      <Box bg='primary.200' p={1} rounded='md' w='40%' borderColor='black' borderWidth='1'>
        <Text>
          Error loading user details.
        </Text>
      </Box>
    );
  }

  return (
    <Box bg='primary.200' p={1} rounded='md' w='40%' borderColor='black' borderWidth='1'>
      <HStack>
        <img src={data.avatarUrl} className='avatar' alt='reported user avatar'/>
        <Text variant='displayname'>{data.displayName}</Text>
        <Text variant='handle'>@{data.username}</Text>
      </HStack>
      {data.bio}
    </Box>
  );
};

export default ReportedUser;