import {Box, Text, Avatar, Skeleton, HStack, FavouriteIcon, View} from 'native-base';
import { Post } from '../xplat/types/post';
import {useEffect, useState} from 'react';
import placeholder_image from '../placeholder_image.jpg';
import './css/feed.css';

const PostInFeed = ({post}: {post: Post}) => {
    const [body, setBody] = useState('');
    const [author, setAuthor] = useState('');
    const [hasImage, setHasImage] = useState(false);
    const [imageURL, setImageURL] = useState<string | undefined>();
    const [isLoaded, setIsLoaded] = useState(false);
    const [authorAvatar, setAuthorAvatar] = useState('');
    const [time, setTime] = useState<Date>();
    const [likes, setLikes] = useState(0);

    async function resolvePost() {
        let _body = post.getTextContent(), _author = post.getAuthor(), _hasImage = post.hasImageContent(),
            _imageURL = post.getImageContentUrl(), _time = post.getTimestamp(), _likes = post.getLikes();

        await Promise.all([_body, _author, _hasImage, _imageURL, _likes, _time]);
        _body.then( (text) => setBody(text))
        _hasImage.then( (bool) => setHasImage(bool));
        _imageURL.then( (url) => setImageURL(url));
        _time.then( (loadedTime) => setTime(loadedTime));
        _likes.then( (numberOfLikes) => setLikes(numberOfLikes.length));
        _author.then( (user) => {
            user.getUsername().then( (name) => setAuthor(name));
            user.getAvatarUrl().then( (url) => {
                setAuthorAvatar(url);
            })
            setIsLoaded(true);
        });
        

    }
    
    useEffect( () => {
        resolvePost();
    }, []);

    return (
       
        <Box m={2} background={'primary.100'} width='100%' borderRadius={'md'} borderWidth={1} p={3} alignSelf={'center'}>
            <HStack space={2} width='80%' marginBottom={1}>
                <Skeleton width={'32px'} height='32px' borderRadius='100%' isLoaded={isLoaded}><img src={placeholder_image} className='avatar' alt={author + ' avatar'}/></Skeleton>
                <Skeleton.Text isLoaded={isLoaded} lines={1}><Text variant={'handle'}>@{author}</Text></Skeleton.Text>
            </HStack>
            <Skeleton.Text lines={2} isLoaded={isLoaded} width='100%' marginBottom={1}>
                <Text flexWrap={'wrap'} noOfLines={4} fontSize='md'>{body}</Text>
            </Skeleton.Text>
            <Skeleton isLoaded={isLoaded} borderRadius='sm' height={20}>{hasImage && <img src={imageURL} className='post-thumbnail' alt='post'/>}</Skeleton>
            <HStack alignContent={'right'} right={0} justifyContent={'right'}>
                <Text fontSize={'sm'}>{likes}</Text>
                <FavouriteIcon alignSelf='center' size='xs'/>
            </HStack>
        </Box>
        
    )
}

export default PostInFeed;