import { ModActionCollection } from '../../../xplat/types';
import { Box, Pressable, Text, Divider, ChevronDownIcon, ChevronUpIcon, HStack } from 'native-base';
import { useState } from 'react';
import ModActionCard from './ModActionCard';

const ModCollectionCard = ({data}: {data: ModActionCollection}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <Pressable
        bg='secondary.300'
        rounded='md'
        m='1'
        p='1'
        zIndex={0}
        borderColor='secondary.400'
        borderWidth={2}
        onPress={() => setExpanded(!expanded)}
      >
        <Text variant='header' bold>{data.day?.toLocaleDateString()}</Text>
        <Divider orientation='horizontal' thickness={2} color='black'/>
        <HStack justifyContent='space-between'>
          <Text>{data.modActions.length} recorded mod actions</Text>
          {expanded ? <ChevronUpIcon alignSelf='center'/> : <ChevronDownIcon alignSelf='center'/>}
        </HStack>
      </Pressable>
      {expanded ? (
        <Box bg='secondary.200' 
          rounded='md' m='1' marginLeft='3' p='1' zIndex={0} borderColor='secondary.400' borderWidth={2}>
          {data.modActions.map((action, index) => {
            return <ModActionCard action={action} index={index} key={index.toString()}/>;
          }
          )}
        </Box>
      ) : null}
    </>
  );
};

export default ModCollectionCard;