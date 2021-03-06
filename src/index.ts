import express from 'express'
import * as bodyParser from 'body-parser'
import mongoose from 'mongoose'
import morgan from 'morgan'
import cors from 'cors'
import path from 'path'

import PORT from './port'
import URL from './mongoUrl'
import controllers from './controllers/index'
import { removeInvalidUserSubscriptions } from '../cron'

mongoose.Promise = global.Promise
mongoose.connect(URL, () => {
    console.log(`Connected to MongoDB: ${URL}`)
    // CRON
    process.env.NODE_ENV !== 'test' && removeInvalidUserSubscriptions.start()
    console.log('Started CRON successfully')
})

const app = express()

if(process.env.NODE_ENV !== 'test') {
    //morgan для вывода логов в консоль
    app.use(morgan('combined')); //'combined' выводит логи в стиле apache
}

export const folder = path.join(__dirname, '/public/')

console.log(folder)

app.use(cors())
app.use(bodyParser.json())
app.use(express.static('public'))
app.use(controllers)

app.listen(PORT, () => console.log(`Сервер запущен: localhost:${PORT}`))

export default app