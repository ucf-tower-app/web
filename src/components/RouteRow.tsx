import { Box, Flex, Text } from 'native-base';
import { Route } from '../xplat/types/route';
import { useEffect, useState } from 'react';
import { createSearchParams, useNavigate } from 'react-router-dom';
import { Pressable } from 'react-native';

type Props = {
    route: Route;
};
export const RouteRow = ({ route }: Props) => {
    const [name, setName] = useState<string>('');
    const [grade, setGrade] = useState<string>('');

    useEffect(() => {
        route.getName().then(setName);
        route.getGradeDisplayString().then(setGrade);
    }, [route]);

    const navigate = useNavigate();
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const exampleSearchParams = { uid: route.docRef!.id };
    const navToRoute = () => {
        navigate({
            pathname: '/routeview',
            search: `?${createSearchParams(exampleSearchParams)}`
        });
    };

    return (
        <Box width='100%'>
            <Pressable onPress={navToRoute} >
                <Flex flexDirection="row" justifyContent="space-between" >
                    <Text>{name}</Text>
                    <Text>{grade}</Text>
                </Flex>
            </Pressable>
        </Box>
    );
};