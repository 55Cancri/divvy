import express from 'express'
const router = express.Router()

router.get('/login', (req, res, next) => {
  res.render('login')
})

router.post('/login', (req, res, next) => {
  res.render('login')
})

router.get('/signup', (req, res, next) => {
  res.render('signup')
})

router.post('/signup', (req, res, next) => {

})

export default router