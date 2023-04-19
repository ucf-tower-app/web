import { useQuery } from 'react-query';
import { useState, useEffect } from 'react';
import { Text, VStack, HStack, Button, Box} from 'native-base';
import { getFAQs, setFAQs } from '../xplat/queries/faq';
import { FAQCollection, FAQItem } from '../xplat/types/faq';
import FAQCardBox, { EditFAQCardBox } from '../components/FAQCardBox';

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
      <img
        src={process.env.PUBLIC_URL + '/logo.jpg'}
        style={{
          maxWidth: '200px',
          height: 'auto'
        }}
        alt='logo'
      />
      <Text variant='header' bold fontSize='2xl' textAlign='center' maxW='100%'>Frequently Asked Questions</Text>
      {
        data.map( (value, index) => 
          <FAQCardBox key={index} question={value.question} answer={value.answer}/>)
      }

    </VStack>
  );
};

export const EditFAQ = () => {
  const [FAQCards, setFAQCards] = useState<FAQCollection>([]);
  const [update, setUpdate] = useState<number>(-1);
  const [addingNewCard, setAddingNewCard] = useState<boolean>(false);
  const [changesExist, setChangesExist] = useState<boolean>(false);
  const {data, isError, isLoading, refetch} = useQuery( 'faq_collection', () => getFAQs());

  const addCard = (question: string, answer: string) => {
    const tempList = new Array<FAQItem>();
    FAQCards.forEach( (val) => tempList.push(val));
    tempList.push( {
      question: question,
      answer: answer
    });
    setAddingNewCard(false);
    setChangesExist(true);
    setFAQCards(tempList);
  };

  const removeCard = (index: number) => {
    if (index >= FAQCards.length)
      return;
    FAQCards.splice(index, 1);
    const tempList = new Array<FAQItem>();
    FAQCards.forEach( (val) => tempList.push(val));
    setChangesExist(true);
    setFAQCards(tempList);
  };

  const updateCard = (question: string, answer: string, index: number) => {
    if (index >= FAQCards.length)
      return;
    const tempList = new Array<FAQItem>();
    FAQCards.forEach( (val) => tempList.push(val));
    tempList[index] = {
      question: question,
      answer: answer
    };
    setFAQCards(tempList);
    setChangesExist(true);
    setUpdate(-1);
  };

  useEffect( () => {
    if (data === undefined)
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
      <Box rounded='lg' p='5' width='75%' marginLeft='auto' marginRight='auto'
        marginTop='5' marginBottom='5' backgroundColor='primary.200'>
        {
          FAQCards.map( (value, index) => {
            if (update === index)
            {
              return (
                <EditFAQCardBox key={index} value={value} index={index} onChange={updateCard}
                  cancel={() => setUpdate(-1)}/>
              );
            }
            return (
              <HStack key={index} space={1} m='1' marginBottom='5' justifyContent='center'>
                <FAQCardBox question={value.question} answer={value.answer}/>
                <VStack space={1} justifyContent='center'>
                  <Button onPress={() => setUpdate(index)} width='100%'>
                    <Text variant='button'>Edit</Text>
                  </Button>
                  <Button onPress={() => removeCard(index)} backgroundColor='red.400' width='100%'>
                    <Text variant='button'>Remove</Text>
                  </Button>
                </VStack>
              </HStack>
            );
          })
        }
        {addingNewCard ?
          <EditFAQCardBox value={{question: '', answer:''}} index={FAQCards.length} onChange={addCard}
            cancel={() => setAddingNewCard(false)}/>
          :<Button onPress={() => setAddingNewCard(true)} marginLeft='auto' marginRight='auto'>
            <Text variant='button'>
            Add new FAQ
            </Text>
          </Button>
        }
      </Box>
      {
        changesExist && 
        <HStack space={1} marginBottom='20'>
          <Button onPress={() => {
            refetch();
            setFAQCards(data);
            setChangesExist(false);
            setAddingNewCard(false);
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