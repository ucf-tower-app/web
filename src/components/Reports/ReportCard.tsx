import { Post, User, Comment } from '../../xplat/types';
import ReportedComment from './ReportedComment';
import ReportedPost from './ReportedPost';
import ReportedUser from './ReportedUser';

/*
  * Users can report content that they believe should not be hosted on the Tower app.
  * Reported content gets put into a queue that employees can view to decide if any
  * moderation actions need to be taken on the content or the auther of the content.
  * 
  * The ReportCard component determines the type of reported content and renders the 
  * appropriate card.
*/

const ReportCard = ({content, reporters}: {content: Post | Comment | User, reporters: User[]}) => {
  if (content instanceof User)
  {
    return <ReportedUser user={content}/>;
  }
  if (content instanceof Post)
  {
    return <ReportedPost post={content}/>;
  }
  return <ReportedComment comment={content}/>;
};

export default ReportCard;