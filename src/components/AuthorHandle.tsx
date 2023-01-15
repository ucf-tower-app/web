import { useState, useEffect } from 'react';
import { User } from '../xplat/types/user';
import { HStack, Text, Pressable, Skeleton } from 'native-base';
import placeholder_image from '../placeholder_image.jpg';
import './css/feed.css';

const AuthorHandle = ({author}: {author: User | undefined}) => {
    // TODO: Implement clickable handle that will direct to author profile
    const [name, setName] = useState('');
    const [avatarURL, setAvatarURL] = useState<string | undefined>();
    const [isLoaded, setIsLoaded] = useState(false);
    
    useEffect( () => {
        const getData = async () => {
            await author?.getData();
            author?.getUsername().then(setName);
            author?.getAvatarUrl().then(setAvatarURL);
            setIsLoaded(true);
        };
        getData();
    }, [author]);

    return (
        <HStack space={1}>
            <Skeleton borderRadius={'100'} width='8%' isLoaded={avatarURL !== undefined}>
                <img className='avatar' src={avatarURL!} alt='avatar'/>
            </Skeleton>
            <Skeleton.Text isLoaded={isLoaded} lines={1} width='60%' alignSelf={'center'}>
                <Text variant='handle'>@{name}</Text>
            </Skeleton.Text>
        </HStack>
    );
};

export default AuthorHandle;