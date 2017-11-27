import express from 'express'
const router = express.Router()

router.get('/', (req, res, next) => {
  res.render('landing', {
    url: req.originalUrl,
    company: "Beam"
  })
})

router.get('/pricing', (req, res, next) => {
  res.render('pricing', {
    url: req.originalUrl
  })
})

export default router
