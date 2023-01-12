import { useState, useEffect } from "react";
import { Box, Pressable, ChevronRightIcon, ChevronLeftIcon, HStack, Text, ZStack } from 'native-base';
import './css/feed.css';

const PostImages = ({imageContent}: {imageContent: (string | undefined)[]}) => {
    const [imageCount, setImageCount] = useState(0);
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect( () => {
        if (imageContent !== undefined)
        {
            setImageCount(imageContent!.length);

        }
            
    }, [imageContent]);

    return (
        <Box>
            {imageCount > 1 &&
            <Box position={'absolute'} backgroundColor={'#BDBDBD88'} p={0.5} borderRadius='sm' width={'fit-content'} alignSelf='right' justifyContent={'right'} right={10}>
                <Text color='black'>{`${activeIndex + 1}/${imageCount}`}</Text>
            </Box>}
            <HStack justifyContent={'center'}>
                {imageCount > 1 &&
                <Pressable alignSelf={'center'} disabled={activeIndex === 0} onPress={() => {
                    setActiveIndex( (currIndex) => currIndex - 1);
                }}>
                    <ChevronLeftIcon color={activeIndex === 0 ? 'muted.400' : 'black'} size='lg' alignSelf={'center'} />
                </Pressable>}
                <img className="post-thumbnail" src={imageContent?.at(activeIndex)} alt='post'/>
                {imageCount > 1 &&
                <Pressable alignSelf={'center'} disabled={activeIndex === imageCount - 1} onPress={() => {
                    setActiveIndex( (currIndex) => currIndex + 1);
                }}>
                    <ChevronRightIcon color={activeIndex === imageCount - 1 ? 'muted.400' : 'black'} size='lg'/>
                </Pressable>}
            </HStack>
        </Box>
    )
}

export default PostImages;