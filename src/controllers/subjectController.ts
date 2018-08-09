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
                teachers: req.body.teachers || []
            })
            const createdSubject = await data.save()
            return res.json({ subject: createdSubject })
        } catch(error) {
            return res.json({ error: error.message })
        }
    } else {
        return res.json({ error: 'Пользователь не обладает правами администратора' })
    }
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
    } else {
        return res.json({ error: 'Пользователь не обладает правами администратора' })
    }
}

export const removeTeacherFromSubject = async (req: any, res: any) => {
    const id = req.user.id
    const user: any = await db.User.findOne({ id })
    if (user.isAdmin) {
        const subject = await db.Subject.findByIdAndUpdate(
            req.body.id, 
            { $pullAll: { teachers: [req.body.teacherId] } },
            { new: true }
        ).populate('teachers')
        return res.json({ subject })
    } else {
        return res.json({ error: 'Пользователь не обладает правами администратора' })
    }
}

export const getSubjects = async (req: any, res: any) => {
    const id = req.user.id
    const user: any = await db.User.findOne({ id: id })
    if (user) {
        try {
            const subjects = await db.Subject.find()
            return res.json({ subjects })
        } catch (error) {
            return res.json({ error: error.message })
        }
    } else {
        return res.json({ error: 'Пользователь не авторизован' })
    }
}

export const getSubject = async (req: any, res: any) => {
    const id = req.user.id
    const user: any = await db.User.findOne({ id })
    if (user) {
        try {
            const subject = await db.Subject.findById(req.body.subjectId).populate('teachers')
            return res.json({ subject })
        } catch (error) {
            return res.json({ error: error.message })
        }
    } else {
        return res.json({ error: 'Пользователь не авторизован' })
    }
}

export const addVideoToSubject = async (req: any, res: any) => {
    const id = req.user.id
    const user: any = await db.User.findOne({ id: id })
    if (user.isTeacher || user.isAdmin) {
        try {
            const subject = await db.Subject.findByIdAndUpdate(req.body.subjectId, { $push: { videos: req.body.video } }, { new: true })
            return res.json({ subject })
        } catch (error) {
            return res.json({ error: error.message })
        }
    } else {
        return res.json({ error: 'Пользователь не авторизован' })
    }
}

export const removeVideoFromSubject = async (req: any, res: any) => {
    const id = req.user.id
    const user: any = await db.User.findOne({ id: id })
    if (user.isTeacher || user.isAdmin) {
        try {
            const subject = await db.Subject.findByIdAndUpdate(req.body.subjectId, { $pullAll: { videos: [req.body.video] } }, { new: true })
            return res.json({ subject })
        } catch (error) {
            return res.json({ error: error.message })
        }
    } else {
        return res.json({ error: 'Пользователь не авторизован' })
    }
}

export const removeSubject = async (req: any, res: any) => {
    const id = req.user.id
    const user: any = await db.User.findOne({ id })
    if (user.isAdmin) {
        const removedSubject = await db.Subject.findByIdAndRemove(req.body.subjectId)
        return res.json({ success: removedSubject ? true : false })
    } else {
        return res.json({ error: 'Пользователь не обладает правами администратора' })
    }
}