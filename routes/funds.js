import express from 'express'
const router = express.Router()
import User from '../models/users'
import AccountSchema from '../models/accounts'
import { isAuthenticated } from './users'


router.get('/infusions', (req, res, next) => {
  User.find({ _id: req.id })
})

// reset with:
// db.users.dropIndexes()

// db.users.findOneAndUpdate({ username: "admin" }, {$set: {remainingPoints: 100, infusions: [], accounts: []}})

// db.users.remove({email: "malin1@protonmail.ch"})


// this function returns a string. Use parseFloat.
function roundTo(n, digits) {
  let negative = false
  if (digits === undefined) {
      digits = 0
  }
  if( n < 0) {
    negative = true
    n = n * -1
  }
  let multiplicator = Math.pow(10, digits)
  n = parseFloat((n * multiplicator).toFixed(11))
  n = (Math.round(n) / multiplicator).toFixed(2)
  if( negative ) {
    n = (n * -1).toFixed(2)
  }
  console.log("Here is n from the function: ", n)
  return n
}

router.post('/infusions', (req, res, next) => {
  console.log("req.body: ", req.body.amount)
  console.log("req.user: ", req.body.user.email)
  User.findByIdAndUpdate(
    { _id: req.body.user._id },
    { $push:
      {
        infusions:
        {
          amount: req.body.amount,
          dateAdded: new Date()
        }
      },
    },
    { new: true })
  .exec()
  // !: add "1." to every account percent
  .then((user) => {
    // 1. get last infusion amount (the one just entered)
    let income = user.infusions[user.infusions.length - 1].amount

    // 1. iterate through each account object in accounts
    user.accounts.forEach((item) => {
      // 2. assign each account percent to variable
      let percentOfAccount = item.percent
      if (item.percent < 10) {

        percentOfAccount = "0" + percentOfAccount
      }
      percentOfAccount = "." + percentOfAccount
      percentOfAccount = parseFloat(percentOfAccount)
      // 3. set final amount to variable
      let finalAccountAmount = roundTo((percentOfAccount * income), 2)
      finalAccountAmount = parseFloat(finalAccountAmount)
      // 4. set account's total amount to final amount
      // toFixed should prevent save of long nums in db
      item.amount += +(finalAccountAmount).toFixed(2)
      item.amountHistory.push({
        percent: item.percent,
        amount: finalAccountAmount,
        dateRecieved: new Date()
      })
    })

    user.save()
    .then((result) => {
      res.json(result)
    })
    .catch((err) => {
      console.log("Error updating your accounts with your most recent infusion: ", err)
    })
  })
  .catch((err) => {
    console.log("New infusion error: ", err)
  })
})


router.post('/new', (req, res, next) => {
  User.findByIdAndUpdate(
    { _id: req.body.user._id },
    { $push:
      {
        accounts:
        {
          accountName: req.body.accountName,
          percent: req.body.accountPercent,
          dateCreated: new Date()
        }
      },
      $set:
      {
        remainingPoints: req.body.remainingPoints
      }
    },
    { new: true }
  )
  .exec()
  .then((result) => {
    console.log("Sent to client.")
    res.json(result)
  })
  .catch((err) => {
    console.log("Account creation error: ", err)
  })
})

// this route delivers only the specific account's info
// to the unique browser webpages
// it looks for the id in the accounts array,
// then the first object result (the account)
// the $ is the positional operator, which means
// it doesn't know where it is exactly (???)
router.get('/accounts/:id', isAuthenticated, (req, res, next) => {
  User.findOne(
    { 'accounts._id': req.params.id },
    { 'accounts.$': 1 }
  )
  .exec()
  .then((result) => {
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

router.put('/points/inc', (req, res, next) => {
  console.log("Attempted increment")
  User.findByIdAndUpdate(
    { _id: req.body.user._id },
    { $inc: { remainingPoints: -1 }},
    { new: true}
  )
  .exec()
  .then((update) => {
    res.json(update)
  })
  .catch((err) => {
    console.log("inc error: ", err)
  })
})
router.put('/points/dec', (req, res, next) => {
  console.log("Attempted decrement")
  User.findByIdAndUpdate(
    { _id: req.body.user._id },
    { $inc: { remainingPoints: 1 }},
    { new: true}
  )
  .exec()
  .then((update) => {
    res.json(update)
  })
  .catch((err) => {
    console.log("inc error: ", err)
  })
})

// perform advanced update using $ positional operator
// capture the specific account id
// look anywhere in that account obj for accountName,
// in whichever position it may be in (purpose of $)
// update it to the new name
router.put('/update/name', (req, res, next) => {
  User.update(
    { 'accounts._id': req.body.path },
    { $set: { 'accounts.$.accountName': req.body.accountName }
  })
  .exec()
  // now refind that account, and return the
  // first instance of it in the accounts array property
  .then((update) => {
    User.findOne(
      { 'accounts._id': req.body.path },
      { 'accounts.$': 1 }
    )
    .exec()
    // then send to client
    .then((result) => {
      res.json(result.accounts[0])
    })
    .catch((err) => {
      console.log("Error finding account: ", err)
    })
  })
  .catch((err) => {
    console.log("Error updating account: ", err)
  })
})

router.put('/update/percent', (req, res, next) => {

})

// change "pathid" to "path" for others
router.put('/edit/description', (req, res, next) => {
  User.update(
    { 'accounts._id': req.body.path },
    { $set: { 'accounts.$.description': req.body.description }
  })
  .exec()
  .then(update => {
    User.findOne(
      { 'accounts._id': req.body.path },
      { 'accounts.$': 1 }
    )
    .then(result => {
      res.json(result.accounts[0])
    })
    .catch(err => console.log("Error finding account: ", err))
  })
  .catch(err => console.log("Error updating description: ", err))
})



export default router