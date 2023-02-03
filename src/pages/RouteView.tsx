import { Box, Button, Center, Flex, HStack, Text, VStack } from 'native-base';
import { NavBar } from '../components/NavigationBar';
import { useEffect, useState } from 'react';
import { Route } from '../xplat/types/route';
import { createSearchParams, useNavigate, useSearchParams } from 'react-router-dom';
import { getRouteById } from '../xplat/api';
import placeholder_image from '../placeholder_image.jpg';
import { User } from '../xplat/types/user';

const RouteView = () => {
    const [route, setRoute] = useState<Route>();
    const [params] = useSearchParams();
    const [routeName, setRouteName] = useState<string>('');
    const [setter, setSetter] = useState<string>('');

    useEffect(() => {
        if (params.has('uid')) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            setRoute(getRouteById(params.get('uid')!));
        }
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            route?.getName().then(setRouteName);
            route?.getSetter().then(async (user: User) => {
                setSetter(await user.getDisplayName());
            });
        };
        fetchData();
    }, [route]);

    const navigate = useNavigate();
    const navToRouteFeed = () => {
        if (route !== undefined) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const exampleSearchParams = { uid: route.docRef!.id };
            navigate({
                pathname: '/routefeed',
                search: `?${createSearchParams(exampleSearchParams)}`
            });
        }
    };

    return (
        <Box>
            <VStack>
                <NavBar />
                <Flex flexDir='column' justifyContent='center' top='70px' width='100%' position='fixed'>
                    <Center><Text fontSize='2xl' bold>{routeName}</Text></Center>
                    <Flex flexDir='row' justifyContent='space-between' width='100%'>
                        <Button onPress={navToRouteFeed}> View Route Feed </Button>
                        <Flex flexDir='row'>
                            <Button> Archive </Button>
                            <Button> Edit </Button>
                            <Button> Delete </Button>
                        </Flex>
                    </Flex>
                    <Center><HStack>
                        {placeholder_image! && <img src={placeholder_image} className='route-avatar' alt='route' />}
                        <VStack>
                            <Text> Top-Rope </Text>
                            <Text> 5.10a </Text>
                            <Text> OH </Text>
                            <Text> Red </Text>
                            <Text> {setter === undefined ? 'No assigned Setter' : 'Set by ' + setter} </Text>
                            <Text> 12 sends </Text>
                            <Text> 6 likes </Text>
                            <Text> 4.5 stars </Text>
                        </VStack>
                    </HStack></Center>
                </Flex>
            </VStack>
        </Box>
    );
};

export default RouteView;