import jwt from 'jsonwebtoken'
import secret from '../src/secret'

// const id = '35234985b4e27708a8662b7c4e79cb04'
const id = '35234984'

export default jwt.sign({ id }, secret)
