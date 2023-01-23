import { Button, FormControl, Input, Text, VStack, Select } from 'native-base';
import { useState } from 'react';
import { createRoute } from '../xplat/api';
import { User } from '../xplat/types/user';
import { RouteType, RouteClassifier } from '../xplat/types/route';

type refreshRoutesCallback = () => void;

const CreateRoute = ({refreshRoutes}: {refreshRoutes: refreshRoutesCallback}) => {
    const [name, setName] = useState<string>('');
    const [type, setType] = useState<RouteType>();
    const [rope, setRope] = useState<string>('');
    const [setter, setSetter] = useState<User>();
    const [overrideSetterUser, setOverrideSetterUser] = useState<boolean>(true);
    const [overrideSetterString, setOverrideSetterString] = useState<string>('');

    function checkRouteData(): boolean {
        if (name.length === 0)
            return false;
        if (type === undefined)
            return false;
        if (setter === undefined)
            return false;

        return true;
    }

    async function submitRoute() {
        // pacify data
        if (!checkRouteData())
            return;
        // check that no active route has the same name
        createRoute({name: name!, classifier: new RouteClassifier(0, type!), setter: setter}).then( (requestStatus) => {
            if (requestStatus === null || requestStatus === undefined)
            {
                // handle failed createRoute

                return;
            }
            // handle successful create route (refresh Routes page)
            refreshRoutes();
        });
        return;
    }

    return (
        <FormControl>
            <VStack space={1}>
                <Text fontSize='lg'>Create a new Route</Text>
                <Input type='text' onChangeText={setName} placeholder='Name'/>
                <Select selectedValue={type} accessibilityLabel='choose route type' 
                    placeholder='Select the route type' onValueChange={ (value) => {
                        const route_type = value as RouteType;
                        setType(route_type);
                    }}>
                        
                </Select>
                <Input type='text' onChangeText={setRope} placeholder='Rope'/>
                {overrideSetterUser ?
                    <Input type='text' onChangeText={setOverrideSetterString} placeholder='Setter'/>
                    :
                    <Text>This will be a custom user search component</Text>
                }
                <Button alignSelf='center' onPress={submitRoute}><Text variant='button' >Create Route</Text></Button>
            </VStack>
        </FormControl>
    );
};

export default CreateRoute;