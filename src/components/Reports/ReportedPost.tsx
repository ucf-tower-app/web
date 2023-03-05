import { Post, FetchedPost} from '../../xplat/types';
import { useQuery } from 'react-query';
import { Box, Text, HStack, FavouriteIcon, Pressable } from 'native-base';
import AuthorHandle from '../User/AuthorHandle';
import PostMedia from '../Post/PostMedia';

const ReportedPost = ({post}: {post: Post}) => {
  const {data, isLoading, isError} = useQuery<FetchedPost>(['post', post.getId()], () => post.fetch());

  if (isLoading)
    return <></>;
  if (isError)
    return <></>;
  if (data === undefined)
    return <></>;

  return (
    <Box p={1} background={'primary.200'} 
      width='40%' borderRadius={'md'} borderWidth={1} alignSelf={'center'}>
      <AuthorHandle author={data.author}/>
      <Text flexWrap={'wrap'} noOfLines={4} p={1} fontSize='md'>{data.textContent}</Text>
      {data.imageContentUrls.length > 0 && 
          <PostMedia imageContent={data.imageContentUrls} videoContent={data.videoContent === undefined ? undefined : 
            {
              videoURL: data.videoContent.videoUrl,
              thumbnailURL: data.videoContent.thumbnailUrl,
            }}/>}
      <HStack>
        <Box width={'80%'}>
          <Text fontSize={'sm'} color='gray.400'>{data.timestamp.toLocaleString()}</Text>
        </Box>
        <Pressable alignSelf={'right'} width={'20%'} alignContent={'right'} 
          right={0} justifyContent={'right'} justifyItems={'right'} flexDir='row'>
          <Text fontSize={'sm'}>{data.likes.length}</Text>
          <FavouriteIcon alignSelf='center' size='xs'/>
        </Pressable>
      </HStack>
    </Box>
  );
};

export default ReportedPost;