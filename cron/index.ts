import cron from 'cron'
import moment from 'moment'
import db from '../src/models'
const { User } = db

export const removeInvalidUserSubscriptions = new cron.CronJob({
    cronTime: '00 00 00 * * *',
    async onTick() {
        const users: any = await User.find().populate('subjects')
        users.map((user: any) => {
            let subjectsToRemove: Array<string> = []
            for (let subject of user.subjects) {
                const difference = moment().diff(moment(subject.validUntil))
                console.log(difference)
                if (difference < 0) {
                    subjectsToRemove.push(subject.id)
                }
            }
            user.subjects = user.subjects.filter((subject: any) => !subjectsToRemove.includes(subject._id))
            user.save()
        })
    },
    // Удалить после теста
    runOnInit: true
})
