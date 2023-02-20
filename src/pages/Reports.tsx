import { Text, Box, VStack, HStack, FlatList } from 'native-base';
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

const Reports = () => {
  const [reportedContent, setReportedContent] = 
    useState<Set<ReportedContent>>(new Set<ReportedContent>());
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
    
  }, [reports.data]);
  

  return (
    <VStack>
      <Box height='50px' marginBottom={1}><NavBar/></Box>
      <Text variant='header' bold alignSelf='center'>Reported Content</Text>

      <FlatList
        data={Array.from(reportedContent)}
        renderItem={({ item }) => (
          <ReportCard content={item.content} reporters={item.reporters}/>
        )}
        keyExtractor={(item, index) => {
          return item.content.getId();
        }}
      />
    </VStack>
  );
};

export default Reports;