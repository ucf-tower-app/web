import { Box, Divider, VStack, Text, Button } from 'native-base';
import { useEffect, useState } from 'react';
import { User, Post, QueryCursor } from '../xplat/types/types';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { getUserById } from '../xplat/api';
import ProfileBanner from '../components/Profile/ProfileBanner';
import ProfilePostsGrid from '../components/Profile/ProfilePostsGrid';
import { NavBar } from '../components/NavigationBar';
import { buildUserByIDFetcher } from '../utils/queries';
import { CURSOR_INCREMENT } from '../utils/constants';

const Profile = ({userOverride}: {userOverride?: string}) => {
    const [user, setUser] = useState<User>();
    const [posts, setPosts] = useState<Post[]>([]);
    const [postCursor, setPostCursor] = useState<QueryCursor<Post>>();
    const [hasMorePosts, setHasMorePosts] = useState(false);
    const [selectedPost, setSelectedPost] = useState<Post | undefined>();
    const [searchParams] = useSearchParams();
    const {isLoading, error, data} = 
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
            setUser(data.userObject);
            setPostCursor(data.postCursor);
            setPosts(data.posts);
            setHasMorePosts(data.hasMorePosts);
        }
    }, [data]);

    return (
        <>
            <VStack>
                <NavBar/>
                <Box top='50px' width='100%'>
                    <ProfileBanner user={user}/>
                </Box>
                <Divider orientation='horizontal' top='45px'/>
                <Box p='2' top='50px' justifyItems='center' alignContent='center'>
                    <ProfilePostsGrid user={user!} posts={posts} setSelectedPost={setSelectedPost}/>
                    {hasMorePosts && <Button onPress={getMorePosts}><Text variant='button'>Load More</Text></Button>}
                </Box>
            </VStack>
        </>
    );
};

export default Profile;