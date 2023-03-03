import { Box, Center, HStack } from 'native-base';
import { useState, useEffect } from 'react';
import { Post, User } from '../../xplat/types';
import { Pressable } from 'react-native';
import PostInFeed from '../Post/PostInFeed';

type setPostCallback = (post: Post) => void;
const ROW_LENGTH = 4;

const ProfilePostsGrid = ({ posts, setSelectedPost }:
  { posts: Post[], setSelectedPost: setPostCallback }) => {
  const [postGrid, setPostGrid] = useState<Post[][]>([]);

  useEffect(() => {
    const grid: Post[][] = [];
    let row: Post[] = [];
    for (let i = 0; i < posts.length; i++) {
      row.push(posts[i]);
      if (row.length === ROW_LENGTH) {
        grid.push(row);
        row = [];
      }
    }
    if (row.length > 0) {
      grid.push(row);
    }
    setPostGrid(grid);
  }, [posts]);


  return (
    <Center>
      {postGrid.map((row, index) => {
        return (
          <HStack key={index} space='4' width='100%' alignSelf='center' justifyContent='center'>
            {row.map((post) => {
              return (
                <Box key={post.docRef!.id} width='24%'>
                  <Pressable onPress={() => setSelectedPost(post)}>
                    <PostInFeed post={post} />
                  </Pressable>
                </Box>
              );
            })}
          </HStack>
        );
      })}
    </Center>
  );
};

export default ProfilePostsGrid;