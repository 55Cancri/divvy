import express from 'express'
const router = express.Router()
import User from '../models/users'
import AccountSchema from '../models/accounts'

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
    // res.redirect('/funds/accounts/' + result.accounts[result.accounts.length - 1]._id)
  })
  .catch((err) => {
    console.log("Account creation error: ", err)
  })
})

router.get('/accounts/:id', (req, res, next) => {
  User.findOne(
    { 'accounts._id': req.params.id },
    { 'accounts.$': 1 }
  )
  .exec()
  .then((result) => {
    console.log(result.accounts[0])
    res.render('account-specs', {
      url: req.originalUrl,
      account: result.accounts[0],
      user: req.user
    })
  })
  .catch((err) => {
    console.log("User query error: ", err)
  })
})

router.post('/points/inc', (req, res, next) => {
  console.log("You found me!")
  User.findByIdAndUpdate(
    { _id: req.user.id },
    { $inc: { remainingPoints: -1 }},
    { upsert: true },
    { new: true })
  .exec()
  .then(user => {
    console.log("Hello there: ", user)
  })
})
router.post('/points/dec', (req, res, next) => {
  console.log("You found me!")
  User.findByIdAndUpdate(
    { _id: req.user.id },
    { $inc: { remainingPoints: 1 }},
    { upsert: true },
    { new: true })
  .exec()
  .then(user => {
    console.log("Hello there: ", user)
  })
})




export default router
