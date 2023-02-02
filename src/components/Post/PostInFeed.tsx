import { Box, Text, Skeleton, HStack, FavouriteIcon, Pressable } from 'native-base';
import { Post } from '../../xplat/types/post';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import '../css/feed.css';
import { User } from '../../xplat/types/user';
import AuthorHandle from '../User/AuthorHandle';
import PostImages from './PostImages';
import { buildPostFetcher } from '../../utils/queries';

const PostInFeed = ({ post, _passAuthor }: { post: Post, _passAuthor?: User | undefined }) => {
    const [body, setBody] = useState('');
    const [author, setAuthor] = useState<User>();
    const [imageCount, setImageCount] = useState(0);
    const [imageURLs, setImageURLs] = useState<Array<string | undefined>>();
    const [videoURL, setVideoURL] = useState<string | undefined>();
    const [videoThumbnail, setVideoThumbnail] = useState<string | undefined>();
    const [timestamp, setTimestamp] = useState<Date>();
    const [likes, setLikes] = useState(0);
    const { isLoading, error, data } = useQuery(post.docRef!.id, buildPostFetcher(post));

    useEffect(() => {
        if (data !== undefined)
        {
            setBody(data.body);
            setImageCount(data.imageCount);
            setLikes(data.likes);
            setAuthor(data.author);
            setImageURLs(data.imageURLs);
            setImageCount(data.imageCount);
            setTimestamp(data.timestamp);
            if (data.videoContent)
            {
                setVideoURL(data.videoContent.videoURL);
                setVideoThumbnail(data.videoContent.thumbnailURL);
            }
        }
    }, [data]);

    return (
        <Box p={1} m={1} background={'primary.200'} 
            width='100%' borderRadius={'md'} borderWidth={1} alignSelf={'center'}>
            <Skeleton isLoaded={author !== undefined} w='100%'>
                <AuthorHandle author={author!}/>
            </Skeleton>
            <Skeleton.Text lines={2} isLoaded={!isLoading} width='100%' marginBottom={1}>
                <Text flexWrap={'wrap'} noOfLines={4} p={1} fontSize='md'>{body}</Text>
            </Skeleton.Text>
            <Skeleton isLoaded={!isLoading} borderRadius='sm' height={20}>
                {imageCount > 0 && <PostImages imageContent={imageURLs!}/>}
            </Skeleton>
            <HStack>
                <Box width={'80%'}>
                    <Skeleton.Text isLoaded={!isLoading} borderRadius='sm'>
                        <Text fontSize={'sm'} color='gray.400'>{timestamp?.toLocaleString()}</Text>
                    </Skeleton.Text>
                </Box>
                <Pressable alignSelf={'right'} width={'20%'} alignContent={'right'} 
                    right={0} justifyContent={'right'} justifyItems={'right'} flexDir='row'>
                    <Text fontSize={'sm'}>{likes}</Text>
                    <FavouriteIcon alignSelf='center' size='xs'/>
                </Pressable>
            </HStack>
        </Box>
    );
};

export default PostInFeed;
