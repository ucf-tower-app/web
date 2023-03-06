import { LazyStaticImage, Route, RouteClassifier, 
  RouteColor, RouteStatus, User, NaturalRules, FetchedRoute, invalidateDocRefId } from '../../xplat/types';
import { Box, Text, HStack, Input, VStack, Radio, Button, Select } from 'native-base';
import {compressImage} from '../../utils/CompressImage';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import '../css/feed.css';
import { useState } from 'react';
import { queryClient } from '../../App';

const Ropes = [
  '1', '2', '3', '4', '5', '6', '7', '8', '9'
];

const EditRoute = ({route}: {route: FetchedRoute}) => {
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [description, setDescription] = useState(route.description);
  const [setter, setSetter] = useState<User | undefined>(route.setter);
  const [rope, setRope] = useState<number | undefined>(route.rope);
  const [thumbnail, setThumbnail] = useState<string | undefined>(route.thumbnailUrl);
  const [showStoredThumbnail, setShowStoredThumbnail] = useState<boolean>(route.thumbnailUrl !== undefined);
  const [thumbnailFile, setThumbnailFile] = useState<File | undefined>(undefined);
  const [color, setColor] = useState<string | undefined>(route.color);
  const [setterRawName, setSetterRawName] = useState<string | undefined>(route.setterRawName);
  const [setterType, setSetterType] = useState<string>('User');
  const [naturalRules, setNaturalRules] = useState<NaturalRules | undefined>(route.naturalRules);
  const [imageCompressing, setImageCompressing] = useState<boolean>(false);

  function resetStates() {
    setDescription(route.description);
    setSetter(route.setter);
    setRope(route.rope);
    setThumbnail(route.thumbnailUrl);
    setShowStoredThumbnail(route.thumbnailUrl !== undefined);
    setThumbnailFile(undefined);
    setColor(route.color);
    setSetterRawName(route.setterRawName);
    setSetterType('User');
    setNaturalRules(route.naturalRules);
  }

  function handleFileSelect(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.files === null)
    {
      setShowStoredThumbnail(true);
      return;
    }
    setShowStoredThumbnail(false);
    setImageCompressing(true);
    compressImage(event.target.files[0]).then((compressedFile) => {
      setThumbnailFile(compressedFile);
    }).catch((err) => {
      console.log('failed to compress image');
      console.log(err);
    });
    setImageCompressing(false);
  }

  async function handleSubmit()
  {
    await route.routeObject.edit({
      description: description,
      setter: setter,
      rope: rope,
      thumbnail: thumbnailFile,
      color: color,
      setterRawName: setterRawName,
      naturalRules: naturalRules
    }).then(() => {
      console.log('route edited');
      invalidateDocRefId(route.routeObject.getId());
      queryClient.invalidateQueries({queryKey: route.routeObject.getId()});
      queryClient.invalidateQueries({queryKey: ['route', {id: route.routeObject.getId()}], exact: true});
    }).catch((err) => {
      console.log('failed to edit route');
      console.log(err);
    });
  }

  return (
    <Popup trigger={<button className='native-button' style=
      {{height: 'fit-content', top: 0}}>Edit Route</button>} open={showPopup} onOpen={() => setShowPopup(true)} 
    modal nested onClose={() => {
      setShowPopup(false); 
      resetStates();
    }}>
      <VStack width='100%' space={1} maxH='90vh' overflowY='scroll' p={1}>
        <Text bold alignSelf='center' variant='header'>{route.name}</Text>
        <Text alignSelf='center'>
          <Text bold>
            Route Grade: 
          </Text>
          {' ' + route.gradeDisplayString}
        </Text>
        <Text>Route Thumbnail</Text>
        { // show thumbnail stored in Firebase
          showStoredThumbnail ?
            <>
              { // show compression text if image is being compressed
                thumbnail !== undefined && 
                <>
                  <img src={thumbnail} alt='thumbnail' width='200px'/>
                  <HStack space='2'>
                    <Text variant='subtext'>Thumbnail preview</Text>
                    <input className='hidden-input' type='file' id="file" accept='image/*'
                      onChange={handleFileSelect} />
                    <label htmlFor="file" className='native-button'>Replace photo</label>
                  </HStack> 
                </>
                
              }

            </>
            :
            // show thumbnail preview and remove button
            <>
              {thumbnailFile !== undefined ?
                <>
                  {imageCompressing ? 
                    <Text variant='subtext'>Compressing image...</Text>
                    :
                    <>
                      <img src={URL.createObjectURL(thumbnailFile)} alt='thumbnail' width='200px'/>
                      <button className='native-button' onClick={() => {
                        setShowStoredThumbnail(true);
                        setThumbnailFile(undefined);
                      }}>
                        Reset to stored thumbnail
                      </button>
                    </>
                  }
                </>
                :
                <>
                  <input className='hidden-input' type='file' id="file" accept='image/*'
                    onChange={handleFileSelect} />
                  <label htmlFor="file" className='native-button'>Select photo</label>
                </>
              }
            </>
        }
        <HStack width='100%'>
          <Text bold width='10%'>Description: </Text>
          <Input type='text' value={description} onChangeText={setDescription} width='90%' multiline />
        </HStack>
        <HStack width='100%'>
          <Text bold width='10%'>Setter: </Text>
          <Radio.Group name='Setter' defaultValue='User' onChange={(nextVal) => setSetterType(nextVal)}>
            <HStack space={2}>
              <Radio value='User'>User</Radio>
              <Radio value='Custom'>Custom</Radio>
            </HStack>
          </Radio.Group>
        </HStack>
        {
          setterType === 'User' ?
            <Text>This will be a user search component</Text>
            :
            <Input left='10%' type='text' value={setterRawName} onChangeText={setSetterRawName} width='90%' />
        }
        <HStack>
          <Text bold width='10%'>Natural Rules: </Text>
          <Select placeholder='Natural Rules' onValueChange={(rulesString) => {
            const rules = rulesString as NaturalRules;
            setNaturalRules(rules);
          }} defaultValue={route.naturalRules}>
            {Object.values(NaturalRules).map((rules) => {
              return <Select.Item key={rules} label={rules} value={rules} />;
            })}
          </Select>
        </HStack>
        <HStack width='100%'>
          <Text bold width='10%'>Rope: </Text>
          <Select defaultValue={rope === undefined ? '1' : rope.toString()} 
            minWidth='90%' onValueChange={(itemValue) => setRope(parseInt(itemValue))}>
            {Ropes.map((rope) => {
              return <Select.Item key={rope} label={rope.toString()} value={rope.toString()} />;
            })}
          </Select>
        </HStack>
        <HStack width='100%'>
          <Text bold width='10%'>Color: </Text>
          <Select defaultValue={color}
            minWidth='90%' onValueChange={(itemValue) => setColor(itemValue)}>
            {Object.values(RouteColor).map((color) => {
              return <Select.Item key={color} label={color} value={color} />;
            })}
          </Select>
        </HStack>
        <Button onPress={() => {
          handleSubmit().finally( () => {
            setShowPopup(false);
          });
        }} alignSelf='center'>
          <Text variant='button'>Submit Changes</Text>
        </Button>
      </VStack>
    </Popup>
  );

};

export default EditRoute;