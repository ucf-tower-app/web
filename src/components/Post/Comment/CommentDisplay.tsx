import { Comment } from '../../../xplat/types/comment';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { buildCommentFetcher } from '../../../utils/queries';
import { Box, Text, Skeleton } from 'native-base';
import '../../css/feed.css';
import { User } from '../../../xplat/types/user';
import AuthorHandle from '../../User/AuthorHandle';

const CommentDisplay = ({comment}: {comment: Comment}) => {
    const [author, setAuthor] = useState<User>();
    const [body, setBody] = useState('');
    const [postTime, setPostTime] = useState<string>();
    const { isLoading, error, data } = useQuery(comment.docRef!.id, buildCommentFetcher(comment));

    useEffect( () => {
        if (data)
        {
            setAuthor(data.author);
            setBody(data.body);
            setPostTime(data.timestamp?.toLocaleString());
        }
    }, [data]);


    return (
        <Box flexDir={'column'} p={1} background={'primary.200'} borderRadius={'md'} borderWidth={1}>
            <Skeleton isLoaded={author !== undefined} w='100%'>
                <AuthorHandle author={author!}/>
            </Skeleton>
            <Text fontSize={'sm'}>{body}</Text>
            <Text fontSize={'xs'} color='gray.400'>{postTime}</Text>
        </Box>
    );
};

export default CommentDisplay;