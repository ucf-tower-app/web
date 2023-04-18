import { Text, VStack, Box } from 'native-base';

const paddingTopAmount = '10px';
const paddingXAmount = '20px';

const Tutorial = () => {

  return (
    <VStack paddingX={paddingXAmount} paddingBottom={paddingTopAmount}>
      <Text bold fontSize='lg' paddingTop={paddingTopAmount}>Sign Up</Text>
      <Box background='primary.200' p='2' rounded='md'>
        <Text>
          To onboard a new Tower Staff onto the website, have them sign up on the Mobile App. Then have
          a Manager (someone with Manager status on the website, usually a Tower Lead or Head Setter) find
          their profile on the website, and promote them to Employee. They will then have access to the
          website through their login.
        </Text>
        <Text italic>
          NOTE: Passwords are protected through a trusted client and are not stored on the site.
        </Text>
      </Box>
      <Text bold fontSize='lg' paddingTop={paddingTopAmount}>Users</Text>
      <Box background='primary.200' p='2' rounded='md'>
        <Text>
          In the Tower mobile app and website, there are 6 permission levels for Users:
        </Text><Text>
          Banned - Unable to log into the app. Also all of their past content is removed.
        </Text><Text>
          Unverified - Unable to log into the app. Need to verify email to gain access.
        </Text><Text>
          Verified - Able to log into the app and view routes and posts, but cannot upload anything to the
          app. This includes posts and sends.
        </Text><Text italic>
          NOTE: If User did not sign up with a @knights.ucf.edu email, they will only be Verified status upon
          verifying their email. They will need to get an Employee to promote them on the website to Approved.
        </Text><Text>
          Approved - Able to log into the app and view routes and posts. Also able to create posts, send routes,
          and report content.
        </Text><Text italic>
          NOTE: If User signed up with a @knights.ucf.edu email, they will be automatically Approved status upon
          verifying their email.
        </Text><Text>
          Employee - Has all permissions of an Approved User. Also able to delete inappropriate content directly
          from the app. Additionally, able to log into the website and create/edit/archive routes, handle reports,
          and promote Users up to Approved status, or demote Users from Approved status or below.
        </Text><Text>
          Manager - Has all permissions of an Employee User. Additionally, able to promote Users up to Manager
          status, or demote Users from Employee status or below. Additionally, able to see a star rating of routes
          based on feedback of Users who have sent the route in the app.
        </Text><Text italic>
          NOTE: Having multiple Managers is okay.
        </Text>
      </Box>
      <Text bold fontSize='lg' paddingTop={paddingTopAmount}>Routes</Text>
      <Box background='primary.200' p='2' rounded='md'>
        <Text>
          Employees can create Routes from the home page of this site. Here you can add various information about the
          Route. Most info is required including Name, Type, Grade, Rope, Color, and Natural Rules. Employees have the
          option to add more information including Setter, an Image of the route, a Grade Modifier (+/-, a/b/c/d),
          and/or a short Description.
        </Text><Text>
          Once a Route is created, it will be added to Active Routes by default, and be visible to anyone who uses the
          website or app. An active Route can be edited or even archived.
        </Text><Text italic>
          NOTE: Once a Route is archived it stays archived forever.
        </Text>
      </Box>
      <Text bold fontSize='lg' paddingTop={paddingTopAmount}>Reports</Text>
      <Box background='primary.200' p='2' rounded='md'>
        <Text>
          The website has a view of reported content from the mobile app. Content can be deleted or absolved, and bans
          can be taken against Users.
        </Text>
      </Box>
      <Text bold fontSize='lg' paddingTop={paddingTopAmount}>FAQs</Text>
      <Box background='primary.200' p='2' rounded='md'>
        <Text>
          Employees can view and edit a modular list of Frequently Asked Questions (FAQs). These FAQs will be displayed
          on the Mobile app.
        </Text>
      </Box>
    </VStack>
  );
};

export default Tutorial;