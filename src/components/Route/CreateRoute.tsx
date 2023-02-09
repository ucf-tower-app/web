import { Button, FormControl, Input, Text, VStack, Select, HStack } from 'native-base';
import { useState } from 'react';
import { createRoute } from '../../xplat/api';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import { User } from '../../xplat/types/user';
import { RouteType, RouteClassifier, RouteColor, NaturalRules } from '../../xplat/types/route';
import { getAllBoulderClassifiers, getAllTraverseRouteClassifiers, 
  getAllCompetitionRouteClassifiers,
  getAllLeadclimbRouteClassifiers,
  getAllTopropeRouteClassifiers } from '../../xplat/api';


const RouteTypeToGetAllClassifiers = (type: RouteType) => {
  if (type === RouteType.Boulder)
    return getAllBoulderClassifiers();
  if (type === RouteType.Traverse)
    return getAllTraverseRouteClassifiers();
  if (type === RouteType.Competition)
    return getAllCompetitionRouteClassifiers();
  if (type === RouteType.Leadclimb)
    return getAllLeadclimbRouteClassifiers();
  return getAllTopropeRouteClassifiers();
};

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
const CreateRoute = ({refreshRoutes, isOpen, setIsOpen}: CreateRouteProps) => {
  const [name, setName] = useState<string>('');
  const [type, setType] = useState<RouteType>();
  const [rope, setRope] = useState<number>();
  const [rawgrade, setRawgrade] = useState<number>();
  const [description, setDescription] = useState<string>();
  const [rules, setRules] = useState<NaturalRules>();
  const [routeColor, setRouteColor] = useState<RouteColor>();
  const [confirmationBoxOpen, setConfirmationBoxOpen] = useState(false);
  const [thumbnailFile, setThumbnailFile] = useState<File>();
  const [setter, setSetter] = useState<User>();
  const [overrideSetterBool, setOverrideSetterBool] = useState<boolean>(true);
  const [overrideSetterString, setOverrideSetterString] = useState<string>('');
  const [formError, setFormError] = useState(false);

  function handleFileSelect(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.files === null)
      return;
    setThumbnailFile(event.target.files[0]);
  }

  function checkRouteData(): boolean {
    if (rawgrade === undefined || name.length === 0 || type === undefined 
      || rope === undefined || rules === undefined || routeColor === undefined)
    {
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
        classifier: new RouteClassifier(rawgrade!, type!), 
        setter: setter,
        setterRawName: overrideSetterString,
        description: description,
        rope: rope,
        naturalRules: rules,
        thumbnail: thumbnailFile,
        color: routeColor,
      })
      .then( (route) => {
        // handle successful create route (refresh Routes page or pass route to parent component)
        console.log('route created: ', route.docRef?.id);
        refreshRoutes();
        setIsOpen(false);
      });
  }

  return (
    <Popup open={isOpen} onClose={() => setIsOpen(false)} closeOnDocumentClick={false} nested modal>
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
        <VStack space={1}>
          <Text fontSize='lg' alignSelf='center'>Create a new Route</Text>
          <FormControl.Label isRequired>Route name</FormControl.Label>
          <Input isRequired type='text' onChangeText={setName} placeholder='Name'/>
          <FormControl.Label>Route Thumbnail</FormControl.Label>
          <input type='file' accept='image/*' onChange={handleFileSelect}/>
          <FormControl.Label isRequired>Route type</FormControl.Label>
          <Select selectedValue={type} accessibilityLabel='choose route type'
            placeholder='Route type' onValueChange={ (value) => {
              const route_type = value as RouteType;
              setRawgrade(undefined);
              setType(route_type);
            }}>
            {Object.values(RouteType).map( (routetype) => {
              return <Select.Item key={routetype} label={routetype} value={routetype}/>;
            })}
          </Select>
          <FormControl.Label isRequired>Route grade</FormControl.Label>
          <Select isDisabled={type === undefined} placeholder='Route grade'
            onValueChange={ (value) => setRawgrade(parseInt(value))}>
            {type !== undefined &&
              RouteTypeToGetAllClassifiers(type).map( (value) => {
                return <Select.Item value={''+value.rawgrade} label={value.displayString}
                  key={value.displayString}/>;
              })
            }
          </Select>
          <FormControl.Label isRequired>Rope</FormControl.Label>
          <Select placeholder='Rope' onValueChange={ (ropeString) => setRope(parseInt(ropeString))}>
            {Ropes.map( (val) => {
              return <Select.Item key={val} label={val} value={val}/>;
            })}
          </Select>
          <FormControl.Label isRequired>Color</FormControl.Label>
          <Select placeholder='Color' onValueChange={ (colorString) => {
            const color = colorString as RouteColor;
            setRouteColor(color);
          }}>
            {Object.values(RouteColor).map( (color) => {
              return <Select.Item key={color} label={color} value={color}/>;
            })}
          </Select>
          <FormControl.Label isRequired>Natural Rules</FormControl.Label>
          <Select placeholder='Natural Rules' onValueChange={ (rulesString) => {
            const rules = rulesString as NaturalRules;
            setRules(rules);
          }}>
            {Object.values(NaturalRules).map( (rules) => {
              return <Select.Item key={rules} label={rules} value={rules}/>;
            })}
          </Select>
          <FormControl.Label>Setter</FormControl.Label>
          {overrideSetterBool ?
            <Input isRequired={false} type='text' onChangeText={setOverrideSetterString}
              placeholder='Setter (optional)'/>
            :
            <Text>This will be a user search component</Text>
          }
          <FormControl.Label>Description</FormControl.Label>
          <Input isRequired={false} type='text' onChangeText={setDescription}
            placeholder='Description (optional)'/>
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