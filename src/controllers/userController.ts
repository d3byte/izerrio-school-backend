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
    const redirectUri = process.env.NODE_ENV === 'production' ? 'http://school.izerrio.pro/auth' : 'http://localhost:8080/auth'
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
            }).populate('applications')
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
                res.redirect(`${redirectUri}?token=${token}`)
            }
            token = jwt.sign({ id: user.id  }, secret)
            res.redirect(`${redirectUri}?token=${token}`)
        })
    })
}

export const getUser = async (req: any, res: any) => {
    const token = req.user
    const user = await db.User.findOne({ id: token.id }).populate({
        path: 'subjects',
        populate: 'teacher course',
    }).populate('applications')
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

export const getStatistics = async (req: any, res: any) => {
    const id = req.user.id
    const user: any = await db.User.findOne({ id: id })
    if (user.isAdmin) {
        try {
            const students = await db.User.find({ isHelper: false, isAdmin: false })
            const helpers = await db.User.find({ isHelper: true, isAdmin: false })
            const teachers = await db.Teacher.find()
            return res.json({ students, helpers, teachers })
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
    if (user) {
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

export const getHelpersOfCourse = async (req: any, res: any) => {
    const id = req.user.id
    const user: any = await db.User.findOne({ id: id })
    if (user) {
        try {
            const helpers = await db.User.find({ subject: req.body.subjectId }).populate('teacher')
            return res.json({ helpers })
        } catch (error) {
            return res.json({ error: error.message })
        }
    } else {
        return res.json({ error: 'Пользователь не авторизован' })
    }
}

export const addSubjectToUser = async (req: any, res: any) => {
    const {
        AMOUNT, us_userId, us_helperId, us_teacherId, us_subjectId
    } = req.body
    const updatedUser = await db.User.findByIdAndUpdate(
        us_userId,
        { 
            $push: { 
                subjects: {
                    teacher: us_teacherId,
                    helper: us_helperId,
                    course: us_subjectId,
                }
            }
        },
        { new: true },
    ).populate('subjects')
    const updatedHelper = await db.User.findByIdAndUpdate(
        us_helperId, 
        { $set: { balance: Math.floor(AMOUNT / 4) } }, 
        { new: true }
    )
    const updatedTeacher = await db.Teacher.findByIdAndUpdate(
        us_teacherId,
        { $set: { balance: Math.floor(AMOUNT / 4) } }, 
        { new: true }
    )
    const updatedAdmin = await db.User.update(
        { isAdmin: true },
        { $set: { balance: Math.floor(AMOUNT / 2) } }, 
        { new: true }
    )
    if (updatedUser && updatedHelper && updatedTeacher && updatedAdmin) {
        return
    }
}

export const turnUserIntoHelper = async (req: any, res: any) => {
    const id = req.user.id
    const user: any = await db.User.findOne({ id })
    if (user.isAdmin) {
        try {
            const updatedUser = await db.User.findByIdAndUpdate(
                req.body.userId,
                { $set: { isHelper: true, teacher: req.body.teacherId, subject: req.body.subjectId } },
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
                { $set: { isHelper: false, teacher: null, subject: null } },
                { new: true },
            )
            return res.json({ user: updatedUser })
        } catch (error) {
            return res.json({ error: error.message })
        }
    } else {
        return res.json({ error: 'Пользователь не обладает правами администратора' })
    }
}