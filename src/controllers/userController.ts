import jwt from 'jsonwebtoken'
import db from '../models/index'
import secret from '../secret'

export const login = async (req: any, res: any) => {
    const { id } = req.body
    const user = await db.User.findOne({ id })
    if (!user) {
        const data = new db.User(req.body)
        const createdUser = await data.save()
        const token = jwt.sign({ id: createdUser.id }, secret)
        return res.json({ success: true, user: createdUser, token })
    }
    const token = jwt.sign({ id: user.id }, secret)
    return res.json({ success: true, user, token })
}

export const addCourseToUser = async (req: any, res: any) => {
    const user = req.user
}