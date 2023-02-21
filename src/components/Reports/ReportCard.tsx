import { Post, User, Comment } from '../../xplat/types';
import ReportedComment from './ReportedComment';
import ReportedPost from './ReportedPost';
import ReportedUser from './ReportedUser';
import { ArrowForwardIcon, HStack, Text } from 'native-base';

/*
  * Users can report content that they believe should not be hosted on the Tower app.
  * Reported content gets put into a queue that employees can view to decide if any
  * moderation actions need to be taken on the content or the auther of the content.
  * 
  * The ReportCard component determines the type of reported content and renders the 
  * appropriate card.
*/

const ReportCard = ({content, reporters}: {content: Post | Comment | User, reporters: User[]}) => {

  function showReporters() {
    undefined;
  }

  let contentjsx: JSX.Element = <></>;
  if (content instanceof User)
  {
    contentjsx = <ReportedUser user={content}/>;
  } else
  if (content instanceof Post)
  {
    contentjsx =  <ReportedPost post={content} reporters={reporters}/>;
  } else
    contentjsx =  <ReportedComment comment={content}/>;

  return (
    <HStack justifyContent='center'>
      {contentjsx}
      <ArrowForwardIcon size='lg' alignSelf='center'/>
      <Text variant='body' alignSelf='center'>
        This was reported by{' '}
        <Text underline onPress={() => showReporters()}>{reporters.length} users.</Text>
      </Text>
    </HStack>
  );
};

export default ReportCard;