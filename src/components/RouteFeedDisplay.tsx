import {Box, Text, Pressable} from 'native-base';
import { Forum } from '../xplat/types/forum';
import { Post } from '../xplat/types/post';
import { useState, useEffect} from 'react';
import PostInFeed from './PostInFeed';

type callBackFunction = (post: Post) => void;

const RouteFeedDisplay = ({forum, setPostInParent}: {forum: Forum | undefined, setPostInParent: callBackFunction},) => {
    const [posts, setPosts] = useState<Post[]>();
    
    useEffect(() => {
        forum?.getPosts().then((data) => {
            setPosts(data);
        });
    }, [forum]);

    return (
        <Box zIndex={10} width={'75%'}>
            {posts?.map( (value, index) => {
                return (
                    <Pressable onPress={() => setPostInParent(value)} key={index}>
                        <PostInFeed post={value}/>
                    </Pressable>
                );
            })}
        </Box>
    );
};

export default RouteFeedDisplay;