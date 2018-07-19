import cron from 'cron'
import moment from 'moment'
import db from '../src/models'
import { resolve } from 'path';
import { resolveCname } from 'dns';
const { User } = db

export const removeInvalidUserSubscriptions = new cron.CronJob({
    cronTime: '00 00 00 * * *',
    async onTick() {
        const users: any = await User.find().populate('subjects')
        let promises: Array<Promise<any>> = []
        users.map((user: any) => {
            let subjectsToRemove: Array<string> = []
            for (let item of user.subjects) {
                const difference = moment().diff(item.validUntil)
                if (difference > 0) {
                    subjectsToRemove.push(item.subject)
                }
            }
            user.subjects = user.subjects.filter((item: any) => !subjectsToRemove.includes(item.subject))
            promises.push(user.save())
        })
        Promise.all(promises).then(async res => {
            console.log('Пользователи после обработки')
            console.log(await User.find().populate('subjects'))
        })
    },
    runOnInit: process.env.NODE_ENV === 'test' ? true : false,
})
