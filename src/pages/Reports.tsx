import { Text, Box, VStack, HStack, FlatList, Divider, Button } from 'native-base';
import { useEffect, useState } from 'react';
import { queryClient } from '../App';
import { getIQParams_ModHistory } from '../xplat/queries/modHistory';
import { useInfiniteQuery } from 'react-query';
import ReportCard from '../components/Reports/ReportCard';
import { NavBar } from '../components/NavigationBar';
import { User, Post, Comment, FetchedUser, FetchedComment, FetchedPost } from '../xplat/types';
import { constructPageData, constructReportPageData, getIQParams_Reports, ReportedContent } from '../xplat/queries';

/*
  * Users can report content that they believe should not be hosted on the Tower app.
  * Reported content gets put into a queue that employees can view to decide if any
  * moderation actions need to be taken on the content or the auther of the content.
  * 
  * The Reports component displays a list of all reported content.
  * Reported content will be grouped by content, will be sorted by date, and will show a list of reporters.
*/

type ReportMap = Map<string, {content: User | Post | Comment, reporters: User[]}>;

const Reports = () => {
  const [reportedContent, setReportedContent] = 
    useState<ReportMap>(new Map<string, {content: User | Post | Comment, reporters: User[]}>());

  const updateMap = (content: User | Post | Comment, reporter: User) => {
    const fetchedReport = reportedContent.get(content.getId());
    const fetchedReporters = fetchedReport === undefined ? [] : fetchedReport.reporters;
    fetchedReporters.push(reporter);
    setReportedContent(new Map(reportedContent.set(content.getId(), {content: content, reporters: fetchedReporters})));
  };

  async function loadNewReports()
  {
    if (reports.hasNextPage && !reports.isFetchingNextPage)
      await reports.fetchNextPage();
  }
  
  const modHistory = 
    useInfiniteQuery(getIQParams_ModHistory());
  
  const reports = 
    useInfiniteQuery(getIQParams_Reports());

  useEffect( () => {
    if (modHistory.data === undefined)
      return;
    
    
  }, [modHistory.data]);

  useEffect( () => {
    if (reports.data === undefined)
      return;


    const _reports = reports.data.pages.flatMap( page => constructReportPageData(page));
    console.log(_reports);
    _reports.forEach( report => {
      updateMap(report.content, report.reporter);
    });
  }, [reports.data]);
  

  return (
    
    <VStack>
      <Box height='50px' marginBottom={1}><NavBar/></Box>
      <Text fontSize='3xl' bold alignSelf='center'>Reported Content</Text>

      <HStack>
        <Box flexDir='column' minW='15%' maxW='30%'>
          <Text variant='header'textAlign='center' bold>Mod Action History</Text>
          <Button alignSelf='center'>
            <Text variant='button'>Show History</Text>
          </Button>
        </Box>
        <Divider h='70vh' orientation='vertical'/>
        <FlatList
          data={Array.from(reportedContent)}
          renderItem={({ item }) => (
            <ReportCard content={item[1].content} reporters={item[1].reporters}/>
          )}
          keyExtractor={(item, index) => {
            if (item[0] === undefined)
              return index.toString();
            return item[1].content.getId();
          }}
          onEndReached={loadNewReports}
          onEndReachedThreshold={0.9}
        />
      </HStack>
    </VStack>
    
  );
};

export default Reports;