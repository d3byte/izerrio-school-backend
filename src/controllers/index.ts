import express from 'express'
import expressJWT from 'express-jwt'
import secret from '../secret'

import { login, addCourseToUser, getUser } from './userController'
import { getLink } from './infoController'

const controllers = express()

// Info
controllers.get('/get-vk-url', getLink)

// User
controllers.get('/vk-auth', login)
controllers.get('/get-user', expressJWT({ secret }), getUser)
controllers.get('/add-course', expressJWT({ secret }), addCourseToUser)

export default controllers