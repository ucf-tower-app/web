import { Box, Button, Center, Flex, Text, VStack } from 'native-base';
import { NavBar } from '../components/NavigationBar';
import { createSearchParams, useNavigate, useSearchParams } from 'react-router-dom';
import { getRouteById } from '../xplat/api';
import placeholder_image from '../placeholder_image.jpg';
import { useQuery } from 'react-query';
import { buildRouteFetcher } from '../utils/queries';
import { NaturalRules, RouteStatus, Tag } from '../xplat/types';
import { queryClient } from '..';

const RouteView = () => {
    const [params] = useSearchParams();
    const navigate = useNavigate();

    const hasUID: boolean = params.has('uid');
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const myUID: string = (hasUID ? params.get('uid')! : '');

    // TODO: migrate this fetcher to the one in xplat and delete the one in ../utils/queries
    const { isLoading, isError, data, error } = useQuery(
        ['routes', myUID],
        buildRouteFetcher(getRouteById(myUID)),
        {
            enabled: hasUID
        }
    );

    if (!hasUID) {
        // with our navigation this should never happen, but can never be too safe?
        console.error('no uid params given');
        return null;
    }

    if (isLoading) {
        return null;
    }

    if (isError || data === undefined) {
        console.error(error);
        return null;
    }

    const navToRouteFeed = () => {
        const searchParams = { uid: myUID };
        navigate({
            pathname: '/routefeed',
            search: `?${createSearchParams(searchParams)}`
        });
    };

    const archiveThisRoute = () => {
        // TODO: find a nice way to have the component rerender after these async calls
        getRouteById(myUID).upgradeStatus().then(() =>
            queryClient.invalidateQueries({ queryKey: ['routes', myUID] })
        );
    };

    const notAssigned = 'not assigned';
    const displayNaturalRules = data.naturalRules ? NaturalRules[data.naturalRules] : notAssigned;
    let displayTags = '';
    data.tags.forEach((currTag: Tag, index: number) => {
        if (index > 0) {
            // comma separate tags (skip putting one before the first guy)
            displayTags += ', ';
        }
        displayTags += currTag.getName();
    });
    if (displayTags == '') {
        displayTags = 'none';
    }

    return (
        <Box>
            <VStack>
                <NavBar />
                <Flex flexDir='column' justifyContent='center' top='70px' width='100%' position='fixed'>
                    <Center><Text fontSize='2xl' bold>{data.name}</Text></Center>
                    <Flex flexDir='row' justifyContent='center' width='100%'>
                        <Button onPress={navToRouteFeed}>
                            <Text variant='button'>View Route Feed</Text>
                        </Button>
                        {/* TODO: make this button only visible for Active Routes */}
                        <Button onPress={archiveThisRoute}>
                            <Text variant='button'>Archive This Route</Text>
                        </Button>
                    </Flex>
                    <Flex flexDir='row' justifyContent='center' width='100%'>
                        <Box width='30%' height='30%'>
                            <img src={data.image ?? placeholder_image} className='route-avatar' alt='route' />
                        </Box>
                        <VStack>
                            <Text> Status: {RouteStatus[data.status]} </Text>
                            <Text> Type: {data.type} </Text>
                            <Text> Color: {data.color} </Text>
                            <Text> Grade: {data.grade} </Text>
                            <Text> Natural Rules: {displayNaturalRules} </Text>
                            <Text> Tags: {displayTags} </Text>
                            <Text> Rope: {data.rope ?? notAssigned} </Text>
                            <Text> Setter: {data.setter?.string ?? notAssigned} </Text>
                            {/* TODO: make this a readable date format? Also it is not even accurate atm */}
                            <Text> Date Set: {data.timestamp?.toDateString() ?? notAssigned} </Text>
                            <Text> Sends: {data.numSends} </Text>
                            <Text> Likes: {data.numLikes} </Text>
                            {/* TODO: make this stars field only visible to managers */}
                            <Text> Rating: {data.stars ?? 5} stars </Text>
                        </VStack>
                    </Flex>
                </Flex>
            </VStack>
        </Box>
    );
};

export default RouteView;