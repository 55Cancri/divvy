import express from 'express'
const router = express.Router()
import Joi from 'joi'
import User from '../models/users'

import bcrypt from 'bcrypt'
const saltRounds = 10


// validation schema
// properties are form names
const userSchema = Joi.object().keys({
  name: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().regex(/^[a-zA-Z0-9_-]{3,30}$/),
  confirmationPassword: Joi.any().valid(Joi.ref('password'))
})


router.get('/login', (req, res, next) => {
  res.render('login')
})

router.get('/signup', (req, res, next) => {
  res.render('signup')
})


router.post('/login', (req, res, next) => {
  res.render('login')
})


router.post('/signup', (req, res, next) => {

  // validates req body against user schema
  // returns object with or without error property
  const result = Joi.validate(req.body, userSchema)

// handle validations errors
  if (result.error) {

    const matchingPasswords = result.error.details[0].message.indexOf("\"confirmationPassword\" must be one of [ref:password]")

    const nameToShort = result.error.details[0].message.indexOf("length must be at least 3 characters long")

    const passwordToShort = result.error.details[0].message.indexOf("fails to match the required pattern: /^[a-zA-Z0-9_-]{3,30}$/")

    if (matchingPasswords !== -1) {
      req.flash('error', "The passwords do not match.")
      res.redirect('/users/signup')
      return
    }
    if (nameToShort !== -1) {
      req.flash('error', "Your name must be at least 3 characters long.")
      res.redirect('/users/signup')
      return
    }
    if(passwordToShort !== -1) {
      req.flash('error', "Your password must be at least 3 characters long.")
      res.redirect('/users/signup')
      return
    }

  // or if no errors, save to database
  } else {
    let password = req.body.password
    bcrypt.hash(password, saltRounds, (err, hash) => {
      let user = new User()
      user.name = req.body.name
      user.email = req.body.email
      user.password = hash

      user.save((err, result) => {

        // if error, do not save user
        if (err){
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
          console.log("New user: ", result.name)
          User.find({}).sort({ _id:-1 }).limit(1)
          .exec((err, newuser) => {
            if (err) throw err

          })
        }
      })
    })
  }

  User.findOne({ 'email': result.value.email }, (err, result) => {
    if (err) throw err


  })

})

export default router