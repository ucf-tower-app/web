import { useQuery } from 'react-query';
import { useState, useEffect } from 'react';
import { Box, Text, VStack, HStack, Button} from 'native-base';
import { getFAQs, setFAQs } from '../xplat/queries/faq';
import { FAQCollection, FAQItem } from '../xplat/types/faq';
import FAQCardBox, { EditFAQCardBox } from '../components/FAQCardBox';
import { queryClient } from '../App';

const FAQ = () => {
  const {data, isError, isLoading} = useQuery( 'faq_collection', () => getFAQs());
  if (isError)
  {
    return (
      <VStack alignItems='center' space={2}>
        <Text variant='header' bold fontSize='3xl'>Frequently Asked Questions</Text>
        <Text>Error loading data.</Text>
      </VStack>
    );
  }

  if (isLoading || data === undefined)
  {
    return (
      <VStack alignItems='center' space={2}>
        <Text variant='header' bold fontSize='3xl'>Frequently Asked Questions</Text>
      
        <Text>Loading...</Text>

      </VStack>
    );
  }

  return (
    <VStack alignItems='center' space={2}>
      <Text variant='header' bold fontSize='3xl'>Frequently Asked Questions</Text>
      
      {
        data.map( (value, index) => 
          <FAQCardBox key={index} question={value.question} answer={value.answer}/>)
      }

    </VStack>
  );
};

export const EditFAQ = () => {
  const [FAQCards, setFAQCards] = useState<FAQCollection>();
  const [update, setUpdate] = useState<number>(-1);
  const [addingNewCard, setAddingNewCard] = useState<boolean>(false);
  const [changesExist, setChangesExist] = useState<boolean>(false);
  const {data, isError, isLoading, refetch} = useQuery( 'faq_collection', () => getFAQs());

  const addCard = (question: string, answer: string) => {
    if (FAQCards === undefined)
      return;
    
    const tempList = FAQCards;
    tempList.push( {
      question: question,
      answer: answer
    });
    setAddingNewCard(false);
    setChangesExist(true);
    setFAQCards(tempList);
  };

  const removeCard = (index: number) => {
    if (FAQCards === undefined)
      return;
    if (index >= FAQCards.length)
      return;
    const tempList = FAQCards;
    tempList.splice(index, 1);
    const list = new Array<FAQItem>();
    tempList.forEach( (val) => list.push(val));
    setChangesExist(true);
    setFAQCards(list);
  };

  const updateCard = (question: string, answer: string, index: number) => {
    if (FAQCards === undefined)
      return;
    if (FAQCards.length <= index)
      return;
    const tempList = FAQCards;
    tempList[index] = {
      question: question,
      answer: answer
    };
    setFAQCards(tempList);
    setChangesExist(true);
    setUpdate(-1);
  };

  useEffect( () => {
    if (data === undefined || FAQCards !== undefined)
      return;
    setFAQCards(data);
  }, [data]);

  if (isError)
  {
    return (
      <VStack alignItems='center' space={2}>
        <Text variant='header' bold fontSize='3xl'>Frequently Asked Questions</Text>
        <Text>Error loading data.</Text>
      </VStack>
    );
  }

  if (isLoading || FAQCards === undefined)
  {
    return (
      <VStack alignItems='center' space={2}>
        <Text variant='header' bold fontSize='3xl'>Frequently Asked Questions</Text>
        <Text>Loading...</Text>
      </VStack>
    );
  }

  return (
    <VStack alignItems='center' space={2}>
      <Text variant='header' bold fontSize='3xl'>Frequently Asked Questions</Text>
      {
        FAQCards.map( (value, index) => {
          if (update === index)
          {
            return (
              <EditFAQCardBox key={index} value={value} index={index} onChange={updateCard}/>
            );
          }
          return (
            <HStack key={index} space={1}>
              <FAQCardBox  question={value.question} answer={value.answer}/>
              <Button onPress={() => setUpdate(index)}><Text variant='button'>Update</Text></Button>
              <Button onPress={() => removeCard(index)}><Text variant='button'>Remove</Text></Button>
            </HStack>
          );
        })
        
      } 
      {addingNewCard ? 
        <EditFAQCardBox value={{question: '', answer:''}} index={FAQCards.length} onChange={addCard}/>
        :<Button onPress={() => setAddingNewCard(true)}>
          <Text variant='button'>
          Add new FAQ
          </Text>
        </Button>
      }
      {
        changesExist && 
        <HStack>
          <Button onPress={() => {
            setFAQCards(undefined);
            refetch();
            setChangesExist(false);
          }}>
            <Text variant='button'>
              Discard changes
            </Text>
          </Button>
          <Button onPress={()=> {
            setFAQs(FAQCards);
            setChangesExist(false);
            setAddingNewCard(false);
          }}>
            <Text variant='button'>Deploy changes</Text>
          </Button>
        </HStack>
      } 
    </VStack>
  );
};

export default FAQ;