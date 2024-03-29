import {
  Text,
  Box,
  VStack,
  HStack,
  FlatList,
  Divider,
  Button,
} from 'native-base';
import { useEffect, useState } from 'react';
import { getIQParams_ModHistory } from '../xplat/queries/modHistory';
import { useInfiniteQuery } from 'react-query';
import ReportCard from '../components/Reports/ReportCard';
import {
  User,
  Post,
  Comment,
  ModActionCollection,
} from '../xplat/types';
import {
  constructPageData,
  constructReportPageData,
  getIQParams_Reports,
} from '../xplat/queries';
import '../components/css/ReportCard.css';
import ModCollectionCard from '../components/Reports/ModAction/ModCollectionCard';

/*
 * Users can report content that they believe should not be hosted on the Tower app.
 * Reported content gets put into a queue that employees can view to decide if any
 * moderation actions need to be taken on the content or the auther of the content.
 *
 * The Reports component displays a list of all reported content.
 * Reported content will be grouped by content, will be sorted by date, and will show a list of reporters.
 */

export enum ModerationAction {
  None,
  Absolve,
  Delete,
  Ban,
}

function UserAlreadyInReported(user: User, reporters: User[]): boolean {
  let res = false;
  reporters.forEach((reporter) => {
    //console.log(user.getId() + ' ' + reporter.getId());
    if (reporter.getId() === user.getId()) {
      res = true;
      return;
    }
  });
  return res;
}

type ReportMap = Map<
  string,
  { content: User | Post | Comment; reporters: User[] }
>;

const Reports = () => {
  const [modHistoryCollections, setModHistoryCollections] = useState<ModActionCollection[]>([]);
  const [reportedContent, setReportedContent] = useState<ReportMap>(
    new Map<string, { content: User | Post | Comment; reporters: User[] }>()
  );

  const setNewMap = (
    reports: { content: User | Post | Comment; reporter: User }[]
  ) => {
    const newMap = new Map<
      string,
      { content: User | Post | Comment; reporters: User[] }
    >();
    reports.forEach((report) => {
      const fetchedReport = newMap.get(report.content.getId());
      const fetchedReporters =
        fetchedReport === undefined ? [] : fetchedReport.reporters;
      if (!UserAlreadyInReported(report.reporter, fetchedReporters))
        fetchedReporters.push(report.reporter);
      newMap.set(report.content.getId(), {
        content: report.content,
        reporters: fetchedReporters,
      });
    });
    setReportedContent(newMap);
  };

  async function loadNewReports() {
    if (reports.hasNextPage && !reports.isFetchingNextPage)
      await reports.fetchNextPage();
  }

  const modHistory = useInfiniteQuery(getIQParams_ModHistory());

  const reports = useInfiniteQuery(getIQParams_Reports());

  useEffect(() => {
    if (modHistory.data === undefined) return;

    const _modHistory = modHistory.data.pages.flatMap((page) => {
      console.log(page);
      return constructPageData(ModActionCollection, page);
    });
    setModHistoryCollections(_modHistory);
  }, [modHistory.data]);

  useEffect(() => {
    if (reports.data === undefined) return;

    const _reports = reports.data.pages.flatMap((page) =>
      constructReportPageData(page)
    );
    setNewMap(_reports);
  }, [reports.data]);

  return (
    <VStack>
      <Text fontSize='3xl' bold alignSelf='center' height='50px'>
        Reported Content
      </Text>
      <HStack>
        <Box flexDir='column' w='25%'>
          <Text variant='header' textAlign='center' bold height='25px'>
            Mod Action History
          </Text>
          <div className='modaction-container'>
            <div className='modaction-panel'>
              <FlatList
                data={modHistoryCollections}
                renderItem={({ item }) => {
                  return <ModCollectionCard data={item} />;
                }}
                keyExtractor={(item, index) => index.toString()}
                p='2'
              />
            </div>
          </div>
        </Box>
        <Divider h='70vh' orientation='vertical' />
        <Box marginX='auto' w='60%'>
          {reportedContent.size === 0 ? (
            <Box position='absolute' alignSelf='center' justifyContent='center'>
              <Text alignSelf='center' variant='header'>
                No reported content.
              </Text>
              <Button alignSelf='center' onPress={() => reports.refetch()}>
                <Text variant='button'>Refresh</Text>
              </Button>
            </Box>
          ) : (
            <FlatList
              marginTop={1}
              data={Array.from(reportedContent)}
              renderItem={({ item, index }) => (
                <Box
                  bg='red.300'
                  rounded='md'
                  marginY={1}
                  p={1}
                >
                  <ReportCard
                    content={item[1].content}
                    reporters={Array.from(item[1].reporters)}
                  />
                </Box>
              )}
              keyExtractor={(item, index) => {
                if (item[0] === undefined) return index.toString();
                return item[1].content.getId();
              }}
              onEndReached={loadNewReports}
              onEndReachedThreshold={0.9}
            />
          )}
        </Box>
      </HStack>
    </VStack>
  );
};

export default Reports;
