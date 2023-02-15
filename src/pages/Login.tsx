import { Text, Box, Input, Button, Link, FormControl} from 'native-base';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signIn , getCurrentUser} from '../xplat/api';
import { UserStatus } from '../xplat/types/common';
import logo from '../logo.svg';
import { auth } from '../xplat/Firebase';

const Login =  () => {
  const navigate = useNavigate();
 
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [password, setPassword] = useState('');
  const [loginFailure, setLoginFailure] = useState(false);
  const [permissionError, setPermissionError] = useState(false);
  
  async function attemptLogin() {
    console.log('running attemptLogin');
    setLoginFailure(false);
    setEmailError(false);
    setPermissionError(false);
    await signIn(email, password).then( () => {
      // Signed in successfully
      navigate('/routes');
    }).catch( (error) => {
      const errorMessage: string = error.message;

      // framework for error messages on login screen
      if (errorMessage.includes('auth/invalid-email'))
        setEmailError(true);
      else
        setLoginFailure(true);
    });
  }

  return (
    <Box flex={1} alignSelf='center' alignItems={'center'} justifyContent='center' paddingTop= '10vh'>
      <img src={logo} className="App-logo" alt="logo" />
      <Text variant = {'header'}>
                Welcome to the Climbing Tower at UCF!
      </Text>
      <FormControl isRequired isInvalid={emailError || loginFailure || permissionError} alignItems='center'>
        {emailError && <FormControl.ErrorMessage>Invalid email address</FormControl.ErrorMessage>}
        <Input onChangeText={(e) => setEmail(e)} marginBottom='5px' placeholder="email" width={'50%'}/>
        <Input onChangeText={(e) => setPassword(e)} type="password" placeholder="password" width={'50%'}/>
        {loginFailure && 
                    <FormControl.ErrorMessage marginBottom={'5px'}>
                        Wrong email or password
                    </FormControl.ErrorMessage>}
        {permissionError && 
                    <FormControl.ErrorMessage marginBottom={'5px'}>
                        You do not have permission to access the Tower web app.
                    </FormControl.ErrorMessage>}
        <Button onPress={attemptLogin} marginTop='5px'><Text variant={'button'}>Login</Text></Button>
      </FormControl>
      <Text>
        {'Don\'t have an account? Create one '} <Link href='/signup'>here</Link>
      </Text>
    </Box>
        
  );
};

export default Login;