import { Text, Box, Input, NativeBaseProvider, Button, Link, FormControl} from "native-base";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import theme from "../components/NativeBaseStyling";
import { Page } from "../App";
import { getCurrentUser, signIn } from "../xplat/api";
import logo from '../logo.svg'
const Login =  () => {
    let navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    async function attemptLogin() {
        await signIn(email, password).then( (userCredential) => {
            // Signed in successfully
            const user = userCredential.user;
            //console.log(user);
            navigate('/routes');

        }).catch( (error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
        });
    };

    return (
        <NativeBaseProvider theme={theme}>
            <Box flex={1} alignSelf='center' alignItems={'center'} justifyContent='center' paddingTop= '100px'>
                <img src={logo} className="App-logo" alt="logo" />
                <Text variant = {'header'}>
                    Welcome to the Climbing Tower at UCF!
                </Text>
                <FormControl alignItems={'center'} isRequired>
                    <Input onChangeText={(e) => setEmail(e)} marginBottom='5px' placeholder="email" width={'60%'}/>
                    <Input onChangeText={(e) => setPassword(e)} marginBottom='5px' type="password" placeholder="password" width={'60%'}/>
                    <Button onPress={attemptLogin}>
                        <Text variant={'button'}>
                            Login
                        </Text>
                    </Button>
                </FormControl>
                <Text>
                    Don't have an account? Create one <Link href='/signup'>here</Link>
                </Text>
            </Box>
        </NativeBaseProvider>
    )
}

export default Login;