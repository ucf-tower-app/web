import { useState, useEffect } from 'react';
import { Box, Pressable, ChevronRightIcon, ChevronLeftIcon, HStack, Text } from 'native-base';
import PostVideoDisplay from './PostVideoDisplay';
import '../css/feed.css';

type PostImagesProps = {
  imageContent?: (string | undefined)[],
  videoContent?: {
    videoURL: string,
    thumbnailURL: string
  }
};

type MediaContent = {
  type: 'image' | 'video',
  content: string,
  thunbnail?: string
};

const PostMedia = ({imageContent, videoContent}: PostImagesProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [mediaContent, setMediaContent] = useState<MediaContent[]>([]);

  useEffect( () => {
    const mediaContent: MediaContent[] = [];
    if (videoContent !== undefined)
    {
      console.log(videoContent);
      mediaContent.push({type: 'video', content: videoContent.videoURL, thunbnail: videoContent.thumbnailURL});
    }
    
    imageContent?.forEach( (image) => {
      if (image !== undefined)
        mediaContent.push({type: 'image', content: image});
    });
    setMediaContent(mediaContent);
    
  }, [imageContent, videoContent]);

  return (
    <Box>
      {mediaContent.length > 1 &&
        <Box position={'absolute'} backgroundColor={'#BDBDBD88'} p={0.5} borderRadius='sm' 
          width={'fit-content'} alignSelf='right' justifyContent={'right'} right={5}>
          <Text color='black'>{`${activeIndex + 1}/${mediaContent.length}`}</Text>
        </Box>}
      <HStack justifyContent={'center'}>
        {mediaContent.length > 1 &&
          <Pressable alignSelf={'center'} disabled={activeIndex === 0} onPress={() => {
            setActiveIndex( (currIndex) => currIndex - 1);
          }}>
            <ChevronLeftIcon color={activeIndex === 0 ? 'muted.400' : 'black'} size='lg' alignSelf='left' />
          </Pressable>}
        {mediaContent.length > 0 && (mediaContent[activeIndex].type === 'image' ? 
          <img className="post-thumbnail" src={mediaContent[activeIndex].content} alt='post'/>
          : 
          <PostVideoDisplay video={mediaContent[activeIndex].content} thumbnail={mediaContent[activeIndex].thunbnail}/>)
        }
        {mediaContent.length > 1 &&
          <Pressable alignSelf={'center'} disabled={activeIndex === mediaContent.length - 1} onPress={() => {
            setActiveIndex( (currIndex) => currIndex + 1);
          }}>
            <ChevronRightIcon color={activeIndex === mediaContent.length - 1 ? 'muted.400' : 'black'} size='lg'
              alignSelf='right'/>
          </Pressable>}
      </HStack>
    </Box>
  );
};

export default PostMedia;