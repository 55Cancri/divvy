import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'

// passport serialize user

// passport deserialize user

// passport strategy


/*
in a typical web application, the creditional used to authenticate a user, such as that provided on a data form like their username and password, is only sent to the server once. And then, if that authentication succeeds, a session will be established and the cookie will be set in the users broswers. Each subsequent request will not contain the senstive credentials, but rather a unique cookie that identifies the session. Passport serializes and deserializes user instances to and from the session. SerializeUser determines which data of the user object should be stored in the session. DeserializeUser uses that data to get a handle on the entire user object.
*/