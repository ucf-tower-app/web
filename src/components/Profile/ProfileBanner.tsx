import { useState, useContext } from 'react';
import { Box, HStack, Text, Input, VStack, Skeleton, Select, Button, Radio, SunIcon} from 'native-base';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import '../css/feed.css';
import { FetchedUserProfile } from '../../utils/queries';
import { AuthContext } from '../../utils/AuthContext';
import { UserStatus } from '../../xplat/types';

const ProfileBanner = ({user}: {user: FetchedUserProfile | undefined}) => {
  const [promoteOrDemote, setPromoteOrDemote] = useState<string>('promote');
  const [editPermissionModal, setEditPermissionModal] = useState<boolean>(false);
  const authContext = useContext(AuthContext);
  const [newPermission, setNewPermission] = useState<number>(0);
  const [actionDescription, setActionDescription] = useState<string>('');
  const [passwordCheck, setPasswordCheck] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);

  const handleClick = () => setShowPassword(!showPassword);

  const handleEditPermission = () => {
    setEditPermissionModal(false);

    if (user != undefined) {
      console.log('will change permission to ' + UserStatus[newPermission]);
      authContext.user?.userObject.editOtherStatus(passwordCheck, user?.userObject, newPermission, actionDescription);
      user.status = newPermission;
    }
  };

  const getStatusTitle = (status: number) => {
    return UserStatus[status];
  };

  if (user === undefined)
  {
    return (
      <Box>
        <Skeleton height='100px' />
      </Box>
    );
  }

  if (authContext.user === null)
  {
    return (
      <Box h='100px'>
        <Text>You are not currently logged in</Text>
      </Box>
    );
  }

  return (
    <>
      <Popup open={editPermissionModal} closeOnDocumentClick={false} 
        onClose={() => setEditPermissionModal(false)} modal>
        <Box p={4} w='100%' h='100%' borderRadius='sm'>
          <Text alignSelf='center' bold fontSize='lg'>Edit user permission level</Text>
          <Text alignSelf='center' fontSize='sm' marginBottom='1'>
            Current permission level: {getStatusTitle(user.status)}</Text>
          <Radio.Group name='Permission' value={promoteOrDemote} 
            onChange={(nextValue) => setPromoteOrDemote(nextValue)}>
            <Radio value='promote'>Promote</Radio>
            <Radio value='demote'>Demote</Radio>
          </Radio.Group>
          {
            /*Promote the user profile*/
            promoteOrDemote === 'promote' && user.status > UserStatus.Banned ?
              <Select placeholder='Select permission level' 
                onValueChange={(valueString) => setNewPermission(parseInt(valueString))}>
                {user.status < UserStatus.Manager && authContext.user.status >= UserStatus.Manager &&
                  <Select.Item label='Manager' value='4' />}
                {user.status < UserStatus.Employee && authContext.user.status >= UserStatus.Manager &&
                  <Select.Item label='Employee' value='3' />}
                {user.status < UserStatus.Approved &&
                  <Select.Item label='Approved (can post)' value='2' />}
                {user.status < UserStatus.Verified &&
                  <Select.Item label='Verified (can login, cannot post)' value='1' />}
                {user.status < UserStatus.Unverified &&
                  <Select.Item label='Unverified (cannot login)' value='0' />}
              </Select>
              :
              /*Demote the user profile*/
              <Select placeholder='Select permission level'
                onValueChange={(valueString) => setNewPermission(parseInt(valueString))}>
                {user.status > UserStatus.Employee && authContext.user.status >= UserStatus.Manager &&
                  <Select.Item label='Employee' value='3' />}
                {user.status > UserStatus.Approved &&
                  <Select.Item label='Approved (can post)' value='2' />}
                {user.status > UserStatus.Verified &&
                  <Select.Item label='Verified (can login, cannot post)' value='1' />}
                {user.status > UserStatus.Unverified &&
                  <Select.Item label='Unverified (cannot login)' value='0' />}
              </Select>
          }
          <Input type='text' multiline placeholder='Reason for action' marginY='1' numberOfLines={3}
            onChangeText={(text) => setActionDescription(text)} />
          <Input type={showPassword ? 'text' : 'password'} placeholder="Enter your password" marginY='1'
            onChangeText={(text) => setPasswordCheck(text)}
            InputRightElement={
              <Button backgroundColor={'transparent'} onPress={handleClick}>
                {<SunIcon color={showPassword ? 'blue.500' : 'black'}/>}
              </Button>
            }/>
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
        <img src={user.avatarUrl} className='avatar-profile' alt='avatar'/>
        <VStack width='80%'>
          <HStack>
            <Text variant='profileName'>
              {user.displayName}
            </Text>
            <Text variant='profileHandle'>
              @{user.username}
            </Text>
          </HStack>
          <Text noOfLines={4} variant='profileBio'>
            {user.bio}
          </Text>
          <HStack space='1'>
            <Text variant='profileStat'>
              {user.numFollowers || 0} Followers
            </Text>
            <Text variant='profileStat'>
              {user.numFollowing} Following
            </Text>
          </HStack>
          {authContext.user.docRefId !== user.userObject.docRef!.id &&  
          <Button position='absolute' bottom={2} onPress={() => setEditPermissionModal(true)}>
            <Text variant='button'>Edit User Permissions</Text>
          </Button>}
        </VStack>
      </HStack>
    </>
  );
};

export default ProfileBanner;