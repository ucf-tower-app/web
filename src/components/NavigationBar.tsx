import { HStack, Box, Button, Text, Menu, Pressable, HamburgerIcon } from 'native-base';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { auth } from '../xplat/Firebase';
import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../utils/AuthContext';
import './css/feed.css';

export const NavBar = () => {
  const [searchParams] = useSearchParams();
  const [currentRoute, setCurrentRoute] = useState<string>();
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect( () => {
    if (window.location.href.indexOf('/routes') !== -1)
    {
      setCurrentRoute('routes');
      return;
    }
    if (window.location.href.indexOf('/reports') !== -1)
    {
      setCurrentRoute('reports');
      return;
    }
    if (window.location.href.indexOf('/tutorial') !== -1)
    {
      setCurrentRoute('tutorial');
      return;
    }
    if (window.location.href.indexOf('/faq') !== -1)
    {
      setCurrentRoute('faq');
      return;
    }
    if (window.location.href.indexOf('/search') !== -1)
    {
      setCurrentRoute('search');
      return;
    }
  }, [window.location.href]);

  return (
    <Box bg='#F1F1F1' p='3' justifyContent='center' position='fixed' width='100%'>
      <HStack justifyContent='space-between'>
        <HStack space='md' height='fit-content'>
          <Button onPress={()=>{navigate('/routes');}} 
            background={currentRoute === 'routes' ? 'primary.500' : '#0891B2'}>
            <Text variant={'button'}>
                Routes
            </Text>
          </Button>
          <Button onPress={() => navigate('/reports')} 
            background={currentRoute === 'reports' ? 'primary.500' : '#0891B2'}>
            <Text variant={'button'}>
                Reports
            </Text>
          </Button>
          <Button onPress={() => navigate('/tutorial')} 
            background={currentRoute === 'tutorial' ? 'primary.500' : '#0891B2'}>
            <Text variant={'button'}>
                Tutorial
            </Text>
          </Button>
          <Button onPress={() => navigate('/faq/edit')} 
            background={currentRoute === 'faq' ? 'primary.500' : '#0891B2'}>
            <Text variant={'button'}>
                FAQ
            </Text>
          </Button>
          <Button onPress={() => navigate('/search')} 
            background={currentRoute === 'search' ? 'primary.500' : '#0891B2'}>
            <Text variant={'button'}>
                Search
            </Text>
          </Button>
        </HStack>
        
        
        <HStack space='5' pr='3'>
          {authContext.user && <img src={authContext.user.avatarUrl} alt='profile' className='nav-avatar'
            onClick={() => {
              const path = window.location.href.split('?')[0];
              if (path.endsWith('/profile') && searchParams.get('uid') === authContext.user!.docRefId)
                return;

              navigate('/profile?uid=' + authContext.user?.docRefId);
            }} />}
          <Menu trigger={triggerProps => {
            return <Pressable accessibilityLabel="Online session options" {...triggerProps} >
              <HamburgerIcon position='relative' top={'5px'} size='2xl' />
            </Pressable>;
          }}>
            <Menu.Item>
              <a href='https://tylerhm.dev/tower-eula'
                style={{textDecoration: 'none'}}>
                EULA
              </a>
            </Menu.Item>
            <Menu.Item onPress={() => {
              auth.signOut();
            }}>Logout</Menu.Item>
          </Menu>
        </HStack>
        
      </HStack>
    </Box>
  );
};