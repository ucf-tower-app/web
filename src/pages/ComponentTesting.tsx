import { Box, Center } from 'native-base';
import PostVideoDisplay from '../components/PostVideoDisplay';
import RouteFeedDisplay from '../components/RouteFeedDisplay';
import { ForumMock } from '../xplat/types/forum';
import { PostMock } from '../xplat/types/post';
import { UserMock } from '../xplat/types/user';


const MockTree = new ForumMock([new PostMock(new UserMock('mock', 'mock', 'mock', '', 1, [], [], []),
    new Date(), 'this is a post', [], [], [])]);

const ComponentTesting = () => {

    return (
        <Center>
            <Box width='50%' alignSelf='center'>
                <RouteFeedDisplay forum={MockTree} setPostInParent={() => console.log('nothing')}/>
            </Box>
        </Center>
    );
};

export default ComponentTesting;