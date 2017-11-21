import express from 'express'
import mongoose from 'mongoose'
const Schema = mongoose.Schema

let UserSchema = new Schema ({
  username: {
    type: String,
    unique: [true, "This username is taken."],
    trim: true,
  },
  email: {
    type: String,
    unique: [true, "This email is already being used."],
    trim: true
  },
  password: {
    type: String,
    trim: true
  },
  accounts: [],
  secretToken: {
    type: String
  },
  active: {
    type: Boolean,
    default: false
  },
  isAdmin: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
})

// first parameter is the name of the collection
// if collection doesn't exist, it will be created
const User = mongoose.model('users', UserSchema)
export default User
