import { Pressable, WarningOutlineIcon, WarningIcon } from 'native-base';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../utils/AuthContext';
import { Comment, Post, User } from '../../xplat/types';

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
    <Pressable disabled={reported === undefined} onPress={() => handlePressReport()}>
      {reported !== undefined && 
        (reported ? 
          <WarningIcon color='red.400' alignSelf='center'/> 
          :
          <WarningOutlineIcon alignSelf='center'/>
        )
      }
    </Pressable>
  );
};

export default ReportButton;