import { Box, Flex } from 'native-base';
import { NavBar } from '../components/NavigationBar';
import SearchBox from '../components/SearchBox';

const Search = () => {
  return (
    <Flex flexDir='column' justifyContent='center' width='100%'>
      <NavBar />
      <Box top='50px'>
        <SearchBox />
      </Box>
    </Flex>
  );
};

export default Search;