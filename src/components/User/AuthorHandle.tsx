import { useState, useEffect } from 'react';
import { User } from '../../xplat/types/user';
import { HStack, Text, Pressable, Skeleton } from 'native-base';
import { useQuery } from 'react-query';
import '../css/feed.css';
import { useNavigate, createSearchParams } from 'react-router-dom';
import { buildUserFetcher } from '../../utils/queries';

const AuthorHandle = ({author}: {author: User}) => {
    // TODO: Implement clickable handle that will direct to author profile
    const [username, setUsername] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [avatarURL, setAvatarURL] = useState<string | undefined>();
    const [isLoaded, setIsLoaded] = useState(false);
    const { isLoading, error, data } = useQuery(author.docRef!.id, buildUserFetcher(author));
    const navigate = useNavigate();
    const navigateToProfile = () => {
        if (window.location.pathname === '/profile/?uid=' + author?.docRef?.id)
        {
            return;
        }
        if (author)
        {
            navigate(`/profile?${createSearchParams({uid: author.docRef!.id})}`);
        }
    };
    
    useEffect( () => {
        if (data && !error)
        {
            setUsername(data.username);
            setDisplayName(data.displayName);
            setAvatarURL(data.avatarUrl);
            setIsLoaded(true);
        }
    }, [data]);

    return (
        <Pressable onPress={navigateToProfile}>
            <HStack space={1}>
                <Skeleton borderRadius={'100'} width='8%' isLoaded={avatarURL !== undefined}>
                    <img className='avatar' src={avatarURL!} alt='avatar'/>
                </Skeleton>
                <Skeleton.Text isLoaded={isLoaded} lines={1} width='60%' alignSelf={'center'}>
                    <Text variant='displayname'>{displayName}</Text>
                </Skeleton.Text>
                <Skeleton.Text isLoaded={isLoaded} lines={1} width='60%' alignSelf={'center'}>
                    <Text variant='handle'>@{username}</Text>
                </Skeleton.Text>
            </HStack>
        </Pressable>
    );
};

export default AuthorHandle;