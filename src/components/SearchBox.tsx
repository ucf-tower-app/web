import { Box, Button, Divider, Flex, Input, Text, VStack } from 'native-base';
import { useEffect, useState } from 'react';
import {
  UserSearchResult,
  buildUserSubstringMatcher,
  getArchivedRoutesSubstringMatcher,
  getRouteByName,
  getUserCache
} from '../xplat/api';
import { User, Route, SubstringMatcher } from '../xplat/types';
import { UserRow } from './UserRow';
import { RouteRow } from './RouteRow';

const enum SearchView {
  Users,
  ArchivedRoutes,
  ActiveRoutes,
}

const SearchBox = () => {
  const [view, setView] = useState<SearchView>(SearchView.Users);
  const [inputText, setInputText] = useState<string>('');

  const [gotMatchers, setGotMatchers] = useState<boolean>(false);

  const [userMatcher, setUserMatcher] = useState<SubstringMatcher<UserSearchResult[]>>();
  const [userSearchResults, setUserSearchResults] = useState<UserSearchResult[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  const [archivedRoutesMatcher, setArchivedRoutesMatcher] = useState<SubstringMatcher<string>>();
  const [archivedRoutesSearchResults, setArchivedRoutesSearchResults] = useState<string[]>([]);
  const [archivedRoutes, setArchivedRoutes] = useState<Route[]>([]);

  useEffect(() => {
    const fetchMatchers = async () => {
      setUserMatcher(buildUserSubstringMatcher(await getUserCache()));
      setArchivedRoutesMatcher(await getArchivedRoutesSubstringMatcher());
      setGotMatchers(true);
    };
    if (!gotMatchers) {
      fetchMatchers();
    }
  }, []);

  useEffect(() => {
    const fetchRoutes = async () => {
      const routes: Route[] = await Promise.all(archivedRoutesSearchResults.map(getRouteByName));
      setArchivedRoutes(routes);
    };
    fetchRoutes();
  }, [archivedRoutesSearchResults]);

  useEffect(() => {
    const fetchUsers = async () => {
      const users: User[] = await Promise.all(userSearchResults.map((userSearchResult: UserSearchResult) => {
        return userSearchResult.user;
      }));
      setUsers(users);
    };
    fetchUsers();
  }, [userSearchResults]);

  const updateSearchResults = async () => {
    if (!gotMatchers) {
      return;
    }

    if (view === SearchView.Users) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      setUserSearchResults(userMatcher!.getMatches(inputText));
    }
    else if (view === SearchView.ArchivedRoutes) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      setArchivedRoutesSearchResults(archivedRoutesMatcher!.getMatches(inputText));
    }
  };

  const results =
    view === SearchView.Users
      ? users.map((currUser: User) => {
        return (
          <VStack key={currUser.docRef!.id} width='30%'>
            <Divider orientation='horizontal' />
            <UserRow user={currUser} />
          </VStack>
        );
      })
      : view === SearchView.ArchivedRoutes
        ? archivedRoutes.map((currRoute: Route) => {
          return (
            <VStack key={currRoute.docRef!.id} width='30%'>
              <Divider orientation='horizontal' />
              <RouteRow route={currRoute} />
            </VStack>
          );
        })
        : [];

  return (
    <VStack>
      <Flex flexDir='row' justifyContent='center'>
        <Box>
          <Button
            onPress={() => setView(SearchView.Users)}
            variant={view === SearchView.Users ? 'solid' : 'outline'}
            rounded="full"
          >
            <Text>Users</Text>
          </Button>
        </Box >
        {/* <Box>
          <Button
            onPress={() => setView(SearchView.ActiveRoutes)}
            variant={view === SearchView.ActiveRoutes ? 'solid' : 'outline'}
            rounded="full"
          >
            <Text>Activedick Routes</Text>
          </Button>
        </Box > */}
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
      <Flex flexDir='row' justifyContent='center'>
        <Input
          value={inputText}
          onChangeText={setInputText}
          backgroundColor="white"
          autoCorrect={false}
          autoComplete="off"
        />
        <Button onPress={updateSearchResults}>
          <Text variant='button'>Search!</Text>
        </Button>
      </Flex>
      <Flex flexDir='column' alignItems='center'>
        {results}
      </Flex>
    </VStack>
  );
};

export default SearchBox;