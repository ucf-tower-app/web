import { Box, Text, Input, HStack, Button} from 'native-base';
import { FAQItem } from '../xplat/types/faq';
import {useState} from 'react';

const FAQCardBox = ({question, answer}: {question: string, answer: string}) => {

  return (
    <Box rounded='md' backgroundColor='primary.400' p='4' width='75%'
      alignItems='center'>
      <Text bold fontSize='lg'>{question}</Text>
      <Text fontSize='md' overflow='clip' noOfLines={8}>{answer}</Text>
    </Box>
  );
};

export const EditFAQCardBox = ({value, index, onChange, cancel}: 
  {value: FAQItem, index: number,
  onChange: (question: string, answer: string, index: number) => void, cancel: () => void}) =>
{
  const [question, setQuestion] = useState(value.question);
  const [answer, setAnswer] = useState(value.answer);

  const handleSaveChanges = () => 
  {
    if (question === value.question && answer === value.answer)
    {
      cancel();
      return;
    }  
    onChange(question, answer, index);
  };

  return (
    <Box rounded='md' backgroundColor='primary.400' p='4' m='1'>
      <HStack justifyContent='center' fontWeight='bold' marginBottom='12px'>Q:
        <Input defaultValue={value.question} onChangeText={setQuestion} fontSize='md' multiline width='50%'
          numberOfLines={5} marginLeft='12px' />
      </HStack>
      <HStack justifyContent='center' fontWeight='bold' marginBottom='12px'>A:
        <Input defaultValue={value.answer} onChangeText={setAnswer} fontSize='md' multiline width='50%'
          marginLeft='12px' numberOfLines={5} />
      </HStack>
      <HStack justifyContent='center'>
        <Button onPress={() => cancel()}>
          <Text variant='button'>
            Cancel
          </Text>
        </Button>
        <Button onPress={() => handleSaveChanges()} alignSelf='center'>
          <Text variant='button'>
            Save changes
          </Text>
        </Button>
      </HStack>
    </Box>
  );
};

export default FAQCardBox;