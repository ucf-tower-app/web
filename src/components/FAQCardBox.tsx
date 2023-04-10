import { Box, Text, Input, HStack, Button} from 'native-base';
import { FAQItem } from '../xplat/types/faq';
import {useState} from 'react';

const FAQCardBox = ({question, answer}: {question: string, answer: string}) => {

  return (
    <Box rounded='md' backgroundColor='primary.400' p='4' maxW='75%'>
      <Text bold fontSize='lg'>Q: {question}</Text>
      <Text fontSize='md'>A: {answer}</Text>
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
      <HStack>Q:
        <Input defaultValue={value.question} multiline onChangeText={setQuestion} numberOfLines={4} fontSize='lg'/>
      </HStack>
      <HStack>A:
        <Input defaultValue={value.answer} multiline numberOfLines={4} onChangeText={setAnswer} fontSize='md'/>
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