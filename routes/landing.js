import express from 'express'
const router = express.Router()

router.get('/', (req, res, next) => {
  res.render('landing')
})

export default router
