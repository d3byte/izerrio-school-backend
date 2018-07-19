process.env.NODE_ENV = 'test'
import chai from 'chai'
import chaiHTTP from 'chai-http'
import db from '../src/models/index'
import server from '../src/index'
import token from './utils/getUserToken'

const { Subject, Teacher, User } = db
const expect = chai.expect

chai.use(chaiHTTP)

describe('Model -> User', () => {

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
        id: '1231232',
        firstName: 'Тест',
        lastName: 'Пользователь ',
        avatar: 'https://pp.userapi.com/c830400/v830400931/122aee/h_CEdusVqjo.jpg?ava=1',
    }

    describe('Смена прав наставника у пользователя', () => {

        it('Должен делать из пользователя наставника', async () => {
            const dataSubject = new Subject(subjectToCreate)
            const subject = await dataSubject.save()
            const teacher: any = new Teacher({
                ...teacherToCreate,
                subject: subject._id,
            })
            const dataUser = new User(userToCreate)
            const user = await dataUser.save()
            if (user) {
                teacher.save().then(() => {
                    chai.request(server)
                        .post('/user-to-helper')
                        .set('Authorization', `Bearer ${token}`)
                        .send({ userId: user._id, teacherId: teacher._id })
                        .end((err, res) => {
                            expect(res.body.helper).property('isHelper').to.be.true
                        })
                })
            }
        })

        it('Должен делать из наставника пользователя', async () => {
            const dataSubject = new Subject(subjectToCreate)
            const subject = await dataSubject.save()
            const dataTeacher: any = new Teacher({
                ...teacherToCreate,
                subject: subject._id,
            })
            const teacher = await dataTeacher.save()
            const dataUser = new User({
                ...userToCreate,
                isHelper: true,
                teacher: teacher._id,
            })
            const user = await dataUser.save()
            chai.request(server)
                .post('/helper-to-user')
                .set('Authorization', `Bearer ${token}`)
                .send({ userId: user._id })
                .end((err, res) => {
                    expect(res.body.user).property('isHelper').to.be.false
                })
        })

    })

})