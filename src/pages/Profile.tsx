import { Box, Divider, VStack, Text, Button, Skeleton } from 'native-base';
import { useEffect, useState } from 'react';
import { Post, QueryCursor } from '../xplat/types/types';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import ProfileBanner from '../components/Profile/ProfileBanner';
import ProfilePostsGrid from '../components/Profile/ProfilePostsGrid';
import { NavBar } from '../components/NavigationBar';
import { buildUserByIDFetcher } from '../utils/queries';
import { CURSOR_INCREMENT } from '../utils/constants';

const Profile = ({userOverride}: {userOverride?: string}) => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [postCursor, setPostCursor] = useState<QueryCursor<Post>>();
    const [hasMorePosts, setHasMorePosts] = useState(false);
    const [selectedPost, setSelectedPost] = useState<Post | undefined>();
    const [searchParams] = useSearchParams();
    const {isLoading, isError, data} = 
        useQuery(['userprofile', {uid: userOverride ? userOverride : searchParams.get('uid')}], 
            buildUserByIDFetcher(userOverride ? userOverride : searchParams.get('uid')!));

    const handlePostClick = (post: Post) => {
        if (post === selectedPost)
        {
            setSelectedPost(undefined);
        }
        else
        {
            setSelectedPost(post);
        }
    };

    async function getMorePosts() {
        if (!postCursor || !hasMorePosts) {
            return;
        }
        const tempPosts: Post[] = [];
        let hasNext = await postCursor.hasNext();
        while(hasNext && tempPosts.length < CURSOR_INCREMENT){
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const next = await postCursor.pollNext()!;
            tempPosts.push(next);
            hasNext = await postCursor.hasNext();
        }
        setHasMorePosts(hasNext);
        setPosts([...posts, ...tempPosts]);
    }


    useEffect(() => {
        if (data !== undefined)
        {
            setPostCursor(data.postCursor);
            setPosts(data.posts);
            setHasMorePosts(data.hasMorePosts);
        }
    }, [data]);

    if (isLoading)
    {
        return (
            <VStack>
                <NavBar/>
                <Skeleton top='50px' width='100%' height='200px'/>
                <Divider orientation='horizontal' top='45px'/>
                <Box p='2' top='50px' justifyItems='center' alignContent='center'>
                    <Skeleton height='100px' width='100%'/>
                </Box>
            </VStack>
        );
    }

    if (isError || data === undefined)
    {
        return (
            <Box flexDir={'column'} margin={2} position='fixed' width={'22%'}>
                <Text>Error loading user</Text>
            </Box>
        );
    }
    return (
        <>
            <VStack>
                <NavBar/>
                <Box top='50px' width='100%'>
                    <ProfileBanner user={data}/>
                </Box>
                <Divider orientation='horizontal' top='45px'/>
                <Box p='2' top='50px' justifyItems='center' alignContent='center'>
                    <ProfilePostsGrid posts={posts} setSelectedPost={setSelectedPost}/>
                    {hasMorePosts && <Button onPress={getMorePosts}><Text variant='button'>Load More</Text></Button>}
                </Box>
            </VStack>
        </>
    );
};

export default Profile;