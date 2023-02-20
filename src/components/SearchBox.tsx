import { Box, Button, Flex, Input, Text } from 'native-base';
import { useState } from 'react';

const enum SearchView {
  Users,
  ArchivedRoutes,
  ActiveRoutes,
}

const SearchBox = () => {
  const [view, setView] = useState<SearchView>(SearchView.Users);
  const [inputText, setInputText] = useState<string>('');


  return (
    <Flex flexDir='column'>
      <Flex flexDir='row' justifyContent='center'>
        <Box>
          <Button
            onPress={() => setView(SearchView.Users)}
            variant={view === SearchView.Users ? 'solid' : 'outline'}
            rounded="full"
          >
            <Text variant='button'>Users</Text>
          </Button>
        </Box >
        <Box>
          <Button
            onPress={() => setView(SearchView.ArchivedRoutes)}
            variant={view === SearchView.ArchivedRoutes ? 'solid' : 'outline'}
            rounded="full"
          >
            <Text variant='button'>Archived Routes</Text>
          </Button>
        </Box >
      </Flex>
      <Input
        size="md"
        variant="rounded"
        value={inputText}
        // InputRightElement={
        //   <Pressable onPress={() => handleInput('')}>
        //     <Icon as={<Feather name="x" />} size="md" color="black" mr="4" />
        //   </Pressable>
        // }
        // InputLeftElement={
        //   <Icon as={<Feather name="search" />} size="md" color="black" ml="4" />
        // }
        focusOutlineColor="purple.500"
        backgroundColor="white"
        autoCorrect={false}
        autoComplete="off"
      />
    </Flex>
  );
};

export default SearchBox;