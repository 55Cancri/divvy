import express from 'express'
import mongoose from 'mongoose'
const Schema = mongoose.Schema

let UserSchema = new Schema ({
  name: {
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
  accounts: []
}, {
  timestamps: true,
})

// first parameter is the name of the collection
// if collection doesn't exist, it will be created
const User = mongoose.model('users', UserSchema)
export default User
