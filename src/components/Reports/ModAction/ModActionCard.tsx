import { useQuery } from 'react-query';
import { ModAction } from '../../../xplat/types';
import { Box, Divider, Text, Link } from 'native-base';
import { useNavigate, createSearchParams } from 'react-router-dom';

const ModActionCard = ({
  action,
  index,
}: {
  action: ModAction;
  index: number;
}) => {
  const { data, isLoading, isError } = useQuery(['modAction', index], () =>
    action.fetch()
  );
  const nav = useNavigate();
  const navToProfile = (uid: string) => {
    nav(`/profile?${createSearchParams({ uid: uid })}`);
  };

  if (isLoading) {
    return (
      <Box>
        <Text>Loading mod action details</Text>
      </Box>
    );
  }

  if (data === undefined || isError) {
    return (
      <Box>
        <Text>Error loading mod action details.</Text>
      </Box>
    );
  }

  return (
    <Box
      bg='secondary.300'
      rounded='md'
      m='1'
      p='1'
      zIndex={0}
      borderColor='secondary.400'
      borderWidth={2}
    >
      <Text variant='header' bold>
        {data.timestamp.toLocaleTimeString()}
      </Text>
      <Divider orientation='horizontal' color='black' />
      <Text variant='body'>
        User moderated:{' '}
        <Link
          onPress={() => {
            if (data.userModerated === undefined) return;
            navToProfile(data.userModerated.getId());
          }}
        >
          {data.userModeratedUsername}
        </Link>
      </Text>
      <Text variant='body'>
        Moderated by:{' '}
        <Link
          onPress={() => {
            if (data.moderator === undefined) return;
            navToProfile(data.moderator.getId());
          }}
        >
          {data.moderatorUsername}
        </Link>
      </Text>
      <Text variant='body'>Reason: {data.modReason}</Text>
    </Box>
  );
};

export default ModActionCard;
