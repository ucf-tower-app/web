import { useState, useEffect } from 'react';
import { Box, HStack, Text, Input, VStack, Skeleton, Select, Button, Radio } from 'native-base';
import { User } from '../../xplat/types/types';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
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
    const [promoteOrDemote, setPromoteOrDemote] = useState<string>('promote');
    const [editPermissionModal, setEditPermissionModal] = useState<boolean>(false);
    const [profilePermission, setProfilePermission] = useState<number>(0);
    const [newPermission, setNewPermission] = useState<number>(0);
    const [actionDescription, setActionDescription] = useState<string>('');

    const handleEditPermission = () => {
        setEditPermissionModal(false);
        console.log('will change permission to ' + newPermission);
    };

    const managerSwap = () => {
        console.log('Will make this user manager and remove manager status from current manager');
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
            setProfilePermission(user.status!);
            user?.getAvatarUrl().then(setAvatar);
        }
    }, [user?.hasData]);

    return (
        <>
            <Popup open={editPermissionModal} closeOnDocumentClick={false} 
                onClose={() => setEditPermissionModal(false)} modal>
                <Box p={4} w='100%' h='100%' borderRadius='sm'>
                    <Text alignSelf='center' bold fontSize='lg'>Edit user permission level</Text>
                    {userAuth == 4 && profilePermission == 3 
                        && <Button onPress={managerSwap} marginTop='1' m='3'>
                            <Text variant='button'>Make Manager</Text>
                        </Button>
                    }
                    <Radio.Group name='Permission' value={promoteOrDemote} 
                        onChange={(nextValue) => setPromoteOrDemote(nextValue)}>
                        <Radio value='promote'>Promote</Radio>
                        <Radio value='demote'>Demote</Radio>
                    </Radio.Group>
                    {
                        promoteOrDemote === 'promote' && profilePermission > 0 ?
                            <Select placeholder='Select permission level' 
                                onValueChange={(valueString) => setNewPermission(parseInt(valueString))}>
                                {userAuth >= 4 && profilePermission < 3 && <Select.Item label='Employee' value='3' />}
                                {profilePermission < 3 && <Select.Item label='Approved (can post)' value='2' />}
                                {profilePermission < 2 && 
                                    <Select.Item label='Verified (can login, cannot post)' value='1' />}
                                {profilePermission < 1 && <Select.Item label='Unverified (cannot login)' value='0' />}
                            </Select>
                            :
                            <Select placeholder='Select permission level'
                                onValueChange={(valueString) => setNewPermission(parseInt(valueString))}>
                                {profilePermission > 1 && <Select.Item label='Approved (can post)' value='2' />}
                                {profilePermission > 2 && 
                                    <Select.Item label='Verified (can login, cannot post)' value='1' />}
                                {profilePermission > 3 && <Select.Item label='Unverified (cannot login)' value='0' />}
                            </Select>
                    }
                    <Input type='text' multiline placeholder='Reason for action' marginY='1' numberOfLines={3}
                        onChangeText={(text) => setActionDescription(text)} />
                    <HStack>
                        <Button onPress={() => setEditPermissionModal(false)} marginTop='1'>
                            <Text variant='button'>Cancel</Text>
                        </Button>
                        <Button onPress={handleEditPermission} marginTop='1'>
                            <Text variant='button'>Confirm</Text>
                        </Button>
                    </HStack>
                </Box>
            </Popup>
            <HStack space={2} p={2}>
                <Skeleton isLoaded={avatar !== undefined} borderRadius='100%' width='15%'>
                    <img src={avatar} className='avatar-profile' alt='avatar'/>
                </Skeleton>
                <VStack width='80%'>
                    <HStack>
                        <Skeleton.Text isLoaded={displayName !== undefined}>
                            <Text variant='profileName'>
                                {displayName}
                            </Text>
                        </Skeleton.Text>
                        <Skeleton.Text isLoaded={username !== undefined}>
                            <Text variant='profileHandle'>
                                @{username}
                            </Text>
                        </Skeleton.Text>
                    </HStack>
                    <Skeleton.Text isLoaded={bio !== undefined}>
                        <Text noOfLines={4} variant='profileBio'>
                            {bio}
                        </Text>
                    </Skeleton.Text>
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