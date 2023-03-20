import { Button, Divider, Flex, Input, Text, VStack, ScrollView, Box } from 'native-base';
import { useEffect, useState } from 'react';
import {
  UserSearchResult,
  buildUserSubstringMatcher,
  getActiveRoutesCursor,
  getArchivedRoutesSubstringMatcher,
  getRouteByName,
  getUserCache
} from '../../xplat/api';
import { User, Route, SubstringMatcher } from '../../xplat/types';
import { UserRow } from '../User/UserRow';
import { RouteRow } from '../Route/RouteRow';
import { useQuery } from 'react-query';

export const enum SearchView {
  Users,
  ArchivedRoutes,
  ActiveRoutes,
}

type Props = {
  view: SearchView;
  width: string;
  onSelect: (docRefID: string) => void;
};
export const SearchBox = ({ view, width, onSelect }: Props) => {
  const [inputText, setInputText] = useState<string>('');
  const [results, setResults] = useState<JSX.Element[]>([]);

  const userMatcherQuery = useQuery(
    [SearchView.Users, 'matcher'],
    async () => buildUserSubstringMatcher(await getUserCache()),
    {
      enabled: view === SearchView.Users,
    }
  );

  const activeRoutesQuery = useQuery(
    'activeRoutes',
    async () => getActiveRoutesCursor().________getAll_CLOWNTOWN_LOTS_OF_READS(),
    {
      enabled: view === SearchView.ActiveRoutes,
    }
  );
  const activeRouteMatcherQuery = useQuery(
    [SearchView.ActiveRoutes, 'matcher'],
    async () => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const routeNames: string[] = await Promise.all(activeRoutesQuery.data!.map((route: Route) => route.getName()));
      return new SubstringMatcher<string>(routeNames);
    },
    {
      enabled: view === SearchView.ActiveRoutes &&
        !activeRoutesQuery.isLoading && !activeRoutesQuery.isError && activeRoutesQuery.data !== undefined,
    }
  );

  const archivedRouteQuery = useQuery(
    [SearchView.ArchivedRoutes, 'matcher'],
    async () => getArchivedRoutesSubstringMatcher(),
    {
      enabled: view === SearchView.ArchivedRoutes,
    }
  );

  // reset results for when our view prop changes
  useEffect(() => {
    setResults([]);
  }, [view]);

  // get which matcher query we are referring to for checking for loading and errors
  const matcherQuery = (view === SearchView.Users ? userMatcherQuery :
    (view === SearchView.ActiveRoutes ? activeRouteMatcherQuery : archivedRouteQuery));

  if (matcherQuery.isLoading) {
    return null;
  }

  if (matcherQuery.isError || matcherQuery.data === undefined) {
    console.error(matcherQuery.error);
    return null;
  }

  const updateSearchResults = async () => {
    if (view === SearchView.Users) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const userSearchResults: UserSearchResult[] = userMatcherQuery.data!.getMatches(inputText);
      const users: User[] = userSearchResults.map((userSearchResult: UserSearchResult) => userSearchResult.user);

      setResults(users.map((currUser: User) =>
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        <VStack key={currUser.docRef!.id} width='100%'>
          <Divider orientation='horizontal' />
          <UserRow user={currUser} onPress={onSelect} />
        </VStack>
      ));
    }
    else if (view == SearchView.ActiveRoutes) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const activeRouteSearchResults: string[] = activeRouteMatcherQuery.data!.getMatches(inputText);
      const activeRoutes: Route[] = await Promise.all(activeRouteSearchResults.map(getRouteByName));

      setResults(activeRoutes.map((currRoute: Route) =>
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        <VStack key={currRoute.docRef!.id} width='100%'>
          <Divider orientation='horizontal' />
          <RouteRow route={currRoute} onPress={onSelect} />
        </VStack>
      ));
    }
    else if (view === SearchView.ArchivedRoutes) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const archivedRouteSearchResults: string[] = archivedRouteQuery.data!.getMatches(inputText);
      const archivedRoutes: Route[] = await Promise.all(archivedRouteSearchResults.map(getRouteByName));

      setResults(archivedRoutes.map((currRoute: Route) =>
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        <VStack key={currRoute.docRef!.id} width='100%'>
          <Divider orientation='horizontal' />
          <RouteRow route={currRoute} onPress={onSelect} />
        </VStack>
      ));
    }
  };

  return (
    <Box width={width}>
      <VStack>
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
        <Flex flexDir='column' alignItems='center' marginTop='1'>
          <ScrollView width='100%'>
            {results}
          </ScrollView>
        </Flex>
      </VStack>
    </Box>
  );
};