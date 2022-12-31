import {Box, Text, Image} from 'native-base';
import { Forum } from '../xplat/types/forum';
import { Post } from '../xplat/types/post';
import { useState, useEffect} from 'react';
import PostInFeed from './PostInFeed';

const RouteFeedDisplay = ({forum}: {forum: Forum | undefined}) => {
    const [posts, setPosts] = useState<Post[]>();
    
    useEffect(() => {
        forum?.getPosts().then((data) => {
            setPosts(data);
        });
    }, [forum]);

    
    return (
        <Box zIndex={10} width={'75%'}>
            <Text fontSize={'xl'} alignSelf='center'>Feed</Text>
            {posts?.map( (post, index) => {
                return (
                    <PostInFeed post={post} key={index}/>
                )
            })}
        </Box>
    )
}

export default RouteFeedDisplay;