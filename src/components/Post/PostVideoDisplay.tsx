import { Box } from 'native-base';
import { Player, ControlBar, ReplayControl, CurrentTimeDisplay, BigPlayButton } from 'video-react';
import '../../../node_modules/video-react/dist/video-react.css';

const PostVideoDisplay = ({video, thumbnail}: {video: string, thumbnail?: string}) => {

  return (
    <Box>
      <Player
        fluid={false}
        width={325}
        poster={thumbnail}
        playsInline>
        <source src={video} />
        <BigPlayButton position="center" />
        <ControlBar>
          <ReplayControl seconds={5}/>
          <CurrentTimeDisplay/>
        </ControlBar>
      </Player>
    </Box>
  );
};

export default PostVideoDisplay;