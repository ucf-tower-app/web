import {extendTheme} from "native-base";

const theme = extendTheme({
    components: {
        Button: {
            baseStyle: {},
            defaultProps: {
                variant: 'default'
            },
            variants: {
                popup: {
                    bg: '#0891B2'
                },
                default: {
                    bg: '#0891B2',
                    textcolor: '#FAFAFA', 
                    width: 'fit-content',
                    height: 'fit-content',
                    flexDirection: 'row',
                    marginRight: '.5%',
                    marginLeft: '.5%',
                    padRight: '.5%',
                    padLeft: '.5%'
                }
            }
        },
        Text: {
            baseStyle: {},
            defaultProps: {
                variant: 'default'
            },
            variants: {
                header: {
                    fontSize: 'large',
                    color: 'black'
                },
                button: {
                    color: 'white',
                    fontSize: 'medium'
                },
                handle: {
                    color: 'gray.400',
                    fontSize: 'sm',
                    justifyContent: 'center',
                    alignSelf: 'center',
                    flex: 1
                },
                default: {
                    color: 'inherit'
                }
            }
        }
    }
})
export default theme;