import express from 'express'

import { func } from './handlers'

const controllers = express()

controllers.get('/', func)

export default controllers