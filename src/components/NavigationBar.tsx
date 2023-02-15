import { HStack, VStack,  Box , Button, Text, Menu, Pressable, HamburgerIcon} from 'native-base';
import { useNavigate } from 'react-router-dom';
import { auth } from '../xplat/Firebase';

export const NavBar = () => {
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
          <Box top={'15px'} right='1%' position={'fixed'}>
            <Menu  trigger={triggerProps => {
              return <Pressable accessibilityLabel="Online session options" {...triggerProps} >
                <HamburgerIcon size='lg' />
              </Pressable>;
            }}>
              <Menu.Item onPress={() => {
                auth.signOut().then( () => {
                  navigate('/');
                });
                
              }}>Logout</Menu.Item>
            </Menu>
          </Box>
        </HStack>
      </VStack>
    </Box>
        
  );
};