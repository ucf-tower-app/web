import { Box, Text, Skeleton, HStack, FavouriteIcon, Pressable } from 'native-base';
import { Post } from '../../xplat/types/post';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import '../css/feed.css';
import { User } from '../../xplat/types/user';
import AuthorHandle from '../User/AuthorHandle';
import PostImages from './PostImages';
import { buildPostFetcher } from '../../utils/queries';

const PostInFeed = ({ post }: { post: Post}) => {
    const { isLoading, isError, error, data } = useQuery(post.docRef!.id, buildPostFetcher(post));

    if (isLoading) {
        return (
            <Box p={1} m={1} background={'primary.200'}
                width='100%' borderRadius={'md'} borderWidth={1} alignSelf={'center'}>
                <Text>Loading...</Text>
            </Box>
        );
    }
    if (isError || data === undefined) {
        console.log(error);
        return null;
    }

    return (
        <Box p={1} m={1} background={'primary.200'} 
            width='100%' borderRadius={'md'} borderWidth={1} alignSelf={'center'}>
            <AuthorHandle author={data.author}/>
            <Text flexWrap={'wrap'} noOfLines={4} p={1} fontSize='md'>{data.body}</Text>
            {data.imageCount > 0 && <PostImages imageContent={data.imageURLs}/>}
            <HStack>
                <Box width={'80%'}>
                    <Text fontSize={'sm'} color='gray.400'>{data.timestamp.toLocaleString()}</Text>
                </Box>
                <Pressable alignSelf={'right'} width={'20%'} alignContent={'right'} 
                    right={0} justifyContent={'right'} justifyItems={'right'} flexDir='row'>
                    <Text fontSize={'sm'}>{data.likes}</Text>
                    <FavouriteIcon alignSelf='center' size='xs'/>
                </Pressable>
            </HStack>
        </Box>
    );
};

export default PostInFeed;
