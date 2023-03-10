import { useQuery } from 'react-query';
import { SearchView } from './SearchBox';
import { UserSearchResult, buildUserSubstringMatcher, getUserCache } from '../../xplat/api';
import { VStack, Divider, Flex } from 'native-base';
import { User } from '../../xplat/types';
import { UserRow } from '../UserRow';

type Props = {
  inputText: string;
};
export const UserSearchResults = ({ inputText }: Props) => {
  const matcherQuery = useQuery(
    [SearchView.Users, 'matcher'],
    async () => buildUserSubstringMatcher(await getUserCache())
  );

  if (matcherQuery.isLoading) {
    return null;
  }

  if (matcherQuery.isError || matcherQuery.data === undefined) {
    console.error(matcherQuery.error);
    return null;
  }

  const userSearchResults: UserSearchResult[] = matcherQuery.data.getMatches(inputText);
  const users: User[] = userSearchResults.map((userSearchResult: UserSearchResult) => userSearchResult.user);

  return (
    <Flex flexDir='column' alignItems='center'>
      {users.map((currUser: User) =>
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        <VStack key={currUser.docRef!.id} width='30%'>
          <Divider orientation='horizontal' />
          <UserRow user={currUser} />
        </VStack>
      )}
    </Flex>
  );
};