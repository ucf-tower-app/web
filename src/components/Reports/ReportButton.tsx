import { Pressable, Tooltip } from 'native-base';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../utils/AuthContext';
import { Comment, Post, User } from '../../xplat/types';
import Icon from '@mdi/react';
import { mdiFlag, mdiFlagOutline } from '@mdi/js';

const ReportButton = ({content}: {content: Post | Comment | User}) => {
  const authContext = useContext(AuthContext);
  const [reported, setReported] = useState<boolean | undefined>();

  function handlePressReport()
  {
    if (reported === undefined || authContext.user == null)
      return;
    if (!reported)
      authContext.user.userObject.addReport(content).then(() => setReported(true));
    else
      authContext.user.userObject.removeReport(content).then(() => setReported(false));
  }

  useEffect( () => {
    if (authContext.user == null)
      return;
    
    authContext.user.userObject.alreadyReported(content).then(setReported);

  }, [authContext.user]);

  return (
    <Tooltip label={(reported !== undefined && reported) ? 'Unreport' : 'Report'} placement='top'>
      <Pressable disabled={reported === undefined} onPress={() => handlePressReport()}>
        {reported !== undefined && 
          (reported ?
            <Icon path={mdiFlag} size={1} color='red'/>
            :
            <Icon path={mdiFlagOutline} size={1} color='black'/>
          )
        }
      </Pressable>
    </Tooltip>
  );
};

export default ReportButton;