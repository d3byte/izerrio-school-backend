import uid from 'uid'
import jwt from 'jsonwebtoken'
import db from '../models/index'
import secret from '../secret'

export const createTeacher = async (req: any, res: any) => {
    const id = req.user.id
    const user: any = await db.User.findOne({ id })
    if (user.isAdmin) {
        try {
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
        } catch (error) {
            return res.json({ error: error.message })
        }
    }
    return res.json({ error: 'Пользователь не обладает правами администратора' })
}

export const authorizeTeacher = async (req: any, res: any) => {
    const { username, password } = req.body
    const user: any = await db.Teacher.findOne({ username })
        .populate('subject').populate('applications')
    if (user) {
        const validPassword = password === user.password
        if (validPassword) {
            const token = jwt.sign({ id: user._id }, secret)
            return res.json({ user, token })
        }
        return res.json({ error: 'Введён неверный пароль' })
    }
    return res.json({ error: 'Данный пользователь не существует' })
}

export const removeTeacher = async (req: any, res: any) => {
    const id = req.user.id
    const user: any = await db.User.findOne({ id })
    if (user.isAdmin) {
        const removedTeacher = await db.Teacher.findByIdAndRemove(req.body.teacherId)
        return res.json({ success: removedTeacher ? true : false })
    }
    return res.json({ error: 'Пользователь не обладает правами администратора' })
}