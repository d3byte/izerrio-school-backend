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
            const user = await db.User.findOne({ id: uid }).populate({
                path: 'subjects',
                populate: 'teacher course',
            })
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
            token = jwt.sign({ id: user.id  }, secret)
            res.cookie('token', token)
            res.redirect('http://localhost:8080/auth')
        })
    })
}

export const getUser = async (req: any, res: any) => {
    const token = req.user
    const user = await db.User.findOne({ id: token.id }).populate({
        path: 'subjects',
        populate: 'teacher course',
    })
    return res.json({ user })
}

export const getUsers = async (req: any, res: any) => {
    const id = req.user.id
    const user: any = await db.User.findOne({ id: id })
    if (user.isAdmin) {
        try {
            const users = await db.User.find({ isHelper: false, isAdmin: false })
            return res.json({ users })
        } catch (error) {
            return res.json({ error: error.message })
        }
    } else {
        return res.json({ error: 'Пользователь не обладает правами администратора' })
    }
}

export const getHelpers = async (req: any, res: any) => {
    const id = req.user.id
    const user: any = await db.User.findOne({ id: id })
    if (user.isAdmin) {
        try {
            const helpers = await db.User.find({ isHelper: true }).populate('teacher')
            return res.json({ helpers })
        } catch (error) {
            return res.json({ error: error.message })
        }
    } else {
        return res.json({ error: 'Пользователь не обладает правами администратора' })
    }
}

export const addSubjectToUser = async (req: any, res: any) => {
    const id = req.user.id
    const updatedUser = await db.User.update(
        { id },
        { 
            $push: { 
                subjects: {
                    teacher: req.body.teacherId,
                    course: req.body.subjectId,
                }
            }
        },
        { new: true },
    ).populate('subjects')
    return res.json({ user: updatedUser })
}

export const turnUserIntoHelper = async (req: any, res: any) => {
    const id = req.user.id
    const user: any = await db.User.findOne({ id })
    if (user.isAdmin) {
        try {
            const updatedUser = await db.User.findByIdAndUpdate(
                req.body.userId,
                { $set: { isHelper: true, teacher: req.body.teacherId } },
                { new: true },
            )
            return res.json({ helper: updatedUser })
        } catch (error) {
            return res.json({ error: error.message })
        }
    } else {
        return res.json({ error: 'Пользователь не обладает правами администратора' })
    }
}

export const turnHelperIntoUser = async (req: any, res: any) => {
    const id = req.user.id
    const user: any = await db.User.findOne({ id })
    if (user.isAdmin) {
        try {
            const updatedUser = await db.User.findByIdAndUpdate(
                req.body.userId,
                { $set: { isHelper: false, teacher: null } },
                { new: true },
            )
            console.log(updatedUser)
            return res.json({ user: updatedUser })
        } catch (error) {
            return res.json({ error: error.message })
        }
    } else {
        return res.json({ error: 'Пользователь не обладает правами администратора' })
    }
}