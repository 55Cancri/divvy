  import express from 'express'
  import mongoose from 'mongoose'
  const Schema = mongoose.Schema
  import AccountSchema from './accounts'


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
    infusions: {
      type: Array,
      timestamps: true
    },
    accounts: {
      type: [AccountSchema],
      count: {
        type: Number,
        default: 8
      }
    },
    remainingPoints: {
      type: Number,
      default: 100
    },
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
