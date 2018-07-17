import express from 'express'
import * as bodyParser from 'body-parser'
import mongoose from 'mongoose'
import morgan from 'morgan'
import cors from 'cors'

import PORT from './port'
import URL from './mongoUrl'
import controllers from './controllers/index'

mongoose.Promise = global.Promise
mongoose.connect(URL, () => console.log(`Connected to MongoDB: ${URL}`))

const app = express()

if(process.env.NODE_ENV !== 'test') {
    //morgan для вывода логов в консоль
    app.use(morgan('combined')); //'combined' выводит логи в стиле apache
}


app.use(cors())
app.use(bodyParser.json())
app.use(controllers)

app.listen(PORT, () => console.log(`Сервер запущен: localhost:${PORT}`))

export default app