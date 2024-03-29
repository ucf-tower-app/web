/* eslint-disable quotes */
import { Box, Button, FormControl, Input, Link, Text, SunIcon} from 'native-base';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signIn } from '../xplat/api';
import '../components/css/feed.css';

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [password, setPassword] = useState('');
  const [loginFailure, setLoginFailure] = useState(false);
  const [permissionError, setPermissionError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleClick = () => setShowPassword(!showPassword);


  async function attemptLogin() {
    console.log('running attemptLogin');
    setLoginFailure(false);
    setEmailError(false);
    setPermissionError(false);
    await signIn(email, password)
      .then(() => {
        // Signed in successfully
        navigate('/routes');
      })
      .catch((error) => {
        const errorMessage: string = error.message;

        // framework for error messages on login screen
        if (errorMessage.includes('auth/invalid-email')) setEmailError(true);
        else setLoginFailure(true);
      });
  }

  return (
    <Box
      flex={1}
      alignSelf='center'
      alignItems={'center'}
      justifyContent='center'
      paddingTop='10vh'
    >
      <img
        src={process.env.PUBLIC_URL + '/logo.jpg'}
        className='App-logo'
        alt='logo'
      />
      <Text variant={'header'} marginTop='2vh'>Welcome to the Climbing Tower at UCF!</Text>
      <FormControl
        isRequired
        isInvalid={emailError || loginFailure || permissionError}
        alignItems='center'
        marginTop='3vh'
      >
        {emailError && (
          <FormControl.ErrorMessage>
            Invalid email address
          </FormControl.ErrorMessage>
        )}
        <Input
          onChangeText={(e) => setEmail(e)}
          marginBottom='5px'
          placeholder='email'
          width={'50%'}
        />
        <Input
          onChangeText={(e) => setPassword(e)}
          type={showPassword ? 'text' : 'password'}
          placeholder='password'
          width={'50%'}
          InputRightElement={
            <Button backgroundColor={'transparent'} onPress={handleClick}>
              {<SunIcon color={showPassword ? 'blue.500' : 'black'}/>}
            </Button>
          }
        />
        {loginFailure && (
          <FormControl.ErrorMessage marginBottom={'5px'}>
            Wrong email or password
          </FormControl.ErrorMessage>
        )}
        {permissionError && (
          <FormControl.ErrorMessage marginBottom={'5px'}>
            You do not have permission to access the Tower web app.
          </FormControl.ErrorMessage>
        )}
        <Button onPress={attemptLogin} marginTop='1vh' marginBottom='3vh'>
          <Text variant={'button'}>Login</Text>
        </Button>
      </FormControl>
      <Text>
        {
          "Don't have an account? Create one through our mobile app:"
        }
      </Text>
      <Text>
        {
          <Link href="https://apps.apple.com/us/app/climb-tower/id1670481313" color='blue.500'>
            Download on the App Store
          </Link>
        }
        {
          " or "
        }
        {
          <Link href="https://play.google.com/store/apps/details?id=com.tyler.hm.tower&hl=en_US&gl=US" color='blue.500'>
            Get it on Google Play
          </Link>
        }
      </Text>
    </Box>
  );
};

export default Login;
