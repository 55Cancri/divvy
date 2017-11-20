import express from 'express'
const router = express.Router()

router.get('/', (req, res, next) => {
  res.render('profile', { title: 'Centage' })
})

export default router
