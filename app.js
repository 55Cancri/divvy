// default modules
import express from 'express'
import path from 'path'
import favicon from 'serve-favicon'
import logger from 'morgan'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import sassMiddleware from 'node-sass-middleware'
import stripe from 'stripe'

// authentication modules
// import flash from 'express-flash-messages'
import flash from 'connect-flash'
import session from 'express-session'
import mongoose from 'mongoose'
import connectMongo from 'connect-mongo'
import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import bcrypt from 'bcrypt'

const MongoStore = connectMongo(session)

import router from './routes/landing'
import users from './routes/users'



// database connection
mongoose.Promise = global.Promise
mongoose.connect('mongodb://localhost/divvy', {
  useMongoClient: true
})
.then(console.log("Successfully connected to database."))

const gracefulExit = () => {
  mongoose.connection.close(() => {
    console.log('Disconnected from database.')
    process.exit(0)
  })
}

// if process ends, close database connection
process.on('SIGINT', gracefulExit).on('SIGTERM', gracefulExit)



// start of app
const app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true, // true = .sass and false = .scss
  sourceMap: true
}))
app.use(express.static(path.join(__dirname, 'public')))

// required for flash messages to work
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: mongoose.connection
  }),
  cookie: {
    // cookie expires after 3 hours and logouts user
    maxAge: 180 * 60 * 1000
  }
}))

// must be below session cookie parser
app.use(passport.initialize())
app.use(passport.session())

// need sessions configured in order work
app.use(flash())

// error_messages and success_messages are now global
// they will be used in the pug "layout" file
// isAuthenticated is the middleware you add on routes
app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success')
  res.locals.error_messages = req.flash('error')
  res.locals.isAuthenticated = req.user ? true : false
  next()
})

app.use('/', router)
app.use('/users', users)


// catch 404 and forward to error handler
app.use((req, res, next) => {
  let err = new Error('Not Found')
  err.status = 404
  next(err)
})


// render error page in views as error if in environment
if (app.get('env') === 'development') {
  app.use((err, req, res, next) => {
    res.status(err.status || 500)
    res.render('error', {
      message: err.message,
      error: err
    })
  })
}

// render error page in views as empty obj if in production
app.use((err, req, res, next) => {
  res.status(err.status || 500)
  res.render('error', {
    message: err.message,
    error: {}
  })
})

module.exports = app
