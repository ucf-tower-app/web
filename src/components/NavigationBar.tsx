import { HStack, VStack,  Box , Button, Text, Menu, Pressable, HamburgerIcon} from 'native-base';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { auth } from '../xplat/Firebase';
import { useContext } from 'react';
import { AuthContext } from '../utils/AuthContext';
import './css/feed.css';

export const NavBar = () => {
  const [searchParams] = useSearchParams();
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();
  return (
    <Box height='1' zIndex={100}>
      <VStack space={2} flex={1} backgroundColor={'#F1F1F1'} zIndex={100}>
        <HStack space={1} alignItems='left' p={1} marginBottom={'5px'} width = '100%' 
          backgroundColor={'#F1F1F1'} paddingTop={'5px'} position={'fixed'} zIndex={100}>
          <Button onPress={()=>{navigate('/routes');}}>
            <Text variant={'button'}>
              Routes
            </Text>
          </Button>
          <Button onPress={() => navigate('/reports')}>
            <Text variant={'button'}>
              Reports
            </Text>
          </Button>
          <Button onPress={() => navigate('/tutorial')}>
            <Text variant={'button'}>
              Tutorial
            </Text>
          </Button>
          <Button onPress={() => navigate('/faq')}>
            <Text variant={'button'}>
              FAQ
            </Text>
          </Button>
          <HStack right='1%' position={'fixed'} alignSelf='center' space={2}>
            {authContext.user && <img src={authContext.user.avatarUrl} alt='profile' className='nav-avatar'
              onClick={() => {
                const path = window.location.href.split('?')[0];
                if (path.endsWith('/profile') && searchParams.get('uid') === authContext.user!.docRefId)
                  return;

                navigate('/profile?uid=' + authContext.user?.docRefId);
              }}/>}
            <Menu trigger={triggerProps => {
              return <Pressable accessibilityLabel="Online session options" {...triggerProps} >
                <HamburgerIcon position='relative' top={'5px'} size='lg' />
              </Pressable>;
            }}>
              <Menu.Item onPress={() => {
                auth.signOut().then( () => {
                  navigate('/');
                });
                
              }}>Logout</Menu.Item>
            </Menu>
          </HStack>
        </HStack>
      </VStack>
    </Box>
        
  );
};