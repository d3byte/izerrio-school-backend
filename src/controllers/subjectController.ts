import db from '../models/index'
import mongoose, { mongo } from 'mongoose'

export const createSubject = async (req: any, res: any) => {
    const id = req.user.id
    const user: any = await db.User.findOne({ id })
    // console.log(user)
    if ((user || {}).isAdmin) {
        try {
            const data = new db.Subject({
                name: req.body.name,
                price: req.body.price,
                teachers: req.body.teachers || null
            })
            const createdSubject = await data.save()
            return res.json({ subject: createdSubject })
        } catch(error) {
            return res.json({ error: error.message })
        }
    }
    return res.json({ error: 'Пользователь не обладает правами администратора' })
}

export const addTeacherToSubject = async (req: any, res: any) => {
    const id = req.user.id
    const user: any = await db.User.findOne({ id })
    if (user.isAdmin) {
        try {
            const subject = await db.Subject.findByIdAndUpdate(req.body.id, {
                $push: { teachers: req.body.teacherId }
            }, { new: true })
            return res.json({ subject })
        } catch (error) {
            return res.json({ error: error.message })
        }
    }
    return res.json({ error: 'Пользователь не обладает правами администратора' })
}

export const removeTeacherFromSubject = async (req: any, res: any) => {
    const id = req.user.id
    const user: any = await db.User.findOne({ id })
    if (user.isAdmin) {
        const subject = await db.Subject.findByIdAndUpdate(
            req.body.id, 
            { $pullAll: { teachers: [req.body.teacherId] } },
            { new: true }
        )
        return res.json({ subject })
    }
    return res.json({ error: 'Пользователь не обладает правами администратора' })
}

export const removeSubject = async (req: any, res: any) => {
    const id = req.user.id
    const user: any = await db.User.findOne({ id })
    if (user.isAdmin) {
        const removedSubject = await db.Subject.findByIdAndRemove(req.body.subjectId)
        return res.json({ success: removedSubject ? true : false })
    }
    return res.json({ error: 'Пользователь не обладает правами администратора' })
}