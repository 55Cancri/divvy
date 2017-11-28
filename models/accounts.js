import express from 'express'
import mongoose from 'mongoose'
const Schema = mongoose.Schema

let AccountSchema = new Schema ({
  accountName: {
    type: String,
    trim: true,
    required: true,
    unique: [true, "You already have an account with this name."],
  },
  percent: {
    type: Number,
    min: 1,
    max: 100,
    required: true
  },
  description: {
    type: String,
  },
  isGoal: {
    type: Boolean,
    default: false
  },
  accountHistory: {
    type: Array,
  }
}, {
  timestamps: true,
})

export default AccountSchema
