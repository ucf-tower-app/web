import { Box, Divider, VStack } from 'native-base';
import { useEffect, useState } from 'react';
import { User, Post } from '../xplat/types/types';
import { useSearchParams } from 'react-router-dom';
import { getUserById } from '../xplat/api';
import ProfileBanner from '../components/Profile/ProfileBanner';
import ProfilePostsGrid from '../components/Profile/ProfilePostsGrid';
import { NavBar } from '../components/NavigationBar';

const Profile = ({userOverride}: {userOverride?: string}) => {
    const [user, setUser] = useState<User>();
    const [posts, setPosts] = useState<Post[]>([]);
    const [selectedPost, setSelectedPost] = useState<Post | undefined>();
    const [searchParams] = useSearchParams();

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

    useEffect(() => {
        if (userOverride !== undefined)
        {
            setUser(getUserById(userOverride));
            return;
        }
        if (searchParams.has('uid'))
        {
            const uid = searchParams.get('uid');
            if (uid)
            {
                setUser(getUserById(uid));
            }
            else
            {
                import('react-router-dom').then(({useNavigate}) => {
                    const navigate = useNavigate();
                    navigate('/usernotfound');
                });
            }
        }
    }, []);

    useEffect(() => {
        const getData = async () => {
            user?.getData().then( () => {
                setPosts(user.posts!);
            });
        };
        getData();
    }, [user]);

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
                </Box>
            </VStack>
        </>
    );
};

export default Profile;