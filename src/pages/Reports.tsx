import { Text, Box, VStack, HStack } from 'native-base';
import { useEffect } from 'react';
import { queryClient } from '../App';
import { getIQParams_ModHistory } from '../xplat/queries/modHistory';
import { useInfiniteQuery } from 'react-query';
import { NavBar } from '../components/NavigationBar';
import { constructPageData, constructReportPageData } from '../xplat/queries';
import { getIQParams_Reports } from '../xplat/queries/report';

const Reports = () => {
  
  const modHistory = 
    useInfiniteQuery(getIQParams_ModHistory());
  
  const reports = 
    useInfiniteQuery(getIQParams_Reports());
  
  useEffect( () => {
    if (modHistory.data === undefined)
      return;
    
    const _history = modHistory.data.pages.flatMap( (history) => constructReportPageData(history));
    
  }, [modHistory.data]);

  useEffect( () => {
    if (reports.data === undefined)
      return;

    
  }, [reports.data]);
  

  return (
    <VStack>
      <Box height='50px' marginBottom={1}><NavBar/></Box>
      <Text variant='header' bold alignSelf='center'>Reported Content</Text>

    </VStack>
  );
};

export default Reports;