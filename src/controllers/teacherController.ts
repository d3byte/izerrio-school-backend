import uid from 'uid'
import jwt from 'jsonwebtoken'
import db from '../models/index'
import secret from '../secret'

export const createTeacher = async (req: any, res: any) => {
    const id = req.user
    const user: any = await db.User.findById(id)
    if (user.isAdmin) {
        const password = uid(18)
        const data = new db.Teacher({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            subject: req.body.subjectId,
            username: `${req.body.firstName}${uid(7)}`,
            password,
        })
        const createdTeacher = await data.save()
        const subject = await db.Subject.findByIdAndUpdate(req.body.subjectId, {
            $push: { teachers: createdTeacher._id }
        })
        if (createdTeacher && subject) {
            return res.json({ teacher: createdTeacher, password })
        }
    }
    return res.json({ error: 'Пользователь не обладает правами администратора' })
}

export const authorizeTeacher = async (req: any, res: any) => {
    const { username, password } = req.body
    const user: any = await db.Teacher.findOne({ username })
        .populate('subject').populate('applications')
    if (user) {
        const validPassword = await user.validatePassword(password)
        if (validPassword) {
            return res.json({ user })
        }
        return res.json({ error: 'Введён неверный пароль' })
    }
    return res.json({ error: 'Данный пользователь не существует' })
}

export const removeTeacher = async (req: any, res: any) => {
    const id = req.user
    const user: any = await db.User.findById(id)
    if (user.isAdmin) {
        const removedTeacher = await db.Teacher.findByIdAndRemove(req.body.teacherId)
        return res.json({ success: removedTeacher ? true : false })
    }
    return res.json({ error: 'Пользователь не обладает правами администратора' })
}