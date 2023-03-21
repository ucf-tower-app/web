import { Button, FormControl, Input, Text, VStack, Select, HStack } from 'native-base';
import { useState } from 'react';
import {
  convertCompetitionStringToClassifier, convertLeadclimbStringToClassifier,
  convertTopropeStringToClassifier, convertTraverseStringToClassifier, createRoute
} from '../../xplat/api';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import { User } from '../../xplat/types/user';
import { compressImage } from '../../utils/CompressImage';
import { RouteType, RouteClassifier, RouteColor, NaturalRules } from '../../xplat/types/route';
import {
  getAllBoulderClassifiers, getAllTraverseRouteClassifiers, getAllRopeDifficulties,
  getAllCompRouteClassifiers, getAllRopeModifiers, convertBoulderStringToClassifier
} from '../../xplat/api';
import '../css/feed.css';

const RouteTypeToGetAllClassifiers = (type: RouteType) => {
  if (type === RouteType.Boulder)
    return getAllBoulderClassifiers();
  if (type === RouteType.Traverse)
    return getAllTraverseRouteClassifiers();
  if (type === RouteType.Competition)
    return getAllCompRouteClassifiers();
  return getAllRopeDifficulties();
};

function handleRouteClassifier(type: RouteType, grade: string): RouteClassifier {
  switch (type) {
  case RouteType.Boulder:
    return convertBoulderStringToClassifier(grade);
  case RouteType.Competition:
    return convertCompetitionStringToClassifier(grade);
  case RouteType.Leadclimb:
    return convertLeadclimbStringToClassifier(grade);
  case RouteType.Toprope:
    return convertTopropeStringToClassifier(grade);
  default:
    return convertTraverseStringToClassifier(grade);
  }
}

const Ropes = [
  '1', '2', '3', '4', '5', '6', '7', '8', '9'
];

type refreshRoutesCallback = () => void;

type CreateRouteProps = {
  refreshRoutes: refreshRoutesCallback;
  isOpen: boolean;
  setIsOpen: (arg0: boolean) => void;
};

// TODO: implement User search component
const CreateRoute = ({ refreshRoutes, isOpen, setIsOpen }: CreateRouteProps) => {
  const [name, setName] = useState<string>('');
  const [type, setType] = useState<RouteType>();
  const [rope, setRope] = useState<number>();
  const [rawgrade, setRawgrade] = useState<string>();
  const [modifier, setModifier] = useState<string>('');
  const [description, setDescription] = useState<string>();
  const [rules, setRules] = useState<NaturalRules>();
  const [routeColor, setRouteColor] = useState<RouteColor>();
  const [confirmationBoxOpen, setConfirmationBoxOpen] = useState(false);
  const [thumbnailFile, setThumbnailFile] = useState<File>();
  const [imageCompressing, setImageCompressing] = useState<boolean>(false);
  const [setter, setSetter] = useState<User>();
  const [overrideSetterBool, setOverrideSetterBool] = useState<boolean>(true);
  const [overrideSetterString, setOverrideSetterString] = useState<string>('');
  const [formError, setFormError] = useState(false);

  function handleFileSelect(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.files === null)
      return;
    setImageCompressing(true);
    compressImage(event.target.files[0]).then((compressedFile) => {
      console.log('successfully compressed image');
      setThumbnailFile(compressedFile);
    }).catch((err) => {
      console.log('failed to compress image');
      console.log(err);
    });
    setImageCompressing(false);
  }

  function checkRouteData(): boolean {
    if (rawgrade === undefined || name.length === 0 || type === undefined
      || rope === undefined || rules === undefined || routeColor === undefined) {
      setFormError(true);
      return false;
    }
    setFormError(false);
    return true;
  }

  async function submitRoute() {
    // pacify data
    if (checkRouteData() === false)
      return;
    // check that no active route has the same name
    createRoute(
      {
        name: name,
        classifier: handleRouteClassifier(type!, rawgrade! + modifier),
        setter: setter,
        setterRawName: overrideSetterString,
        description: description,
        rope: rope,
        naturalRules: rules,
        thumbnail: thumbnailFile,
        color: routeColor,
      })
      .then((route) => {
        // handle successful create route (refresh Routes page or pass route to parent component)
        route.upgradeStatus().then(() => {
          refreshRoutes();
          setIsOpen(false);
        });
      });
  }

  return (
    <Popup open={isOpen} onClose={() => setIsOpen(false)} nested modal>
      <div>
        <Popup nested modal open={confirmationBoxOpen} onClose={() => setConfirmationBoxOpen(false)}>
          <VStack alignItems='center'>
            <Text variant='header'>
              Are you sure?
            </Text>
            <Text variant='body'>
              Are you sure you want to create this route? The name and grade must be unique and cannot be changed later.
            </Text>
          </VStack>
          <HStack space={2} justifyContent='center'>
            <Button onPress={() => {
              setConfirmationBoxOpen(false);
              submitRoute();
            }}>
              <Text variant='button'>Yes</Text>
            </Button>
            <Button onPress={() => setConfirmationBoxOpen(false)}><Text variant='button'>No</Text></Button>
          </HStack>
        </Popup>
      </div>
      <FormControl isInvalid={formError} p={1}>
        <VStack space={1} overflowY='scroll' maxH='90vh'>
          <Text fontSize='lg' alignSelf='center'>Create a new Route</Text>
          <FormControl.Label isRequired>Route Name</FormControl.Label>
          <Input isRequired type='text' onChangeText={setName} placeholder='Name' />
          <FormControl.Label>Route Thumbnail</FormControl.Label>
          { // if thumbnailFile is undefined, show select file input
            thumbnailFile === undefined ?
              <>
                { // show compression text if image is being compressed
                  imageCompressing ?
                    <Text variant='subtext'>Compressing image...</Text>
                    : <>
                      <input className='hidden-input' type='file' id="file" accept='image/*'
                        onChange={handleFileSelect} />
                      <label htmlFor="file" className='native-button'>Choose a file</label>
                    </>
                }

              </>

              :
              // show thumbnail preview and remove button
              <>
                <img src={URL.createObjectURL(thumbnailFile)} alt='thumbnail' width='200px' />
                <HStack space='2'>
                  <Text variant='subtext'>Thumbnail preview</Text>
                  <button className='native-button' onClick={() => setThumbnailFile(undefined)}>
                    Remove thumbnail
                  </button>
                </HStack>
              </>
          }
          <FormControl.Label isRequired>Route Type</FormControl.Label>
          <Select selectedValue={type} accessibilityLabel='choose route type'
            placeholder='Route type' onValueChange={(value) => {
              const route_type = value as RouteType;
              setRawgrade('');
              setModifier('');
              setType(route_type);
            }}>
            {Object.values(RouteType).map((routetype) => {
              return <Select.Item key={routetype} label={routetype} value={routetype} />;
            })}
          </Select>
          <FormControl.Label isRequired>Route Grade</FormControl.Label>
          <Select isDisabled={type === undefined} placeholder='Route grade' selectedValue={rawgrade}
            onValueChange={(value) => {
              setRawgrade(value);
              setModifier('');
            }}>
            {type !== undefined &&
              RouteTypeToGetAllClassifiers(type).map((value) => {
                if (value instanceof RouteClassifier) {
                  return <Select.Item value={value.displayString} label={value.displayString}
                    key={value.rawgrade} />;
                }

                return <Select.Item value={value} label={value}
                  key={type + ' ' + value} />;
              })
            }
          </Select>
          <FormControl.Label>Route Modifier</FormControl.Label>
          <Select selectedValue={modifier}
            isDisabled={
              (rawgrade === undefined || rawgrade === '')
              ||
              (type !== RouteType.Toprope && type !== RouteType.Leadclimb)
            }
            placeholder='Route grade modifier' onValueChange={(itemValue) => {
              setModifier(itemValue);
            }}>
            {getAllRopeModifiers().map((value) => {
              return <Select.Item key={value} value={value} label={value} />;
            })}
          </Select>
          <FormControl.Label isRequired>Rope</FormControl.Label>
          <Select placeholder='Rope' onValueChange={(ropeString) => setRope(parseInt(ropeString))}>
            {Ropes.map((val) => {
              return <Select.Item key={val} label={val} value={val} />;
            })}
          </Select>
          <FormControl.Label isRequired>Color</FormControl.Label>
          <Select placeholder='Color' onValueChange={(colorString) => {
            const color = colorString as RouteColor;
            setRouteColor(color);
          }}>
            {Object.values(RouteColor).map((color) => {
              return <Select.Item key={color} label={color} value={color} />;
            })}
          </Select>
          <FormControl.Label isRequired>Natural Rules</FormControl.Label>
          <Select placeholder='Natural Rules' onValueChange={(rulesString) => {
            const rules = rulesString as NaturalRules;
            setRules(rules);
          }}>
            {Object.values(NaturalRules).map((rules) => {
              return <Select.Item key={rules} label={rules} value={rules} />;
            })}
          </Select>
          <FormControl.Label>Setter</FormControl.Label>
          {overrideSetterBool ?
            <Input isRequired={false} type='text' onChangeText={setOverrideSetterString}
              placeholder='Setter (optional)' />
            :
            <Text>This will be a user search component</Text>
          }
          <FormControl.Label>Description</FormControl.Label>
          <Input isRequired={false} type='text' onChangeText={setDescription}
            placeholder='Description (optional)' />
          {formError &&
            <FormControl.ErrorMessage alignSelf='center'>
              Please enter all required fields
            </FormControl.ErrorMessage>
          }
          <Button alignSelf='center' onPress={() => setConfirmationBoxOpen(true)}>
            <Text variant='button' >Create Route</Text>
          </Button>
        </VStack>
      </FormControl>
    </Popup>
  );
};

export default CreateRoute;