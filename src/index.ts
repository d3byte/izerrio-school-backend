import express from 'express'
import * as bodyParser from 'body-parser'
import mongoose from 'mongoose'
import cors from 'cors'

import controllers from './controllers/index'

mongoose.Promise = global.Promise
mongoose.connect('mongodb://localhost:27017/izerrio_school', 
    () => console.log('Connected to MongoDB'))

const PORT = 3000

const app = express()

app.use(cors())
app.use(bodyParser.json())
app.use(controllers)

app.listen(PORT, () => console.log(`Сервер запущен: localhost:${PORT}`))