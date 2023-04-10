import { Box, Text, Input, HStack, Button} from 'native-base';
import { FAQItem } from '../xplat/types/faq';
import {useState} from 'react';

const FAQCardBox = ({question, answer}: {question: string, answer: string}) => {

  return (
    <Box rounded='md' backgroundColor='primary.400' p='2' maxW='75%'>
      <Text bold>Q: {question}</Text>
      <Text>A: {answer}</Text>
    </Box>
  );
};

export const EditFAQCardBox = ({value, index, onChange}: {value: FAQItem, index: number,
  onChange: (question: string, answer: string, index: number) => void}) =>
{
  const [question, setQuestion] = useState(value.question);
  const [answer, setAnswer] = useState(value.answer);

  return (
    <Box rounded='md' backgroundColor='primary.400' p='2'>
      <HStack>Q:<Input defaultValue={value.question} multiline onChangeText={setQuestion}/></HStack>
      <HStack>A:<Input defaultValue={value.answer} isFullWidth multiline onChangeText={setAnswer}/></HStack>
      <Button onPress={() => onChange(question, answer, index)} alignSelf='center'>
        <Text variant='button'>
          Save changes
        </Text>
      </Button>
    </Box>
  );
};

export default FAQCardBox;