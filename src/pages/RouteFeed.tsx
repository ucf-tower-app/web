import {Box, Text, HStack, VStack, Divider, Center} from 'native-base';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { NavBar } from '../components/NavigationBar';
import RouteFeedDisplay from '../components/RouteFeedDisplay';
import { getRouteById } from '../xplat/api';
import { Forum } from '../xplat/types/forum';
import { Route } from '../xplat/types/route';
import { Post } from '../xplat/types/post';
import '../components/css/feed.css';
import PostDetails from '../components/Post/Comment/PostDetails';
import placeholder_image from '../placeholder_image.jpg';

const RouteFeed = () => {
    const [route, setRoute] = useState<Route>();
    const [routeName, setRouteName] = useState<string>();
    const [routeForum, setRouteForum] = useState<Forum>();
    const [setter, setSetter] = useState('');
    const [params, setParams] = useSearchParams();
    const [selectedPost, setSelectedPost] = useState<Post | undefined>();
    
    function setPostToView(passedPost: Post) {
        if (passedPost !== selectedPost)
            setSelectedPost(passedPost);
        else
            setSelectedPost(undefined);
    }

    // runs on component mount
    useEffect(() => {
        const uid = params.has('uid') ? params.get('uid') : 'none';
        if (uid !== 'none')
        {
            setRoute(getRouteById(uid!));
        }
    }, []);

    useEffect( () => {
        route?.getData();
        route?.getName().then( (name) => {
            setRouteName(name);
        });
        route?.getSetter().then( (user) => {
            user?.getUsername().then( (name) => setSetter(name));
        });
        route?.getForum().then( (forum) => {
            setRouteForum(forum);
        });
    }, [route]);

    return (
        <Box>
            <VStack>
                <NavBar/>
                <HStack top='50px' width={'100%'}>
                    <Box flexDir={'column'} width={'25%'} top={'100px'} position='fixed'>
                        <Center>
                            <Text fontSize={'2xl'} bold>{routeName}</Text>
                            {placeholder_image! && <img src={placeholder_image} className='route-avatar' alt='route'/>}
                            <Text> Set by {setter}</Text>
                        </Center>
                    </Box>
                    <Divider orientation='vertical' top={'100px'} left={'25%'} height={'75vh'} position='fixed'/>
                    <Box flexDir={'column'} left={'25%'} width={'50%'} top={'5vh'}>
                        <Center>
                            <RouteFeedDisplay forum={routeForum} setPostInParent={setPostToView}/>
                        </Center>
                    </Box>
                    <Divider orientation='vertical' top={'100px'} right={'25%'} height={'75vh'} position='fixed'/>
                    <Box flexDir={'column'} left={'25%'} width={'25%'} top={'5vh'}>
                        <PostDetails post={selectedPost}/>
                    </Box>
                </HStack>
            </VStack>
            
        </Box>
    );
};

export default RouteFeed;