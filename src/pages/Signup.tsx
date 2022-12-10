import { Text, Box, Input, NativeBaseProvider, Button, HStack, FormControl} from "native-base";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import theme from "../components/NativeBaseStyling";
import { Page } from "../App";
import { createUser} from "../xplat/api";
import logo from '../logo.svg'
const Signup =  () => {
    let navigate = useNavigate();
    const [displayName, setDisplayName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [bio, setBio] = useState('');
    const [password, setPassword] = useState('');
    //const [emailError, setEmailError] = useState(false);
    

    async function attemptSignup() {
        return false;
        
        
    };

    return (
        <NativeBaseProvider theme={theme}>
            <Box flex={1} alignSelf='center' alignItems={'center'} justifyContent='center' paddingTop= '100px'>
                <img src={logo} className="App-logo" alt="logo" />
                <Text variant = {'header'}>
                    Welcome to the Climbing Tower at UCF!
                </Text>
                <FormControl alignItems={'center'}>
                    <FormControl.Label isRequired>Username</FormControl.Label>
                    <Input isRequired onChangeText={(e) => setUsername(e)} marginBottom='5px' placeholder="@username" width={'60%'}/>
                    <FormControl.Label isRequired>Display Name</FormControl.Label>
                    <Input isRequired onChangeText={(e) => setDisplayName(e)} marginBottom='5px' placeholder="display name" width={'60%'}/>
                    <FormControl.Label isRequired>Email</FormControl.Label>
                    <Input isRequired onChangeText={(e) => setEmail(e)} marginBottom='5px' placeholder="email" width={'60%'}/>
                    <FormControl.HelperText>Must end with @knights.ucf.edu or @ucf.edu</FormControl.HelperText>
                    <FormControl.Label isRequired> Password</FormControl.Label>
                    <Input isRequired onChangeText={(e) => setPassword(e)} marginBottom='5px' type="password" placeholder="password" width={'60%'}/>
                    <FormControl.Label>Bio</FormControl.Label>
                    <Input onChangeText={(e) => setBio(e)} marginBottom = '5px' width='60%' numberOfLines={2} placeholder="bio"/>
                    <HStack space={'1rem'}>
                        <Button onPress={() => navigate('/')}><Text variant={'button'}>Back</Text></Button>
                        <Button onPress={attemptSignup} ><Text variant={'button'}>Sign Up</Text></Button>
                    </HStack>
                </FormControl>
            </Box>
        </NativeBaseProvider>
    )
}

export default Signup;