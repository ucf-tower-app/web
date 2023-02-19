import { Text, Box, VStack, HStack } from 'native-base';
import { queryClient } from '..';
import { getIQParams_ModHistory } from '../xplat/queries/modHistory';
import { useInfiniteQuery } from 'react-query';
import { NavBar } from '../components/NavigationBar';

const Reports = () => {
  
  const {data, fetchNextPage, isFetchingNextPage, hasNextPage} = useInfiniteQuery(getIQParams_ModHistory());
  
  

  return (
    <VStack>
      <Box height='50px' marginBottom={1}><NavBar/></Box>
      <Text variant='header' bold alignSelf='center'>Reported Content</Text>

    </VStack>
  );
};

export default Reports;