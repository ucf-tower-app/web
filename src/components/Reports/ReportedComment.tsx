import { Comment, FetchedComment } from '../../xplat/types';
import { useQuery } from 'react-query';
import { Box, Text } from 'native-base';
import AuthorHandle from '../User/AuthorHandle';

const ReportedComment = ({comment}: {comment: Comment}) => {
  const {data, isLoading, isError} = useQuery<FetchedComment>(['comment', comment.getId()], () => comment.fetch());

  if (isLoading)
    return <></>;
  if (isError)
    return <></>;
  if (data === undefined)
    return <></>;

  return (
    <>
      <Box flexDir={'column'} p={1} background={'primary.200'} borderRadius={'md'} borderWidth={1}>
        <AuthorHandle author={data.author}/>
        <Text fontSize={'sm'}>{data.textContent}</Text>
        <Text fontSize={'xs'} color='gray.400'>{data.timestamp.toLocaleString()}</Text>
      </Box>
    </>
  );
};

export default ReportedComment;