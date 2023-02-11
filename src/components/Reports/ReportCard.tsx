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

const ReportCard = ({reported}: {reported: Post | Comment | User}) => {
  if (reported instanceof User)
  {
    return <ReportedUser user={reported}/>;
  }
  if (reported instanceof Post)
  {
    return <ReportedPost post={reported}/>;
  }
  return <ReportedComment comment={reported}/>;
};

export default ReportCard;