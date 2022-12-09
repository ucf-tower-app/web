import { NativeBaseProvider, Box , Button, Text} from "native-base";
import theme from '../components/NativeBaseStyling'

export const NavBar = () => {

    return (
        <NativeBaseProvider theme={theme}>
            <Box flex = {1} alignItems = 'left' width = '100%' backgroundColor={'#FFFFFF'} paddingTop={'5px'} position={'fixed'} flexDirection='row'>   
                <Button onPress={()=>{console.log("pressed")}}>
                    <Text variant={'button'}>
                        Routes
                    </Text>
                </Button>
                <Button>
                    <Text variant={'button'}>
                            Reports
                    </Text>
                </Button>
                <Button>
                    <Text variant={'button'}>
                            Tutorial
                    </Text>
                </Button>
                <Button >
                    <Text variant={'button'}>
                            Lost and Found
                    </Text>
                </Button>
                <Button>
                    <Text variant={'button'}>
                            Competitions
                     </Text>
                </Button>
            </Box>
            <hr/>
        </NativeBaseProvider>
    );
}