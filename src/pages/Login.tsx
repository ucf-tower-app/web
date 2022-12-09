import { Text, Box, Input, NativeBaseProvider, Button} from "native-base";
import { useState, useEffect } from "react";
import theme from "../components/NativeBaseStyling";
import { NavBar } from "../components/NavigationBar";
import { Page } from "../App";
import logo from '../logo.svg'
const Login =  ({ setCurrentPage }: { setCurrentPage: (arg0: Page) => void; }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    function attemptLogin() {
        return false;
    };

    return (
        <NativeBaseProvider theme={theme}>
            <Box flex={1} alignSelf='center' alignItems={'center'} justifyContent='center' paddingTop= '100px'>
                <img src={logo} className="App-logo" alt="logo" />
                <Text variant = {'header'}>
                    Welcome to the Tower at UCF!
                </Text>
                <Input onChangeText={(e) => setEmail(e)} marginBottom='5px' placeholder="email"/>
                <Input onChangeText={(e) => setPassword(e)} marginBottom='5px' type="password" placeholder="password"/>
                <Button onPress={attemptLogin}>
                    <Text variant={'button'}>
                        Login
                    </Text>
                </Button>
            </Box>
        </NativeBaseProvider>
    )
}

export default Login;