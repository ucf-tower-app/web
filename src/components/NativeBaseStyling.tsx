import {extendTheme} from 'native-base';

const theme = extendTheme({
    components: {
        View: {
            baseStyle: {
                Modal: {
                    height: '100vh',
                }
            }
        },
        Modal: {
            baseStyle: {
                alignItems: 'center',
                justifyContent: 'center',

                content: {
                    bg: 'white',
                    width: '100%',
                    height: '100%',
                    borderRadius: 0,
                    shadow: 0,
                    borderWidth: 0,
                    p: 0,
                    m: 0
                },
            },
        },
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
                profileName: {
                    fontSize: '2xl',
                    fontWeight: 'bold',
                    color: 'black',
                    textAlignVertical: 'center'
                },
                profileHandle: {
                    fontSize: 'md',
                    color: 'gray.400',
                    alignSelf: 'center'
                },
                profileBio: {
                    fontSize: 'md',
                    color: 'black',
                    noOfLines: 4
                },
                profileStat: {
                    fontSize: 'md',
                    color: 'gray.400',
                    alignSelf: 'center'
                },
                header: {
                    fontSize: 'large',
                    color: 'black'
                },
                button: {
                    color: 'white',
                    fontSize: 'medium'
                },
                displayname: {
                    fontSize: 'md',
                    color: 'black',
                    justifyContent: 'center',
                    alignSelf: 'center',
                },
                handle: {
                    color: 'gray.400',
                    fontSize: 'sm',
                    justifyContent: 'center',
                    alignSelf: 'center',
                    flex: 1
                },
                body: {
                    fontSize: 'md',
                    color: 'black'
                },
                default: {
                    color: 'inherit'
                }
            }
        }
    }
});
export default theme;