import express from 'express'
import expressJWT from 'express-jwt'
import secret from '../secret'

import { login, addCourseToUser } from './userController'

const controllers = express()

controllers.get('/', login)
controllers.get('/add-course', expressJWT({ secret }), addCourseToUser)

export default controllers