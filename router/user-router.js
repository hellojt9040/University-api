const express = require('express')
const userRouter = new express.Router()
const auth = require('../middlewares/auth')
const UserController = require('../controllers/user-controller')
const extractFile = require('../middlewares/extract-file')


//  AboutUs
userRouter.post('/api/aboutUs', extractFile, UserController.aboutUs)

//  logging in
userRouter.post('/api/user/login', UserController.userLogin)

//  logout
userRouter.post('/api/user/logout', auth, UserController.userLogout)

//  Signup
userRouter.post('/api/user/newUser', extractFile, UserController.userSignup)

//  Get user avatar
userRouter.get('/api/user/:userId/avatar', auth, UserController.getUserAvatar)



module.exports = userRouter
