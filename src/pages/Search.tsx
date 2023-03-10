import { Box, Button, Flex, VStack, Text } from 'native-base';
import { NavBar } from '../components/NavigationBar';
import { SearchBox, SearchView } from '../components/Search/SearchBox';
import { useState } from 'react';

const Search = () => {
  const [view, setView] = useState<SearchView>(SearchView.Users);

  return (
    <Flex flexDir='column' justifyContent='center' width='100%'>
      <NavBar />
      <VStack top='50px'>
        <Flex flexDir='row' justifyContent='center'>
          <Box>
            <Button
              onPress={() => setView(SearchView.Users)}
              variant={view === SearchView.Users ? 'solid' : 'outline'}
              rounded="full"
            >
              <Text>Users</Text>
            </Button>
          </Box>
          <Box>
            <Button
              onPress={() => setView(SearchView.ActiveRoutes)}
              variant={view === SearchView.ActiveRoutes ? 'solid' : 'outline'}
              rounded="full"
            >
              <Text>Active Routes</Text>
            </Button>
          </Box>
          <Box>
            <Button
              onPress={() => setView(SearchView.ArchivedRoutes)}
              variant={view === SearchView.ArchivedRoutes ? 'solid' : 'outline'}
              rounded="full"
            >
              <Text>Archived Routes</Text>
            </Button>
          </Box>
        </Flex>
        <SearchBox view={view} />
      </VStack>
    </Flex>
  );
};

export default Search;