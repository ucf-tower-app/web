import {Box, Text, Skeleton, HStack, FavouriteIcon, Pressable} from 'native-base';
import { Post } from '../xplat/types/post';
import {useEffect, useState} from 'react';
import './css/feed.css';
import { User } from '../xplat/types/user';
import AuthorHandle from './AuthorHandle';
import PostImages from './PostImages';

const PostInFeed = ({post}: {post: Post}) => {
    const [body, setBody] = useState('');
    const [author, setAuthor] = useState<User>();
    const [imageCount, setImageCount] = useState(0);
    const [imageURLs, setImageURLs] = useState<(string | undefined)[]>();
    const [isLoaded, setIsLoaded] = useState(false);
    const [time, setTime] = useState<Date>();
    const [timeString, setTimeString] = useState('');
    const [likes, setLikes] = useState(0);

    async function resolvePost() {
        await post.getData();

        post.getTextContent().then(setBody);
        post.getImageContentUrls().then(setImageURLs);
        post.getImageCount().then(setImageCount);
        post.getAuthor().then(setAuthor);
        post.getLikes().then( (likesArray) => setLikes(likesArray.length));
        setIsLoaded(true);
    }
    
    useEffect( () => {
        resolvePost();
    }, []);

    return (
        <Box p={1} m={1} background={'primary.200'} width='100%' borderRadius={'md'} borderWidth={1} alignSelf={'center'}>
            <AuthorHandle author={author}/>
            <Skeleton.Text lines={2} isLoaded={isLoaded} width='100%' marginBottom={1}>
                <Text flexWrap={'wrap'} noOfLines={4} p={1} fontSize='md'>{body}</Text>
            </Skeleton.Text>
            <Skeleton isLoaded={isLoaded} borderRadius='sm' height={20}>{imageCount > 0 && <PostImages imageContent={imageURLs!}/>}</Skeleton>  
            <HStack>
                <Box width={'80%'}>
                    
                </Box>
                <Pressable alignSelf={'right'} width={'20%'} alignContent={'right'} right={0} justifyContent={'right'} justifyItems={'right'} flexDir='row'>
                    <Text fontSize={'sm'}>{likes}</Text>
                    <FavouriteIcon alignSelf='center' size='xs'/>
                </Pressable>
            </HStack>
            
        </Box>
    )
}

export default PostInFeed;