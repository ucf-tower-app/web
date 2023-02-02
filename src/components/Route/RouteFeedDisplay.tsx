import { Box, Pressable, Button, Text } from 'native-base';
import { Forum } from '../../xplat/types/forum';
import { Post } from '../../xplat/types/post';
import { useState, useEffect } from 'react';
import PostInFeed from '../Post/PostInFeed';
import { QueryCursor } from '../../xplat/types/queryCursors';
import { useQuery } from 'react-query';
import { CURSOR_INCREMENT, INITIAL_CURSOR_SIZE } from '../../utils/constants';
import { buildForumFetcher } from '../../utils/queries';

type callBackFunction = (post: Post) => void;

const RouteFeedDisplay = ({
    forum,
    setPostInParent,
}: {
  forum: Forum;
  setPostInParent: callBackFunction;
}) => {
    const [posts, setPosts] = useState<Post[]>();
    const [postCursor, setPostCursor] = useState<QueryCursor<Post>>();
    const [hasMorePosts, setHasMorePosts] = useState(true);
    const { isLoading, error, data } = useQuery(forum.docRef!.id,buildForumFetcher(forum));

    async function fetchMorePosts() {
        if (!hasMorePosts || !postCursor) {
            return;
        }
        const tempPosts: Post[] = [];
        let hasNext = await postCursor.hasNext();
        while((hasNext) && tempPosts.length < CURSOR_INCREMENT){
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            tempPosts.push((await postCursor.pollNext())!);
            hasNext = await postCursor.hasNext();
        }
        setHasMorePosts(hasNext);
        if (posts) {
            setPosts([...posts, ...tempPosts]);
        }
        else {
            setPosts(tempPosts);
        }
    }
    useEffect(() => {
        if (data !== undefined) {
            setPosts(data.posts);
            setPostCursor(data.postCursor);
            setHasMorePosts(data.hasMore);
        }
    }, [data]);

    return (
        <Box zIndex={10} width={'75%'}>
            {posts?.map((value, index) => {
                return (
                    <Pressable onPress={() => setPostInParent(value)} key={index}>
                        <PostInFeed post={value} />
                    </Pressable>
                );
            })}
            { hasMorePosts && !isLoading  && 
                <Button m='1' alignSelf='center' onPress={fetchMorePosts} disabled={isLoading}>
                    <Text variant='button'>Load more posts</Text>
                </Button>
            }
        </Box>
    );
};

export default RouteFeedDisplay;
