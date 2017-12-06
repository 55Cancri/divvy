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
  amount: {
    type: Number,
    default: 0,
    min: 0,
    required: true
  },
  description: {
    type: String,
    default: undefined
  },
  isGoal: {
    type: Boolean,
    default: false
  },
  amountHistory: {
    type: Array,
  }
}, {
  timestamps: true,
})

export default AccountSchema
