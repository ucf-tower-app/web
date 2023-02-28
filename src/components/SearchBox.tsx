import { Box, Button, Flex, Input, Text, VStack } from 'native-base';
import { useEffect, useState } from 'react';
import {
  UserSearchResult, buildUserSubstringMatcher,
  getArchivedRoutesSubstringMatcher, getRouteByName, getUserCache
} from '../xplat/api';
import { Route, SubstringMatcher, User } from '../xplat/types';
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

  const [archivedRoutesMatcher, setArchivedRoutesMatcher] = useState<SubstringMatcher<string>>();
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

  console.log(gotMatchers);
  console.log(archivedRoutes.length);

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
      const routeNames = await archivedRoutesMatcher!.getMatches(inputText);
      console.log('routeNames (item count = ' + routeNames.length + '):');
      routeNames.forEach((routeName: string) => console.log(routeName));

      const routes: Route[] = [];
      for (const routeName in routeNames) {
        const currRoute: Route | undefined = await getRouteByName(routeName);
        console.log('grabbed it async?');
        if (currRoute !== undefined) {
          console.log('pushin it on?');
          routes.push(currRoute);
        }
      }
      console.log('created routes array of length ' + routes.length);
      setArchivedRoutes(routes);

      console.log('just updated archived routes');


      // setArchivedRoutesSearchResults(archivedRoutesMatcher!.getMatches(inputText));
    }
  };

  const results =
    view === SearchView.Users
      ? userSearchResults.map((userSearchResult: UserSearchResult) => {
        return (
          <Box key={userSearchResult.user.getId()}>
            <Text>{userSearchResult.username}</Text>
          </Box>
        );
      })
      : view === SearchView.ArchivedRoutes
        ? archivedRoutes.map((currRoute: Route) => {
          return (
            <RouteRow key={currRoute.docRef!.id} route={currRoute} />
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
        </Box >
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