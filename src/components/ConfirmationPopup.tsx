import { Text, HStack, VStack, Button } from 'native-base';
import Popup from 'reactjs-popup';

type Props = {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}
export const ConfirmationPopup = ({ open, onCancel, onConfirm }: Props) => {
  return (
    <Popup open={open} onClose={onCancel}>
      <VStack alignItems='center'>
        <Text>Are you sure? This cannot be undone.</Text>
        <HStack marginTop='4'>
          <Button onPress={onCancel} marginRight='4'>
            <Text variant='button'>Cancel</Text>
          </Button>
          <Button onPress={onConfirm} marginLeft='4'>
            <Text variant='button'>Confirm</Text>
          </Button>
        </HStack>
      </VStack>
    </Popup>
  );
};