import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { Box, Center, Text } from 'native-base';
import placeholder_image from '../../placeholder_image.jpg';
import { Route, Forum } from '../../xplat/types/types';
import { buildRouteFetcher } from '../../utils/queries';

const RouteDetailsPanel = ({ route, forumSetter }: { route: Route, forumSetter: (forum: Forum) => void}) => {
    const [routeName, setRouteName] = useState<string>();
    const [setter, setSetter] = useState<string>();
    const [setterID, setSetterID] = useState<string>();
    const {isLoading, error, data} = useQuery(['route', {id: route.docRef!.id}], buildRouteFetcher(route));

    useEffect(() => {
        if (data && !error) {
            setRouteName(data.name);
            if (data.setter)
                if (data.setter.raw)
                    setSetter(data.setter.string);
                else
                {
                    setSetter(data.setter.string);
                    setSetterID(data.setter.uid);
                }
            
            forumSetter(data.forum);
        }
    }, [data]);

    if (isLoading)
    {
        return (
            <Box flexDir={'column'} width={'25%'} top={'100px'} position='fixed'>
                <Center>
                    <Text fontSize={'2xl'} bold>Loading...</Text>
                </Center>
            </Box>
        );
    }

    return (
        <Box flexDir={'column'} width={'25%'} top={'100px'} position='fixed'>
            <Center>
                <Text fontSize={'2xl'} bold>{routeName}</Text>
                {placeholder_image && <img src={placeholder_image} className='route-avatar' alt='route' />}
                {setter !== undefined && <Text> Set by {setter}</Text>}
            </Center>
        </Box>
    );
};

export default RouteDetailsPanel;