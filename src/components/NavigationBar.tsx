import { NativeBaseProvider, Box , Button, Text, Menu, Pressable, HamburgerIcon} from "native-base";
import { useNavigate } from "react-router-dom";
import theme from '../components/NativeBaseStyling'
import { auth } from "../xplat/Firebase";

export const NavBar = () => {
    let navigate = useNavigate();
    return (
        <NativeBaseProvider theme={theme}>
            <Box flex = {1} alignItems = 'left' width = '100%' backgroundColor={'#FFFFFF'} paddingTop={'5px'} position={'fixed'} flexDirection='row'>   
                <Button onPress={()=>{navigate('/routes')}}>
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
                <Button onPress={() => navigate('/lost')}>
                    <Text variant={'button'}>
                            Lost and Found
                    </Text>
                </Button>
                <Button onPress={() => navigate('/competitions')}>
                    <Text variant={'button'}>
                            Competitions
                     </Text>
                </Button>
                <Box top={'1.5%'} right='1%' position={'fixed'}>
                    <Menu  trigger={triggerProps => {
                        return <Pressable accessibilityLabel="Online session options" {...triggerProps} >
                                <HamburgerIcon size='lg' />
                                </Pressable>;
                    }}>
                        <Menu.Item onPress={() => {
                            auth.signOut();
                            navigate('/');
                        }}>Logout</Menu.Item>
                    </Menu>
                </Box>
            </Box>
            <hr/>
        </NativeBaseProvider>
    );
}