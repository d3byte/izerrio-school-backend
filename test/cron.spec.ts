process.env.NODE_ENV = 'test'
import chai from 'chai'
import db from '../src/models/index'
import moment from 'moment'
import uid from 'uid'

import { removeInvalidUserSubscriptions } from '../cron'
// import chaiHTTP from 'chai-http'
// chai.use(chaiHTTP)

const { User, Subject, Teacher } = db
const expect = chai.expect

describe('CRON', () => {

    const subjectToCreate = {
        name: 'Математика',
        price: 1500,
    }

    const teacherToCreate = {
        firstName: 'Егор',
        lastName: 'Летуновский',
        username: 'egor',
        password: 'letun',
    }

    const userToCreate = {
        id: uid(20),
        firstName: 'Тест',
        lastName: 'Пользователь ',
        avatar: 'https://pp.userapi.com/c830400/v830400931/122aee/h_CEdusVqjo.jpg?ava=1',
    }

    const addRealMonth = (d: any) => {
        var fm = moment(d).add(1, 'M');
        var fmEnd = moment(fm).endOf('month');
        return d.date() != fm.date() && fm.isSame(fmEnd.format('YYYY-MM-DD')) ? fm.add(1, 'd') : fm;  
    }    

    describe('Подписка на предметы', () => {

        it('Должен удалять предмет с истёкшей подпиской', async () => {
            const dataSubject = new Subject(subjectToCreate)
            const subject = await dataSubject.save()
            const dataTeacher = new Teacher({ ...teacherToCreate, subject: subject._id })
            const teacher = await dataTeacher.save()
            const dataUser = new User({
                ...userToCreate,
                subjects: [{
                    teacher: teacher._id,
                    subject: subject._id,
                    validUntil: moment().subtract(1, 'M')
                }],
            })
            const user = await dataUser.save()
            if (teacher && user) {
                removeInvalidUserSubscriptions.start()
            }
            
        })
        
    })    

})