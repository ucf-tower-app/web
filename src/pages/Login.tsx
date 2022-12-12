import { Text, Box, Input, NativeBaseProvider, Button, Link, FormControl} from "native-base";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import theme from "../components/NativeBaseStyling";
import { signIn , isKnightsEmail} from "../xplat/api";
import logo from '../logo.svg';

const Login =  () => {
    let navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState(false);
    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState(false);
    const [loginFailure, setLoginFailure] = useState(false);

    const validate = () => {
        setEmailError(() => false);
        setPasswordError(() => false);
        var valid = true;
        if (!isKnightsEmail(email))
        {
            setEmailError(true);
            valid = false;
        }
        if (password.length < 5)
        {
            setPasswordError(true);
            valid = false;
        }
        return valid;
    }

    async function attemptLogin() {
        console.log("running attemptLogin")
        setLoginFailure(false);
        if (!validate())
            return;
        await signIn(email, password).then( (userCredential) => {
            // Signed in successfully
            navigate('/routes');

        }).catch( (error) => {
            const errorMessage: string = error.message;

            // framework for error messages on login screen
            if (errorMessage.includes("auth/invalid-email"))
                setEmailError(true);
            else
                setLoginFailure(true);
            
        });
    };

    return (
        <NativeBaseProvider theme={theme}>
            <Box flex={1} alignSelf='center' alignItems={'center'} justifyContent='center' paddingTop= '100px'>
                <img src={logo} className="App-logo" alt="logo" />
                <Text variant = {'header'}>
                    Welcome to the Climbing Tower at UCF!
                </Text>
                <FormControl isRequired isInvalid={emailError || passwordError || loginFailure} alignItems='center'>
                        {emailError && <FormControl.ErrorMessage>Invalid email address</FormControl.ErrorMessage>}
                        <Input onChangeText={(e) => setEmail(e)} marginBottom='5px' placeholder="email" width={'50%'}/>
                        {passwordError && <FormControl.ErrorMessage>Password must be 6 characters or more</FormControl.ErrorMessage>}
                        <Input onChangeText={(e) => setPassword(e)} type="password" placeholder="password" width={'50%'}/>
                        {loginFailure && <FormControl.ErrorMessage marginBottom={'5px'}>Wrong email or password</FormControl.ErrorMessage>}
                        <Button onPress={attemptLogin} marginTop='5px'>
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