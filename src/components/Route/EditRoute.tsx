import { RouteColor, User, NaturalRules, FetchedRoute, invalidateDocRefId } from '../../xplat/types';
import { Text, HStack, Input, VStack, Radio, Button, Select } from 'native-base';
import {compressImage} from '../../utils/CompressImage';
import Popup from 'reactjs-popup';
import { SearchBox, SearchView } from '../Search/SearchBox';
import 'reactjs-popup/dist/index.css';
import '../css/feed.css';
import { useState } from 'react';
import { queryClient } from '../../App';
import { getUserById } from '../../xplat/api';
import AuthorHandle from '../User/AuthorHandle';

const Ropes = [
  '1', '2', '3', '4', '5', '6', '7', '8', '9'
];

const EditRoute = ({route, open, setOpen}: 
  {route: FetchedRoute, open: boolean, setOpen: (arg0: boolean) => void}) => {
  const [description, setDescription] = useState(route.description);
  const [setter, setSetter] = useState<User | undefined>(route.setter);
  const [rope, setRope] = useState<number | undefined>(route.rope);
  const [thumbnail, setThumbnail] = useState<string | undefined>(route.thumbnailUrl);
  const [showStoredThumbnail, setShowStoredThumbnail] = useState<boolean>(route.thumbnailUrl !== undefined);
  const [thumbnailFile, setThumbnailFile] = useState<File | undefined>(undefined);
  const [color, setColor] = useState<string | undefined>(route.color);
  const [setterRawName, setSetterRawName] = useState<string | undefined>(route.setterRawName);
  const [setterType, setSetterType] = useState<string>(route.setter === undefined ? 'Custom' : 'User');
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
    setSetterType(route.setter === undefined ? 'Custom' : 'User');
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
      queryClient.invalidateQueries(
        {queryKey: ['route', {id: route.routeObject.getId()}], exact: true}
      );
    }).catch((err) => {
      console.log('failed to edit route');
      console.log(err);
    });
  }

  return (
    <Popup open={open} onOpen={() => setOpen(true)} 
      modal onClose={() => {
        setOpen(false); 
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
                  <img src={thumbnail} alt='thumbnail' className='route-popup-avatar'/>
                  <HStack alignItems='center'space={2}>
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
                      <img src={URL.createObjectURL(thumbnailFile)} alt='thumbnail' className='route-popup-avatar'/>
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
        <HStack alignItems='center'space={1} width='100%'>
          <Text bold >Description: </Text>
          <Input type='text' value={description} onChangeText={setDescription} width='75%' 
            multiline numberOfLines={2} />
        </HStack>
        <HStack alignItems='center'space={1} width='100%'>
          <Text bold >Setter: </Text>
          <Radio.Group name='Setter' defaultValue={setterType} onChange={
            (nextVal) => {
              if (nextVal == 'Custom')
                setSetter(undefined);
              setSetterType(nextVal);
            }
          }>
            <HStack alignItems='center'space={2}>
              <Radio value='User'>User</Radio>
              <Radio value='Custom'>Custom</Radio>
            </HStack>
          </Radio.Group>
        </HStack>
        {
          setterType === 'User' ?
            <SearchBox width='35%' view={SearchView.Users} maxHeight='100px' 
              onSelect={(docRefID) => setSetter(getUserById(docRefID))}/>
            :
            <Input 
              type='text' 
              value={setterRawName} 
              placeholder='Non-user setter' 
              onChangeText={setSetterRawName} 
              width='50%' 
            />
        }
        {
          setterType === 'User' && setter !== undefined && 
          <AuthorHandle author={setter}/>
        }
        <HStack alignItems='center'space={1} width='100%'>
          <Text bold >Natural Rules: </Text>
          <Select placeholder='Natural Rules' onValueChange={(rulesString) => {
            const rules = rulesString as NaturalRules;
            setNaturalRules(rules);
          }} defaultValue={route.naturalRules}>
            {Object.values(NaturalRules).map((rules) => {
              return <Select.Item key={rules} label={rules} value={rules} />;
            })}
          </Select>
        </HStack>
        <HStack alignItems='center'space={1} width='100%'>
          <Text bold >Rope: </Text>
          <Select defaultValue={rope === undefined ? '1' : rope.toString()} 
            minWidth='90%' onValueChange={(itemValue) => setRope(parseInt(itemValue))}>
            {Ropes.map((rope) => {
              return <Select.Item key={rope} label={rope.toString()} value={rope.toString()} />;
            })}
          </Select>
        </HStack>
        <HStack alignItems='center'space={1} width='100%'>
          <Text bold >Color: </Text>
          <Select defaultValue={color}
            minWidth='90%' onValueChange={(itemValue) => setColor(itemValue)}>
            {Object.values(RouteColor).map((color) => {
              return <Select.Item key={color} label={color} value={color} />;
            })}
          </Select>
        </HStack>
        <HStack justifyContent='center' space={2}>
          <Button onPress={() => {
            setOpen(false);
          }}>
            <Text variant='button'>
              Cancel
            </Text>
          </Button>
          <Button onPress={() => {
            handleSubmit().finally( () => {
              setOpen(false);
            });
          }} alignSelf='center'>
            <Text variant='button'>Submit Changes</Text>
          </Button>
        </HStack>
      </VStack>
    </Popup>
  );

};

export default EditRoute;