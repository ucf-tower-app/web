import { Box, Text } from 'native-base';
import { Post } from '../xplat/types/post';
import { useState, useEffect } from 'react';
import { Comment } from '../xplat/types/comment';
import CommentDisplay from './PostDetailsComment';

const PostDetails = ({ post }: { post: Post | undefined }) => {
    const [comments, setComments] = useState<Comment[] | undefined>();

    useEffect(() => {
        const fetchComments = async () => {
            const commentsCursor = post?.getCommentsCursor();
            const tempComments: Comment[] = [];
            while ((await commentsCursor?.hasNext)) {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                tempComments.push((await commentsCursor?.pollNext())!);
            }
            setComments(tempComments);
        };
        fetchComments();
    }, [post]);

    return (
        <Box flexDir={'column'} margin={2} position='fixed' width={'22%'}>
            {post !== undefined ?
                <Box>
                    <Text alignSelf={'center'}>Comments</Text>
                    {comments === undefined || comments!.length === 0 ?
                        <Box marginTop={2}><Text alignSelf={'center'}>No comments just yet.</Text></Box>
                        :
                        comments?.map((value, index) => {
                            return (
                                <Box key={index} margin={2}>
                                    <CommentDisplay comment={value} />
                                </Box>
                            );
                        })
                    }
                </Box> :
                <Box>
                    <Text alignSelf={'center'}>No post selected</Text>
                </Box>}
        </Box>
    );
};

export default PostDetails;