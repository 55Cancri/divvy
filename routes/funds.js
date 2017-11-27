import express from 'express'
const router = express.Router()
import User from '../models/users'


router.get('/infusions', (req, res, next) => {
  User.find({ _id: req.id })
})

// reset with:
// db.users.findOneAndUpdate({username: "admin"}, {$set: {"infusions": []}})

router.post('/infusions', (req, res, next) => {
  console.log("req.body: ", req.body.amount)
  console.log("req.user: ", req.body.user.email)
  User.findByIdAndUpdate(
    { _id: req.body.user._id },
    { $push: { infusions: {
      amount: req.body.amount,
      dateAdded: new Date()
    }
  }},
    { new: true })
  .exec()
  .then((result) => {
    res.json(result)
  })
  .catch((err) => {
    console.log("New infusion error: ", err)
  })
})

router.post('/new', (req, res, next) => {
  User.findByIdAndUpdate(
    { _id: req.body.user._id },
    { $push: { accounts: {
      accountName: req.body.accountName,
      percent: req.body.accountPercent,
      dateCreated: new Date()
    }
  }},
   { new: true })
  .exec()
  .then((result) => {
    console.log("Db results: ", result)
    res.json(result.accounts)
  })
  .catch((err) => {
    console.log("Account creation error: ", err)
  })
})




export default router
