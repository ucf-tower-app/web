import { Box, Flex, Text } from 'native-base';
import { Route } from '../xplat/types/route';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { createSearchParams, useNavigate } from 'react-router-dom';
import { Pressable } from 'react-native';
import { buildRouteFetcher } from '../utils/queries';

type Props = {
    route: Route;
};
export const RouteRow = ({ route }: Props) => {
  const [name, setName] = useState<string>('');
  const [grade, setGrade] = useState<string>('');
  const {isLoading, data} = useQuery(['route-row', {id: route.docRef!.id}], buildRouteFetcher(route));

  const navigate = useNavigate();
  const exampleSearchParams = { uid: route.docRef!.id };
  const navToRoute = () => {
    navigate({
      pathname: '/route',
      search: `?${createSearchParams(exampleSearchParams)}`
    });
  };

  useEffect(() => {
    if (data !== undefined ) {
      setName(data.name);
      setGrade(data.grade);
    }
  }, [data]);

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