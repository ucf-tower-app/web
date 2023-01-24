import { Button, FormControl, Input, Text, VStack, Select } from 'native-base';
import { useState } from 'react';
import { createRoute } from '../xplat/api';
import { User } from '../xplat/types/user';
import { RouteType, RouteClassifier } from '../xplat/types/route';
import { getAllBoulderClassifiers, getAllTraverseRouteClassifiers, 
    getAllCompetitionRouteClassifiers,
    getAllLeadclimbRouteClassifiers,
    getAllTopropeRouteClassifiers } from '../xplat/api';

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

const RouteTypeList = [
    RouteType.Boulder, RouteType.Competition, RouteType.Leadclimb,
    RouteType.Toprope, RouteType.Traverse
];

const Ropes = [
    '1', '2', '3', '4', '5', '6', '7', '8', '9'
];

type refreshRoutesCallback = () => void;

// TODO: implement User search component
const CreateRoute = ({refreshRoutes}: {refreshRoutes: refreshRoutesCallback}) => {
    const [name, setName] = useState<string>('');
    const [type, setType] = useState<RouteType>();
    const [rope, setRope] = useState<number>();
    const [rawgrade, setRawgrade] = useState<number>();
    const [description, setDescription] = useState<string>();
    const [setter, setSetter] = useState<User>();
    const [overrideSetterBool, setOverrideSetterBool] = useState<boolean>(true);
    const [overrideSetterString, setOverrideSetterString] = useState<string>('');
    // Error handlers
    const [formError, setFormError] = useState(false);

    function checkRouteData(): boolean {
        if (rawgrade === undefined || name.length === 0 || type === undefined || rope === undefined)
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
                name: name!, 
                classifier: new RouteClassifier(rawgrade!, type!), 
                setter: setter,
                setterRawName: overrideSetterString,
                description: description,
                rope: rope
            })
            .then( (route) => {
                // handle successful create route (refresh Routes page or pass route to parent component)
                refreshRoutes();
            });
        return;
    }

    return (
        <FormControl isInvalid={formError} p={1}>
            <VStack space={1}>
                <Text fontSize='lg' alignSelf='center'>Create a new Route</Text>
                <FormControl.Label isRequired>Route name</FormControl.Label>
                <Input isRequired type='text' onChangeText={setName} placeholder='Name'/>
                <FormControl.Label isRequired>Route type</FormControl.Label>
                <Select selectedValue={type} accessibilityLabel='choose route type' 
                    placeholder='Route type' onValueChange={ (value) => {
                        const route_type = value as RouteType;
                        setRawgrade(undefined);
                        setType(route_type);
                    }}>
                    {RouteTypeList.map( (routetype) => {
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
                <Button alignSelf='center' onPress={submitRoute}><Text variant='button' >Create Route</Text></Button>
            </VStack>
        </FormControl>
    );
};

export default CreateRoute;