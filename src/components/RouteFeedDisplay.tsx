import { Box, Pressable } from 'native-base';
import { Forum } from '../xplat/types/forum';
import { Post } from '../xplat/types/post';
import { useState, useEffect } from 'react';
import PostInFeed from './Post/PostInFeed';

type callBackFunction = (post: Post) => void;

const RouteFeedDisplay = ({
    forum,
    setPostInParent,
}: {
  forum: Forum | undefined;
  setPostInParent: callBackFunction;
}) => {
    const [posts, setPosts] = useState<Post[]>();

    useEffect(() => {
        const fetchPosts = async () => {
            const postCursor = forum?.getPostsCursor();
            const tempPosts: Post[] = [];
            while((await postCursor?.hasNext())){
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                tempPosts.push((await postCursor?.pollNext())!);
            }
            setPosts(tempPosts);
        };
        fetchPosts();
    }, [forum]);

    return (
        <Box zIndex={10} width={'75%'}>
            {posts?.map((value, index) => {
                return (
                    <Pressable onPress={() => setPostInParent(value)} key={index}>
                        <PostInFeed post={value} />
                    </Pressable>
                );
            })}
        </Box>
    );
};

export default RouteFeedDisplay;
