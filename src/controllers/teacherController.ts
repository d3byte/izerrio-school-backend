import nodemailer from 'nodemailer'
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
                email: req.body.email,
                username: `${req.body.firstName}${uid(7)}`,
                password,
            })
            const createdTeacher: any = await data.save()
            const subject = await db.Subject.findByIdAndUpdate(req.body.subjectId, {
                $push: { teachers: createdTeacher._id }
            }, { new: true })
            
            let transporter = nodemailer.createTransport({
                host: 'smtp.mail.ru',
                port: 465,
                secure: true, 
                auth: {
                    user: 'info@izerrio.pro ',
                    pass: 'H-SrP85tdSqi'
                }
            });
        
            // setup email data with unicode symbols
            let mailOptions = {
                from: `iZerrio School <info@izerrio.pro>`, // sender address
                to: req.body.email, // list of receivers
                subject: 'Регистрация на iZerrio School', // Subject line
                text: `Вы были зарегистрированы на school.izerrio.pro. Ваш логин: ${createdTeacher.username}, пароль: ${createdTeacher.password}`, // plain text body
                html: `Вы были зарегистрированы на school.izerrio.pro. <br> Ваш логин: ${createdTeacher.username}, пароль: ${createdTeacher.password}` // html body
            };
        
            // send mail with defined transport object
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return console.log(error);
                }
                console.log('Message sent: %s', info.messageId);
        
            });
            if (createdTeacher && subject) {
                return res.json({ teacher: { ...createdTeacher, subject }, password })
            }
        } catch (error) {
            return res.json({ error: error.message })
        }
    } else {
        return res.json({ error: 'Пользователь не обладает правами администратора' })
    }
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

export const getTeacher = async (req: any, res: any) => {
    const id = req.user.id
    const teacher: any = await db.Teacher.findById(id).populate('applications').populate('subject')
    if (teacher) {
        return res.json({ user: teacher })
    } else {
        return res.json({ error: 'Пользователь не существует' })
    }
}

export const getTeachers = async (req: any, res: any) => {
    const id = req.user.id
    const user: any = await db.User.findOne({ id: id })
    if (user.isAdmin) {
        try {
            const teachers = await db.Teacher.find().populate('applications').populate('subject')
            return res.json({ teachers })
        } catch (error) {
            return res.json({ error: error.message })
        }
    } else {
        return res.json({ error: 'Пользователь не обладает правами администратора' })
    }
}

export const getStudents = async (req: any, res: any) => {
    const id = req.user.id
    const user: any = await db.Teacher.findById(id)
    if (user.isTeacher) {
        try {
            const students = await db.User.find({ teacher: id })
            return res.json({ students })
        } catch (error) {
            return res.json({ error: error.message })
        }
    } else {
        return res.json({ error: 'Пользователь не существует' })
    }
}

export const removeTeacher = async (req: any, res: any) => {
    const id = req.user.id
    const user: any = await db.User.findOne({ id })
    if (user.isAdmin) {
        const removedTeacher = await db.Teacher.findByIdAndRemove(req.body.teacherId)
        return res.json({ success: removedTeacher ? true : false })
    } else {
        return res.json({ error: 'Пользователь не обладает правами администратора' })
    }
}