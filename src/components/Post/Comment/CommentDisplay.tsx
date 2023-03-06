import { Comment } from '../../../xplat/types/comment';
import { useQuery } from 'react-query';
import { buildCommentFetcher } from '../../../utils/queries';
import { Box, Text, Skeleton, HStack } from 'native-base';
import '../../css/feed.css';
import AuthorHandle from '../../User/AuthorHandle';
import ReportButton from '../../Reports/ReportButton';

const CommentDisplay = ({comment}: {comment: Comment}) => {
  const { isLoading, isError, data } = useQuery(comment.docRef!.id, buildCommentFetcher(comment));

  if (isLoading) {
    return (
      <Box flexDir={'column'} p={1} background={'primary.200'} borderRadius={'md'} borderWidth={1}>
        <Skeleton w='100%'/>
        <Skeleton.Text/>
        <Skeleton.Text/>
      </Box>
    );
  }
  if (isError || data === undefined) {
    return null;
  }

  return (
    <Box flexDir={'column'} p={1} background={'primary.200'} borderRadius={'md'} borderWidth={1}>
      <HStack justifyContent='space-between'>
        <AuthorHandle author={data.author}/>
        <ReportButton content={comment}/>
      </HStack>
      <Text fontSize={'sm'}>{data.body}</Text>
      <Text fontSize={'xs'} color='gray.400'>{data.timestamp.toLocaleString()}</Text>
    </Box>
  );
};

export default CommentDisplay;