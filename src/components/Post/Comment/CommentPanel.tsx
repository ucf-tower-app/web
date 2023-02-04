import { Box, Text, Button } from 'native-base';
import { Post } from '../../../xplat/types/post';
import { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { Comment } from '../../../xplat/types/comment';
import CommentDisplay from './CommentDisplay';
import { buildCommentListFetcher } from '../../../utils/queries';
import { QueryCursor } from '../../../xplat/types/queryCursors';
import { CURSOR_INCREMENT } from '../../../utils/constants';

const CommentPanel = ({ post }: { post: Post | undefined }) => {
  const [comments, setComments] = useState<Comment[] | undefined>();
  const [commentsCursor, setCommentsCursor] = useState<QueryCursor<Comment>>();
  const [hasMoreComments, setHasMoreComments] = useState<boolean>(false);
  const { isLoading, isError, data } = useQuery(['comments', post?.docRef!.id], buildCommentListFetcher(post!), 
    { 
      enabled: post !== undefined 
    });

  async function fetchMoreComments() {
    if (commentsCursor !== undefined && hasMoreComments)
    {
      let more: boolean = hasMoreComments;
      const newComments: Comment[] = [];
      while(more && newComments.length < CURSOR_INCREMENT)
      {
        const next = await commentsCursor.pollNext();
        if (next)
        {
          newComments.push(next);
        }
        more = await commentsCursor.hasNext();
      }
      setHasMoreComments(more);
      if (comments)
      {
        setComments([...comments, ...newComments]);
      }
      else
      {
        setComments(newComments);
      }
    }
  }

  useEffect(() => {
    if (data !== undefined)
    {
      setComments(data.comments);
      setCommentsCursor(data.commentCursor);
      setHasMoreComments(data.hasNext);
    }
  }, [data]);

  if (isLoading)
  {
    return (
      <Box flexDir={'column'} margin={2} position='fixed' width={'22%'}>
        <Text alignSelf={'center'}>Loading comments...</Text>
      </Box>
    );
  }

  if (isError)
  {
    return (
      <Box flexDir={'column'} margin={2} position='fixed' width={'22%'}>
        <Text alignSelf={'center'}>Error loading comments.</Text>
      </Box>
    );
  }

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
          {hasMoreComments && 
                        <Button onPress={fetchMoreComments}><Text variant='button'>Load More</Text></Button>}
        </Box> :
        <Box>
          <Text alignSelf={'center'}>No post selected</Text>
        </Box>}
    </Box>
  );
};

export default CommentPanel;