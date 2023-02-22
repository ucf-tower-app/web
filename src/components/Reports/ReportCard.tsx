import { Post, User, Comment } from '../../xplat/types';
import ReportedComment from './ReportedComment';
import ReportedPost from './ReportedPost';
import ReportedUser from './ReportedUser';
import { ArrowForwardIcon, HStack, Text, Button, Box } from 'native-base';
import { useState, useEffect } from 'react';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import '../css/ReportCard.css';
import AuthorHandle from '../User/AuthorHandle';

/*
  * Users can report content that they believe should not be hosted on the Tower app.
  * Reported content gets put into a queue that employees can view to decide if any
  * moderation actions need to be taken on the content or the auther of the content.
  * 
  * The ReportCard component determines the type of reported content and renders the 
  * appropriate card.
*/

const ReportCard = ({content, reporters}: {content: Post | Comment | User, reporters: User[]}) => {
  const [author, setAuthor] = useState<User | undefined>(undefined);
  const [contentjsx, setContentjsx] = useState<JSX.Element>(<></>);

  const handleGetAuthor = async (content: Post | Comment) => {
    setAuthor(await content.getAuthor());
  };

  useEffect(() => {
    if (content instanceof User)
    {
      setContentjsx(<ReportedUser user={content}/>);
      setAuthor(content);
    } else
    if (content instanceof Post)
    {
      setContentjsx(<ReportedPost post={content}/>);
      handleGetAuthor(content);
    } else{
      setContentjsx(<ReportedComment comment={content}/>);
      handleGetAuthor(content);
    }
  }, []);
    

  return (
    <HStack justifyContent='space-evenly'>
      {contentjsx}
      <ArrowForwardIcon size='lg' alignSelf='center' color='white'/>
      <Text variant='body' alignSelf='center' color='white'>
        This was reported by{' '}
        <Popup
          position='bottom center'
          on={['hover', 'focus']}
          trigger={<text className='reporter-handle'>{reporters.length} user{reporters.length > 1 && 's'}.</text>}
        >
          {reporters.map((reporter) => {
            return (
              <AuthorHandle author={reporter} key={reporter.getId()}/>
            );
          })}
        </Popup>
      </Text>
      <HStack alignSelf='center' space={1}>
        <Button>
          <Text variant='button'>Absolve</Text>
        </Button>
        <Button>
          <Text variant='button'>Delete</Text>
        </Button>
        <Button>
          <Text variant='button'>Ban</Text>
        </Button>
      </HStack>
    </HStack>
  );
};

export default ReportCard;