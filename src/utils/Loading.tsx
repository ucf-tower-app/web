import {Text, Link, Center } from 'native-base';


const Loading = () => {

  return (
    <Center alignContent='center'>
      <Text fontSize='xl'>
        Loading the current user. If this screen persists please return to the <Link href='/'>login screen.</Link>
      </Text>
    </Center>
  );
};

export default Loading;