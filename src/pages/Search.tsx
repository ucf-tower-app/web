import { Box, Button, Flex, VStack, Text, Center } from 'native-base';
import { NavBar } from '../components/NavigationBar';
import { SearchBox, SearchView } from '../components/Search/SearchBox';
import { useState } from 'react';
import { createSearchParams, useNavigate } from 'react-router-dom';

const Search = () => {
  const [view, setView] = useState<SearchView>(SearchView.Users);

  const navigate = useNavigate();

  const navToProfile = (docRefID: string) => {
    navigate({
      pathname: '/profile',
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      search: `?${createSearchParams({ uid: docRefID })}`
    });
  };

  const navToRoute = (docRefID: string) => {
    navigate({
      pathname: '/routeview',
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      search: `?${createSearchParams({ uid: docRefID })}`
    });
  };

  return (
    <Flex flexDir='column' justifyContent='center' width='100%'>
      <NavBar />
      <VStack top='50px'>
        <Flex flexDir='row' justifyContent='center' marginTop='2'>
          <Box padding='1'>
            <Button
              onPress={() => setView(SearchView.Users)}
              variant={view === SearchView.Users ? 'solid' : 'outline'}
              rounded="full"
            >
              <Text>Users</Text>
            </Button>
          </Box>
          <Box padding='1'>
            <Button
              onPress={() => setView(SearchView.ActiveRoutes)}
              variant={view === SearchView.ActiveRoutes ? 'solid' : 'outline'}
              rounded="full"
            >
              <Text>Active Routes</Text>
            </Button>
          </Box>
          <Box padding='1'>
            <Button
              onPress={() => setView(SearchView.ArchivedRoutes)}
              variant={view === SearchView.ArchivedRoutes ? 'solid' : 'outline'}
              rounded="full"
            >
              <Text>Archived Routes</Text>
            </Button>
          </Box>
        </Flex>
        <Center>
          <Box width='30%' marginTop='2'>
            <SearchBox view={view} onSelect={view === SearchView.Users ? navToProfile : navToRoute} />
          </Box>
        </Center>
      </VStack >
    </Flex >
  );
};

export default Search;