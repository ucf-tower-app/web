import { Post, User, Comment } from '../../xplat/types';
import ReportedComment from './ReportedComment';
import ReportedPost from './ReportedPost';
import ReportedUser from './ReportedUser';
import { ArrowForwardIcon, HStack, Text, Button, Box } from 'native-base';
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../utils/AuthContext';
import { queryClient } from '../../App';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import '../css/ReportCard.css';
import { ModerationAction } from '../../pages/Reports';
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
  const [confirmationOpen, setConfirmationOpen] = useState<boolean>(false);
  const [moderationAction, setModerationAction] = useState<ModerationAction>(ModerationAction.None);
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
      {author !== undefined && <ConfirmationPopup content={content} open={confirmationOpen} 
        setOpen={setConfirmationOpen} type={moderationAction} author={author}/>}
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
          <Text variant='button' onPress={() => {
            setModerationAction(ModerationAction.Absolve);
            setConfirmationOpen(true);
          }}>Absolve</Text>
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


const ConfirmationPopup = ({content, author, open, setOpen,  type}: 
  {
    content: Post | Comment | User, author: User,
    open: boolean, setOpen: (arg0: boolean) => void, type: ModerationAction
  }) => {
  const [modReason, setModReason] = useState('');
  const [password, setPassword] = useState('');
  const authContext = useContext(AuthContext);

  if (type === ModerationAction.None)
    return <></>;
  
  if (authContext.user === null)
    return <></>;

  return (
    <Popup modal open={open} onClose={() => setOpen(false)}>
      <Box p={4} bg='white' rounded='md'>
        <Text variant='header' color='black' bold alignSelf='center'>
          Confirm
        </Text>
        <Text variant='body' color='black'>
          Are you sure you want to {
            type === ModerationAction.Absolve ? 'absolve' :
              type === ModerationAction.Delete ? 'delete' :
                'ban'
          }?
        </Text>
        <HStack justifyContent='center' mt={4}>
          <Button onPress={() => {
            setOpen(false);
          }}>
            <Text variant='button'>Cancel</Text>
          </Button>
          <Button onPress={() => {
            if (type === ModerationAction.Absolve)
            {
              authContext.user?.userObject.clearAllReports(content).then(() => {
                queryClient.invalidateQueries(['reports']);
                setOpen(false);
              });
            }
            else
            if (type === ModerationAction.Ban)
            {
              authContext.user?.userObject.banUser(author, modReason, password).then( () => {
                queryClient.invalidateQueries(['reports']);
                setOpen(false);
              });
            }
          }}>
            <Text variant='button'>Confirm</Text>
          </Button>
        </HStack>

      </Box>
    </Popup>
  );
};

export default ReportCard;