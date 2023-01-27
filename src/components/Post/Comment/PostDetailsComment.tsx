import { Comment } from '../../../xplat/types/comment';
import { useEffect, useState } from 'react';
import { Box, Text } from 'native-base';
import './css/feed.css';
import { User } from '../../../xplat/types/user';
import AuthorHandle from '../../User/AuthorHandle';

const CommentDisplay = ({comment}: {comment: Comment}) => {
    const [author, setAuthor] = useState<User>();
    const [body, setBody] = useState('');
    const [postTime, setPostTime] = useState<string>();

    useEffect( () => {
        comment?.getTextContent().then( (text) => setBody(text));
        comment?.getAuthor().then(setAuthor);
        // comment?.getTimestamp().then( (val) => {
        // })
    }, [comment]);


    return (
        <Box flexDir={'column'} p={1} background={'primary.200'} borderRadius={'md'} borderWidth={1}>
            <AuthorHandle author={author}/>
            <Text fontSize={'sm'}>{body}</Text>
            <Text fontSize={'xs'} color='gray.400'>{postTime}</Text>
        </Box>
    );
};

export default CommentDisplay;