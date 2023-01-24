import { Flex, Text } from 'native-base';
import { Route } from '../xplat/types/route';
import { useEffect, useState } from 'react';

type Props = {
    route: Route;
};
export const RouteRow = ({ route }: Props) => {
    const [name, setName] = useState<string>('');
    const [grade, setGrade] = useState<string>('');

    useEffect(() => {
        Promise.all([route.getName().then(setName), route.getGradeDisplayString().then(setGrade)]);
    }, [route]);

    return (
        <Flex flexDirection="row" justifyContent="space-between" width='100%'>
            <Text>{name}</Text>
            <Text>{grade}</Text>
        </Flex>
    );
};