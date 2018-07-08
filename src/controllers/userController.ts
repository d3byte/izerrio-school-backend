import jwt from 'jsonwebtoken'
import request from 'tinyreq'
import db from '../models/index'
import secret from '../secret'
import AppInfoManager from '../AppInfoManager'

const infoManager = new AppInfoManager()
let info = infoManager.getInfo()

export const login = async (req: any, res: any) => {
    const { code } = req.query
    info = infoManager.setField('code', code).getInfo()
    request(`https://oauth.vk.com/access_token?client_id=${info.app}&client_secret=${info.protectedKey}&code=${info.code}&redirect_uri=${info.redirect_uri}`, async (err, body) => {
        let jsonBody = JSON.parse(body)
        const fields = {
            uids: jsonBody.user_id,
            fields: 'uid,first_name,last_name,screen_name,sex,bdate,photo_big',
            access_token: jsonBody.access_token
        }
        request(`https://api.vk.com/method/users.get?uids=${fields.uids}&fields=${fields.fields}&access_token=${fields.access_token}&version=${info.version}`, async (err, body) => {
            const { response } = JSON.parse(body)
            const uid = response[0].uid
            const user = await db.User.findOne({ id: uid })
            let token: string
            if (!user) {
                const data = new db.User({ 
                    id: uid,
                    firstName: response[0].first_name,
                    lastName: response[0].last_name,
                    avatar: response[0].photo_big
                })
                const createdUser = await data.save()
                token = jwt.sign({ id: createdUser.id }, secret)
                res.cookie('token', token)
                res.redirect('http://localhost:5500/test/index.html')
            }
            token = jwt.sign({ id: user.id }, secret)
            res.cookie('token', token)
            res.redirect('http://localhost:5500/test/index.html')
        })
    })
}

export const getUser = async (req: any, res: any) => {
    const token = req.user
    const user = await db.User.findOne({ id: token.id })
    return res.json({ user })
}

export const addCourseToUser = async (req: any, res: any) => {
    const user = req.user
}