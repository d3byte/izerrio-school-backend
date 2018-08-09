import db from '../models/index'

export const createApplication = async (req: any, res: any) => {
    const id = req.user.id
    const user: any = await db.User.findOne({ id }) || await db.Teacher.findById(id)
    if (user.isTeacher || user.isHelper) {
        try {
            const data = new db.Application({
                sum: req.body.sum,
                system: req.body.system,
                account: req.body.account,
                [user.isTeacher ? 'teacher' : 'user']: user._id
            })
            const createdApplication = await data.save()
            const updatedUser = await user.update({ $push: { applications: createdApplication._id }, $set: { balance: user.balance - req.body.sum } })
            if (createdApplication && updatedUser) {
                return res.json({ application: createdApplication })
            }
        } catch (error) {
            return res.json({ error: error.message })
        }
    }
}

export const getApplications = async (req: any, res: any) => {
    const id = req.user.id
    const user: any = await db.User.findOne({ id })
    if (user.isAdmin) {
        const applications = await db.Application.find()
        return res.json({ applications })
    } else {
        return res.json({ error: 'Пользователь не обладает правами администратора' })
    }
}

export const setApplicationAsDone = async (req: any, res: any) => {
    const id = req.user.id
    const user: any = await db.User.findOne({ id })
    if (user.isAdmin) {
        const updatedApplication: any = await db.Application.findByIdAndUpdate(
            req.body.applicationId,
            { isDone: true },
            { new: true },
        )
        user.balance -= updatedApplication.sum
        const updatedUser = await user.save()
        if (updatedUser && updatedApplication) {
            return res.json({ success: updatedApplication ? true : false, application: updatedApplication })
        }
    } else {
        return res.json({ error: 'Пользователь не обладает правами администратора' })
    }
}

export const removeApplication = async (req: any, res: any) => {
    const id = req.user.id
    const user: any = await db.User.findOne({ id })
    if (user.isAdmin) {
        const removedApplication = await db.Application.findByIdAndRemove(req.body.applicationId)
        return res.json({ success: removedApplication ? true : false })
    } else {
        return res.json({ error: 'Пользователь не обладает правами администратора' })
    }
}