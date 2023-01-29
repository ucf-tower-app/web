import { useState, useEffect } from 'react';
import { Box, HStack, Text, Center, VStack, Skeleton, Select, Button, Modal } from 'native-base';
import { User, Post } from '../../xplat/types/types';
import { getCurrentUser } from '../../xplat/api';
import '../css/feed.css';

const ProfileBanner = ({user}: {user: User | undefined}) => {
    const [username, setUsername] = useState<string>();
    const [displayName, setDisplayName] = useState<string>();
    const [avatar, setAvatar] = useState<string>();
    const [followers, setFollowers] = useState<number>(0);
    const [bio, setBio] = useState<string>();
    const [following, setFollowing] = useState<number>(0);
    const [userAuth, setUserAuth] = useState<number>(0);
    const [editPermissionModal, setEditPermissionModal] = useState<boolean>(false);

    const handleEditPermission = () => {
        console.log('edit permission');
    };


    useEffect(() => {
        getCurrentUser()
            .then((user) => {
                user?.getStatus().then(setUserAuth);
            });
        if (user && user.hasData)
        {
            setUsername(user.username);
            setDisplayName(user.displayName);
            setFollowers(user.followers!.length);
            setBio(user.bio);
            setFollowing(user.following!.length);
            user?.getAvatarUrl().then(setAvatar);
        }
    }, [user?.hasData]);

    return (
        <>
            <Modal isOpen={editPermissionModal} justifyContent='center' alignItems='center'
                onClose={() => setEditPermissionModal(false)} height='fill' position='fixed'>
                <Modal.Content maxWidth='400px'>
                    <Modal.CloseButton/>
                    <Modal.Header>Edit User Permissions</Modal.Header>
                    <Modal.Body>
                        <Select defaultValue={'' + user?.status}>
                            <Select.Item label='Read-Only' value='0'/>
                            <Select.Item label='Read-Write' value='1'/>
                            <Select.Item label='Approved' value='2'/>
                            {userAuth === 4 && <Select.Item label='Employee' value='3'/>}
                        </Select>
                        <Button onPress={handleEditPermission} marginTop='1'>
                            <Text variant='button'>Confirm</Text>
                        </Button>
                    </Modal.Body>
                    
                </Modal.Content>
            </Modal>
            <HStack space={2} p={2}>
                
                <Skeleton isLoaded={avatar !== undefined} borderRadius='100%' width='15%'>
                    <img src={avatar} className='avatar-profile' alt='avatar'/>
                </Skeleton>
                <VStack width='85%'>
                    <HStack>
                        <Text variant='profileName'>
                            {displayName}
                        </Text>
                        <Text variant='profileHandle'>
                            @{username}
                        </Text>
                    </HStack>
                    <Text variant='profileBio'>
                        {bio}
                    </Text>
                    <HStack space='1'>
                        <Text variant='profileStat'>
                            {followers} Followers
                        </Text>
                        <Text variant='profileStat'>
                            {following} Following
                        </Text>
                    </HStack>
                    <Button position='absolute' bottom={2} onPress={() => setEditPermissionModal(true)}>
                        <Text variant='button'>Edit User Permissions</Text>
                    </Button>
                </VStack>
            </HStack>
        </>
    );
};

export default ProfileBanner;