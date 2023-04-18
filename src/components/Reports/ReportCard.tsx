import { Post, User, Comment } from '../../xplat/types';
import ReportedComment from './ReportedComment';
import ReportedPost from './ReportedPost';
import ReportedUser from './ReportedUser';
import {
  ArrowForwardIcon,
  HStack,
  Text,
  Button,
  Box,
  Input,
} from 'native-base';
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

const ReportCard = ({
  content,
  reporters,
}: {
  content: Post | Comment | User;
  reporters: User[];
}) => {
  const [author, setAuthor] = useState<User | undefined>(undefined);
  const [confirmationOpen, setConfirmationOpen] = useState<boolean>(false);
  const [moderationAction, setModerationAction] = useState<ModerationAction>(
    ModerationAction.None
  );
  const [contentjsx, setContentjsx] = useState<JSX.Element>(<></>);

  const handleGetAuthor = async (content: Post | Comment) => {
    setAuthor(await content.getAuthor());
  };

  useEffect(() => {
    if (content instanceof User) {
      setContentjsx(<ReportedUser user={content} />);
      setAuthor(content);
    } else if (content instanceof Post) {
      setContentjsx(<ReportedPost post={content} />);
      handleGetAuthor(content);
    } else {
      setContentjsx(<ReportedComment comment={content} />);
      handleGetAuthor(content);
    }
  }, []);

  useEffect(() => {
    if (confirmationOpen === false) {
      setModerationAction(ModerationAction.None);
    }
  }, [confirmationOpen]);

  return (
    <HStack justifyContent='space-evenly'>
      {author !== undefined && (
        <ConfirmationPopup
          content={content}
          open={confirmationOpen}
          setOpen={setConfirmationOpen}
          type={moderationAction}
          author={author}
        />
      )}
      {contentjsx}
      <ArrowForwardIcon size='lg' alignSelf='center' color='white' />
      <Text variant='body' alignSelf='center' color='white'>
        This was reported by{' '}
        <Popup
          position='bottom center'
          on={['hover', 'focus']}
          trigger={
            <text className='reporter-handle'>
              {reporters.length} user{reporters.length > 1 && 's'}.
            </text>
          }
        >
          {reporters.map((reporter) => {
            return <AuthorHandle author={reporter} key={reporter.getId()} />;
          })}
        </Popup>
      </Text>
      <HStack alignSelf='center' space={1}>
        <Button
          onPress={() => {
            setModerationAction(ModerationAction.Absolve);
            setConfirmationOpen(true);
          }}
        >
          <Text variant='button'>Absolve</Text>
        </Button>
        <Button
          onPress={() => {
            setModerationAction(ModerationAction.Delete);
            setConfirmationOpen(true);
          }}
          background='red.400'
        >
          <Text variant='button'>Delete</Text>
        </Button>
        <Button
          onPress={() => {
            setModerationAction(ModerationAction.Ban);
            setConfirmationOpen(true);
          }}
          background='red.400'
        >
          <Text variant='button'>Ban</Text>
        </Button>
      </HStack>
    </HStack>
  );
};

type ConfirmationPopupProps = {
  content: Post | Comment | User;
  author: User;
  open: boolean;
  setOpen: (arg0: boolean) => void;
  type: ModerationAction;
};

const ConfirmationPopup = ({
  content,
  author,
  open,
  setOpen,
  type,
}: ConfirmationPopupProps) => {
  const [modReason, setModReason] = useState('');
  const [password, setPassword] = useState('');
  const authContext = useContext(AuthContext);

  useEffect(() => {
    if (open === false) {
      setPassword('');
      setModReason('');
    }
  }, [open]);

  if (type === ModerationAction.None) return <></>;

  if (authContext.user === null) return <></>;

  return (
    <Popup modal open={open} onClose={() => setOpen(false)}>
      <Box p={4} bg='white' rounded='md'>
        <Text variant='header' color='black' bold alignSelf='center'>
          Confirm
        </Text>
        <Text variant='body' color='black' alignSelf='center'>
          Are you sure you want to{' '}
          {type === ModerationAction.Absolve
            ? 'absolve this content'
            : type === ModerationAction.Delete
              ? 'delete this content'
              : 'ban this user'}
          ?{' '}
          <Text variant='body' color='black' bold>
            This cannot be undone
          </Text>
        </Text>
        {(type === ModerationAction.Ban ||
          type === ModerationAction.Delete) && (
          <Input
            onChangeText={setModReason}
            multiline
            w='50%'
            alignSelf='center'
            placeholder={
              type === ModerationAction.Ban
                ? 'Reason for ban'
                : 'Reason for deleting this content'
            }
            mt={4}
          />
        )}
        {type === ModerationAction.Ban && (
          <Input
            type='password'
            placeholder='Password'
            alignSelf='center'
            w='50%'
            marginTop={1}
            onChangeText={setPassword}
          />
        )}
        <HStack justifyContent='center' mt={4}>
          <Button
            onPress={() => {
              setOpen(false);
            }}
          >
            <Text variant='button'>Cancel</Text>
          </Button>
          <Button
            onPress={() => {
              if (type === ModerationAction.Absolve) {
                authContext.user?.userObject
                  .clearAllReports(content)
                  .then(() => {
                    queryClient.invalidateQueries({ queryKey: ['reports'] });
                    setOpen(false);
                  });
              } else if (type === ModerationAction.Ban) {
                authContext.user?.userObject
                  .banUser(author, modReason, password)
                  .then(() => {
                    queryClient.invalidateQueries({ queryKey: ['reports'] });
                    setOpen(false);
                  })
                  .catch((reason) => {
                    alert(reason);
                  });
              } // Delete
              else {
                authContext.user?.userObject
                  .deleteReportedContent(content, modReason)
                  .then(() => {
                    queryClient.invalidateQueries({ queryKey: ['reports'] });
                    setOpen(false);
                  });
              }
            }}
          >
            <Text variant='button'>Confirm</Text>
          </Button>
        </HStack>
      </Box>
    </Popup>
  );
};

export default ReportCard;
