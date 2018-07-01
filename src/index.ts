import express from 'express'
import * as bodyParser from 'body-parser'

import controllers from './controllers/index'

const PORT = 3000

const app = express()
app.use(bodyParser.json())
app.use(controllers)

app.listen(PORT, () => console.log(`Сервер запущен: localhost:${PORT}`))