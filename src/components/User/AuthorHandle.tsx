import { User } from '../../xplat/types/user';
import { HStack, Text, Pressable, Skeleton } from 'native-base';
import { useQuery } from 'react-query';
import '../css/feed.css';
import { useNavigate, createSearchParams } from 'react-router-dom';
import { buildUserFetcher } from '../../utils/queries';

const AuthorHandle = ({ author }: { author: User }) => {
    const { isLoading, isError, data } = useQuery(author.docRef!.id, buildUserFetcher(author));
    const navigate = useNavigate();
    const navigateToProfile = () => {
        if (window.location.pathname === '/profile/?uid=' + author?.docRef?.id) {
            return;
        }
        if (author) {
            navigate(`/profile?${createSearchParams({ uid: author.docRef!.id })}`);
        }
    };

    if (isLoading) {
        return (
            <HStack space={1}>
                <Skeleton borderRadius={'100'} width='8%' isLoaded={false} />
                <Skeleton.Text lines={1} width='60%' alignSelf={'center'} />
                <Skeleton.Text lines={1} width='60%' alignSelf={'center'} />
            </HStack>
        );
    }

    if (isError || data === undefined) {
        return (
            <HStack space={1}>
                <Skeleton borderRadius={'100'} width='8%' isLoaded={false} />
                <Skeleton.Text lines={1} width='60%' alignSelf={'center'} />
                <Skeleton.Text lines={1} width='60%' alignSelf={'center'} />
            </HStack>
        );
    }

    return (
        <Pressable onPress={navigateToProfile}>
            <HStack space={1}>
                <img className='avatar' src={data.avatarUrl} alt='avatar' />
                <Text variant='displayname'>{data.displayName}</Text>
                <Text variant='handle'>@{data.username}</Text>
            </HStack>
        </Pressable>
    );
};

export default AuthorHandle;