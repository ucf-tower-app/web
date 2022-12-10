import { NativeBaseProvider, Text, Box } from "native-base";

const PageNotFound = () => {
    return (
        <NativeBaseProvider>
            <Box alignSelf={'center'} alignItems={'center'} top='50vh'>
                <Text fontSize={'large'}>
                    Error 404, page not found.
                </Text>
            </Box>
        </NativeBaseProvider>
    )
}

export default PageNotFound;