import express from 'express'
const router = express.Router()
import Joi from 'joi'
import User from '../models/users'

import '../config/passport'
import passport from 'passport'
import randomstring from 'randomstring'
import bcrypt from 'bcrypt'
const saltRounds = 10


// validation schema
// properties are form names
const userSchema = Joi.object().keys({
  username: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().regex(/^[a-zA-Z0-9_-]{3,30}$/),
  confirmationPassword: Joi.any().valid(Joi.ref('password'))
})

// use as middleware in all protected routes
const isAuthenticated = (req, res, next) => {
  if(req.isAuthenticated()) {
    return next()
  } else {
    req.flash('error', "You must be signed in first.")
    res.redirect('/users/login')
  }
}

// prevent login/signup while already logged in
const isNotAuthenticated = (req, res, next) => {
  if(req.isAuthenticated()) {
    req.flash('error', "You are already logged in.")
    res.redirect('/users/dashboard')
  } else {
    return next()
  }
}



router.get('/login', isNotAuthenticated, (req, res, next) => {
  res.render('login', {
    url: req.originalUrl
  })
})


router.get('/signup', isNotAuthenticated, (req, res, next) => {
  res.render('signup', {
    url: req.originalUrl
  })
})

router.get('/verify', isNotAuthenticated, (req, res, next) => {
  res.render('verify')
})


router.get('/logout', isAuthenticated, (req, res, next) => {
  req.logout()
  req.session.destroy(() => {
    res.clearCookie('coonect.sid')
    res.redirect('/')
  })
})



// the login post route is different than all the others
router.post('/login', passport.authenticate('local', {
  successRedirect: '/users/dashboard',
  failureRedirect: '/users/login',
  failureFlash: true
}))

router.post('/signup', (req, res, next) => {
  // validates req body against user schema
  // returns object with or without error property
  const result = Joi.validate(req.body, userSchema)
  console.log("Hi!")
  // handle validations errors
  if (result.error) {
    const joiError = result.error.details[0].message

    // full url must be included on redirects!
    if (joiError.includes('confirmationPassword')) {
      req.flash('error', "The passwords do not match.")
      res.redirect('/users/signup')
      return
    }
    if (joiError.includes('length')) {
      req.flash('error', "Your name must be at least 3 characters long.")
      res.redirect('/users/signup')
      return
    }
    if(joiError.includes('pattern')) {
      req.flash('error', "Your password must be at least 3 characters long.")
      res.redirect('/users/signup')
      return
    }

  // or if no errors, save to database
  } else {
    let password = req.body.password
    bcrypt.hash(password, saltRounds, (err, hash) => {
      let user = new User()
      user.username = req.body.username
      user.email = req.body.email
      user.password = hash

      // generate secret token for mailer and store in db
      const secretToken = randomstring.generate()
      user.secretToken = secretToken
      user.active = false

      user.save((err, result) => {

        // if error, do not save user
        if (err) {
          if (err.message.indexOf('duplicate key error') > -1) {
            req.flash('error', "This user already exists.")
            res.redirect('/users/signup')
            return
          } else {
            req.flash('error', "There was a issue completing your registration.")
            res.redirect('/users/signup')
          }

        // if no error, find the user, then log them in
        } else {
          console.log("New user: ", result.username)
          User.find({}).sort({ _id:-1 }).limit(1)
          .exec((err, newuser) => {
            if (err) throw err

            req.login(newuser[0], (err) => {
              if (err) throw err

              console.log("Login success: ", newuser[0]._id)
              req.flash('error', 'Please verify your email.')
              res.redirect('/users/dashboard')
            })
          })
        }
      })
    })
  }
})

router.post('/verify', (req, res, next) => {
  // pull secret token from req body and store as variable
  const { secretToken } = req.body

  // find account that matches token
  User.findOne({ secretToken: secretToken }, (err, user) => {
    if (err) {
      req.flash('error', "No user found.")
      res.redirect('/users/verify')
    } else {
      // if user found, set active to true and erase token
      user.active = true
      user.secretToken = ''
      user.save((err, result) => {
        if (err) throw err

        req.flash('success', 'Your account has been verified.')
        res.redirect('/users/login')
      })
    }
  })
})



router.get('/dashboard', isAuthenticated, (req, res, next) => {
  res.render('dashboard', {
    url: req.originalUrl,
    title: 'Centage',
    username: req.user.username
  })
})


export default router