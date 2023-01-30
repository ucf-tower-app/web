import { Text, Box, Input, Button, HStack, FormControl, Modal} from 'native-base';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUser, isKnightsEmail, sendAuthEmail} from '../xplat/api';
import { auth } from '../xplat/Firebase';
import logo from '../logo.svg';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';

const Signup =  () => {
    const navigate = useNavigate();
    const [displayName, setDisplayName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordCheck, setPasswordCheck] = useState('');
    const [passwordError, setPasswordError] = useState(false);
    const [signUpError, setSignupError] = useState(false);
    const [sendEmailError, setSendEmailError] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const clearFields = () => {
        setDisplayName('');
        setUsername('');
        setEmail('');
        setPassword('');
        setPasswordCheck('');
    };

    const closeModal = () => {
        auth.signOut().then(() => {
            setShowModal(false);
        });
    };

    async function attemptSignup() {
        setSignupError(false);
        setPasswordError(false);
        if (password !== passwordCheck)
        {
            setPasswordError(true);
            return;
        }
        await createUser(email, password, username, displayName).then( (userCredential) => {
            // Successful create user
            if (isKnightsEmail(email))
            {
                sendAuthEmail().then( () => {
                    clearFields();
                    setShowModal(true);
                }).catch( (error) => {
                    setSendEmailError(true);
                });
            }
        }).catch( (error) => {
            setSignupError(true);
        });
    }

    return (
        <Box flex={1} alignSelf='center' alignItems={'center'} justifyContent='center' paddingTop= '10vh'>
            <img src={logo} className="App-logo" alt="logo" />
            <Popup modal open={showModal} onClose={closeModal}>
                <Box flex={1} alignSelf='center' alignItems={'center'} justifyContent='center' paddingTop= '1vh'>
                    <Text variant = {'header'}>
                        Email Confirmation
                    </Text>
                    <Text variant = {'body'}>
                        A confirmation email has been sent to verify your email address.{'\n'}
                        If you are a Tower employee you will need to verify your email and then contact your manager
                        to gain the appropriate permissions to access the website.
                    </Text>
                    <Button onPress={() => {
                        setShowModal(false);
                        navigate('/');
                    }}>
                        <Text variant={'button'}>Close</Text>
                    </Button>
                </Box>
            </Popup>
            <Text variant = {'header'}>
                Welcome to the Climbing Tower at UCF!
            </Text>
            <FormControl alignItems={'center'} isInvalid={passwordError}>
                <FormControl.Label isRequired>Email</FormControl.Label>
                <Input isRequired 
                    onChangeText={(e) => setEmail(e)} marginBottom='5px' placeholder="email" width={'60%'}/>
                <FormControl.HelperText>Must end with @knights.ucf.edu or @ucf.edu</FormControl.HelperText>
                <FormControl.Label isRequired>Username</FormControl.Label>
                <Input isRequired 
                    onChangeText={(e) => setUsername(e)} marginBottom='5px' placeholder="@username" width={'60%'}/>
                <FormControl.Label isRequired>Display Name</FormControl.Label>
                <Input isRequired onChangeText={(e) => setDisplayName(e)} 
                    marginBottom='5px' placeholder="display name" width={'60%'}/>
                <FormControl.Label isRequired> Password</FormControl.Label>
                <Input isRequired onChangeText={(e) => setPassword(e)} 
                    marginBottom='5px' type="password" placeholder="password" width={'60%'}/>
                <FormControl.Label isRequired> Password Confirmation</FormControl.Label>
                <Input isRequired onChangeText={(e) => setPasswordCheck(e)} 
                    marginBottom='5px' type="password" placeholder="password confirmation" width={'60%'}/>
                {passwordError && 
                    <FormControl.ErrorMessage>Passwords do not match</FormControl.ErrorMessage>}
                {signUpError && 
                    <FormControl.ErrorMessage>Signup error</FormControl.ErrorMessage>}
                {sendEmailError && 
                    <FormControl.ErrorMessage>Could not send email verification.</FormControl.ErrorMessage> }
                <HStack space={'1rem'}>
                    <Button onPress={() => navigate('/')}><Text variant={'button'}>Back</Text></Button>
                    <Button onPress={attemptSignup} ><Text variant={'button'}>Sign Up</Text></Button>
                </HStack>
            </FormControl>
        </Box>
        
    );
};

export default Signup;