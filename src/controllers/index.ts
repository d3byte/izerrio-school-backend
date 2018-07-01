import express from 'express'

import { func } from './userController'

const controllers = express()

controllers.get('/', func)

export default controllers