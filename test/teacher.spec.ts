process.env.NODE_ENV = 'test'
import chai from 'chai'
import chaiHTTP from 'chai-http'
import db from '../src/models/index'
import server from '../src/index'
import token from './utils/getUserToken'

const { Subject, Teacher } = db
const expect = chai.expect

chai.use(chaiHTTP)

describe('Model -> Teacher', () => {

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
    
    const teacherWithError = {
        firstName: 'Егор',
        username: 'egor',
        password: 'letun',
    }

    describe('Создание/удаление учителя', () => {

        it('Должен создавать учителя', async () => {
            const dataSubject = new Subject(subjectToCreate)
            const subject = await dataSubject.save()
            chai.request(server)
                .post('/create-teacher')
                .set('Authorization', `Bearer ${token}`)
                .send({ ...teacherToCreate, subjectId: subject._id })
                .end((err, res) => {
                    expect(res.body.teacher).to.have.property('subject')
                    expect(res.body.teacher).to.have.property('firstName')
                    expect(res.body.teacher).to.have.property('lastName')
                    expect(res.body.teacher).to.have.property('username')
                    expect(res.body.teacher).to.have.property('password')
                })
        })

        it('Не должен создавать учителя при несоблюдении модели', async () => {
            const dataSubject = new Subject(subjectToCreate)
            const subject = await dataSubject.save()
            chai.request(server)
                .post('/create-teacher')
                .set('Authorization', `Bearer ${token}`)
                .send({ ...teacherWithError, subjectId: subject._id })
                .end((err, res) => {
                    expect(res.body.error).to.be.string
                    expect(res.body.error).not.to.have.length(0)
                })
        })

        it('Должен удалять учителя', async () => {
            const dataSubject = new Subject(subjectToCreate)
            const subject = await dataSubject.save()
            const teacher: any = new Teacher({
                ...teacherToCreate,
                subject: subject._id,
            })
            teacher.save().then(() => {
                chai.request(server)
                    .del('/remove-teacher')
                    .set('Authorization', `Bearer ${token}`)
                    .send({ teacherId: teacher._id })
                    .end((err, res) => {
                        expect(res.body.success).to.be.true
                    })
            })
        })
    })

    describe('Авторизация учителя', () => {

        it('Должен авторизовать учителя', async () => {
            const dataSubject = new Subject(subjectToCreate)
            const subject = await dataSubject.save()
            const teacher: any = new Teacher({
                ...teacherToCreate,
                subject: subject._id,
            })
            teacher.save().then(() => {
                chai.request(server)
                    .post('/auth-teacher')
                    .send({ username: teacher.username, password: teacher.password })
                    .end((err, res) => {
                        expect(res.body.token).not.to.have.length(0)
                        expect(res.body.user).to.have.property('applications')
                        expect(res.body.user).to.have.property('subject')
                        expect(res.body.user).to.have.property('firstName')
                        expect(res.body.user).to.have.property('lastName')
                        expect(res.body.user).to.have.property('username')
                        expect(res.body.user).to.have.property('password')
                    })
            })
        })

        it('Не должен авторизовать учителя', async () => {
            const dataSubject = new Subject(subjectToCreate)
            const subject = await dataSubject.save()
            const teacher: any = new Teacher({
                ...teacherToCreate,
                subject: subject._id,
            })
            teacher.save().then(() => {
                chai.request(server)
                    .post('/auth-teacher')
                    .send({ username: teacher.username, password: teacher.password + '123' })
                    .end((err, res) => {
                        expect(res.body.error).to.be.string
                        expect(res.body.error).not.to.have.length(0)
                    })
            })
        })
    })

})