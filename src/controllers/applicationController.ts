import db from '../models/index'

export const createApplication = async (req: any, res: any) => {
    const id = req.user
    const user: any = await db.Teacher.findById(id)
    if (user) {
        const data = new db.Application({
            sum: req.body.sum,
            system: req.body.system,
            account: req.body.account,
            teacher: user._id,
        })
        const createdApplication = await data.save()
        const updatedUser = await user.update({ $push: { applications: createdApplication._id } })
        if (createdApplication && updatedUser) {
            return res.json({ application: createdApplication })
        }
    }
}

export const setApplicationAsDone = async (req: any, res: any) => {
    const id = req.user
    const user: any = await db.User.findById(id)
    if (user.isAdmin) {
        const updatedApplication = await db.Application.findByIdAndUpdate(
            req.body.applicationId,
            { isDone: true },
            { new: true },
        )
        return res.json({ success: updatedApplication ? true : false })
    }
    return res.json({ error: 'Пользователь не обладает правами администратора' })
}

export const removeApplication = async (req: any, res: any) => {
    const id = req.user
    const user: any = await db.Application.findById(id)
    if (user.isAdmin) {
        const removedApplication = await db.Application.findByIdAndRemove(req.body.applicationId)
        return res.json({ success: removedApplication ? true : false })
    }
    return res.json({ error: 'Пользователь не обладает правами администратора' })
}