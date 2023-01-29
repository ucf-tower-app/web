import { Box } from 'native-base';
import { Player, ControlBar, ReplayControl, CurrentTimeDisplay } from 'video-react';
import { useState, useEffect } from 'react';
import '../../node_modules/video-react/dist/video-react.css';

const PostVideoDisplay = ({video}: {video: Blob}) => {
    const [videoURL, setVideoURL] = useState<string>();

    useEffect( () => {
        video?.text().then(setVideoURL);
    }, [video]);

    return (
        <Box>
            {videoURL !== undefined && 
                <Player
                    src={videoURL}>
                    <ControlBar>
                        <ReplayControl seconds={10}/>
                        <CurrentTimeDisplay/>
                    </ControlBar>
                </Player>
            }
        </Box>
    );
};

export default PostVideoDisplay;