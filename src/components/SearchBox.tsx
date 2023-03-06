import { Box, Button, Divider, Flex, Input, Text, VStack } from 'native-base';
import { useState } from 'react';
import {
  UserSearchResult,
  buildUserSubstringMatcher,
  getActiveRoutesCursor,
  getArchivedRoutesSubstringMatcher,
  getRouteByName,
  getUserCache
} from '../xplat/api';
import { User, Route, SubstringMatcher } from '../xplat/types';
import { UserRow } from './UserRow';
import { RouteRow } from './RouteRow';
import { useQuery } from 'react-query';

const enum SearchView {
  Users,
  ArchivedRoutes,
  ActiveRoutes,
}

const SearchBox = () => {
  const [view, setView] = useState<SearchView>(SearchView.Users);
  const [inputText, setInputText] = useState<string>('');

  const userMatcherQuery = useQuery(
    'userMatcher',
    async () => buildUserSubstringMatcher(await getUserCache())
  );
  const [users, setUsers] = useState<User[]>([]);

  const activeRouteQuery = useQuery(
    'activeRouteMatcher',
    async () => {
      const activeRoutes: Route[] = await getActiveRoutesCursor().________getAll_CLOWNTOWN_LOTS_OF_READS();
      const routeNames: string[] = await Promise.all(activeRoutes.map((route: Route) => route.getName()));
      return new SubstringMatcher<string>(routeNames);
    }
  );
  const [activeRoutes, setActiveRoutes] = useState<Route[]>([]);

  const archivedRouteMatcherQuery = useQuery(
    'archivedRouteMatcher',
    async () => getArchivedRoutesSubstringMatcher()
  );
  const [archivedRoutes, setArchivedRoutes] = useState<Route[]>([]);

  if (userMatcherQuery.isLoading || activeRouteQuery.isLoading || archivedRouteMatcherQuery.isLoading) {
    return null;
  }

  if (userMatcherQuery.isError || userMatcherQuery.data === undefined) {
    console.error(userMatcherQuery.error);
    return null;
  }

  if (activeRouteQuery.isError || activeRouteQuery.data === undefined) {
    console.error(activeRouteQuery.error);
    return null;
  }

  if (archivedRouteMatcherQuery.isError || archivedRouteMatcherQuery.data === undefined) {
    console.error(archivedRouteMatcherQuery.error);
    return null;
  }

  const changeView = async (newView: SearchView) => {
    if (newView === view) {
      return;
    }
    setView(newView);
    setInputText('');
  };

  const updateSearchResults = async () => {
    if (view === SearchView.Users) {
      const userSearchResults: UserSearchResult[] = userMatcherQuery.data.getMatches(inputText);
      const users: User[] = await Promise.all(userSearchResults.map((userSearchResult: UserSearchResult) =>
        userSearchResult.user
      ));
      setUsers(users);
    }
    else if (view == SearchView.ActiveRoutes) {
      const activeRouteSearchResults: string[] = activeRouteQuery.data.getMatches(inputText);
      const activeRoutes: Route[] = await Promise.all(activeRouteSearchResults.map(getRouteByName));
      setActiveRoutes(activeRoutes);
    }
    else if (view === SearchView.ArchivedRoutes) {
      const archivedRouteSearchResults: string[] = archivedRouteMatcherQuery.data.getMatches(inputText);
      const archiveRoutes: Route[] = await Promise.all(archivedRouteSearchResults.map(getRouteByName));
      setArchivedRoutes(archiveRoutes);
    }
  };

  const getResults = () => {
    if (view === SearchView.Users) {
      return users.map((currUser: User) =>
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        <VStack key={currUser.docRef!.id} width='30%'>
          <Divider orientation='horizontal' />
          <UserRow user={currUser} />
        </VStack>
      );
    }
    if (view === SearchView.ActiveRoutes) {
      return activeRoutes.map((currRoute: Route) =>
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        <VStack key={currRoute.docRef!.id} width='30%'>
          <Divider orientation='horizontal' />
          <RouteRow route={currRoute} />
        </VStack>
      );
    }
    if (view === SearchView.ArchivedRoutes) {
      return archivedRoutes.map((currRoute: Route) =>
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        <VStack key={currRoute.docRef!.id} width='30%'>
          <Divider orientation='horizontal' />
          <RouteRow route={currRoute} />
        </VStack>
      );
    }
    return [];
  };

  return (
    <VStack>
      <Flex flexDir='row' justifyContent='center'>
        <Box>
          <Button
            onPress={() => changeView(SearchView.Users)}
            variant={view === SearchView.Users ? 'solid' : 'outline'}
            rounded="full"
          >
            <Text>Users</Text>
          </Button>
        </Box>
        <Box>
          <Button
            onPress={() => changeView(SearchView.ActiveRoutes)}
            variant={view === SearchView.ActiveRoutes ? 'solid' : 'outline'}
            rounded="full"
          >
            <Text>Active Routes</Text>
          </Button>
        </Box>
        <Box>
          <Button
            onPress={() => changeView(SearchView.ArchivedRoutes)}
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
        {getResults()}
      </Flex>
    </VStack>
  );
};

export default SearchBox;