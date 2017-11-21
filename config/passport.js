// this file will be required in users.js route for passport

import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import bcrypt from 'bcrypt'
import User from '../models/users'

// passport serialize user
// only user_id to serialize session so session data is small
passport.serializeUser((user, done) => {
  done(null, user.id)
})

// passport deserialize user
// use that user_id when we want full access to user object
passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    done(null, user)
  })
})



// passport strategy
// gets username and password, then proceeds to check if in db
// if user exists, give green light to passport to login user
passport.use(new LocalStrategy(
  (username, password, done) => {

    // first check if the user even exists in the db
    User.findOne({ username: username }, (err, user) => {
      if (err) {
        done(err)
        // if user does exist, compare both hashed passwords
      } else if (user) {
        const hash = user.password
        bcrypt.compare(password, hash, (err, isMatch) => {
          if (isMatch) {
            console.log("login success.")
            done(null, user)
          } else {
            console.log('login failure.')
            done(null, false, {
              message: "Invalid password."
            })
          }
        })
      } else {
        done(null, false, {
          message: "Invalid username."
        })
      }
    })
  }
))












/*
in a typical web application, the creditions used to authenticate a user, such as that provided on a data form like their username and password, is only sent to the server once. And then, if that authentication succeeds, a session will be established and the cookie will be set in the users broswers. Each subsequent request will not contain the senstive credentials, but rather a unique cookie that identifies the session. Passport serializes and deserializes user instances to and from the session. SerializeUser determines which data of the user object should be stored in the session. DeserializeUser uses that data to get a handle on the entire user object.
*/