import { Box, Button, Center, Flex, HStack, Text, VStack } from 'native-base';
import { NavBar } from '../components/NavigationBar';
import { createSearchParams, useNavigate, useSearchParams } from 'react-router-dom';
import { getRouteById } from '../xplat/api';
import placeholder_image from '../placeholder_image.jpg';
import { useQuery } from 'react-query';
import { buildRouteFetcher } from '../utils/queries';

const RouteView = () => {
    const [params] = useSearchParams();
    const navigate = useNavigate();

    const hasParams: boolean = params.has('uid');
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const myUID: string = (hasParams ? params.get('uid')! : '');

    // TODO: migrate this fetcher to the one in xplat and delete the one in ../utils/queries
    const { isLoading, isError, data, error } = useQuery(
        myUID,
        buildRouteFetcher(getRouteById(myUID)),
        {
            enabled: hasParams
        }
    );

    if (!hasParams) {
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
    const displaySetter = (data.setter?.string !== undefined ? data.setter.string : 'No assigned setter');

    return (
        <Box>
            <VStack>
                <NavBar />
                <Flex flexDir='column' justifyContent='center' top='70px' width='100%' position='fixed'>
                    <Center><Text fontSize='2xl' bold>{data.name}</Text></Center>
                    <Flex flexDir='row' justifyContent='space-between' width='100%'>
                        <Button onPress={navToRouteFeed}> View Route Feed </Button>
                        {/* TODO: make this button only visible for Active Routes */}
                        <Button> Archive This Route </Button>
                    </Flex>
                    <Center><HStack>
                        {placeholder_image! && <img src={placeholder_image} className='route-avatar' alt='route' />}
                        <VStack>
                            <Text> {data.type} </Text>
                            <Text> {data.grade} </Text>
                            <Text> {data.naturalRules} </Text>
                            <Text> {data.color} </Text>
                            <Text> {displaySetter} </Text>
                            <Text> {data.numSends} </Text>
                            <Text> {data.numLikes} </Text>
                            {/* TODO: make this stars field only visible to managers */}
                            <Text> {data.stars} </Text>
                        </VStack>
                    </HStack></Center>
                </Flex>
            </VStack>
        </Box>
    );
};

export default RouteView;