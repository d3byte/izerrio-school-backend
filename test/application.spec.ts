process.env.NODE_ENV = 'test'
import chai from 'chai'
import chaiHTTP from 'chai-http'
import jwt from 'jsonwebtoken'
import secret from '../src/secret'
import db from '../src/models/index'
import server from '../src/index'
import token from './utils/getUserToken'
import Application from '../src/models/Application';
import app from '../src/index';

const { Subject, Teacher } = db
const expect = chai.expect

chai.use(chaiHTTP)

describe('Model -> Application', () => {

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
    
    const applicationToCreate = {
        sum: 1500,
        system: 'qiwi',
        account: '142124',
    }

    const applicationWithError = {
        sum: 1500,
        account: '142124',
    }

    describe('Создание/удаление заявки', () => {

        it('Должен создавать заявку', async () => {
            const dataSubject = new Subject(subjectToCreate)
            const subject = await dataSubject.save()
            const dataTeacher = new Teacher({ ...teacherToCreate, subject: subject._id })
            const teacher = await dataTeacher.save()
            const teacherToken = jwt.sign({ id: teacher._id }, secret)
            chai.request(server)
                .post('/create-application')
                .set('Authorization', `Bearer ${teacherToken}`)
                .send({ ...applicationToCreate, teacher: teacher._id })
                .end((err, res) => {
                    expect(res.body.application).to.have.property('sum')
                    expect(res.body.application).to.have.property('system')
                    expect(res.body.application).to.have.property('account')
                    expect(res.body.application).to.have.property('teacher')
                    expect(res.body.application).property('isDone').to.be.false
                })
        })

        it('Не должен создавать заявку', async () => {
            const dataSubject = new Subject(subjectToCreate)
            const subject = await dataSubject.save()
            const dataTeacher = new Teacher({ ...teacherToCreate, subject: subject._id })
            const teacher = await dataTeacher.save()
            const teacherToken = jwt.sign({ id: teacher._id }, secret)
            chai.request(server)
                .post('/create-application')
                .set('Authorization', `Bearer ${teacherToken}`)
                .send({ ...applicationWithError, teacher: teacher._id })
                .end((err, res) => {
                    expect(res.body.error).to.be.string
                    expect(res.body.error).not.to.have.length(0)
                })
        })

        it('Должен удалить заявку', async () => {
            const dataSubject = new Subject(subjectToCreate)
            const subject = await dataSubject.save()
            const dataTeacher = new Teacher({ ...teacherToCreate, subject: subject._id })
            const teacher = await dataTeacher.save()
            const application = new Application({ ...applicationToCreate, teacher: teacher._id })
            application.save().then(() => {
                chai.request(server)
                    .del('/remove-application')
                    .set('Authorization', `Bearer ${token}`)
                    .send({ applicationId: application._id })
                    .end((err, res) => {
                        expect(res.body.success).to.be.true
                    })
            })
        })
        
    })

    describe('Управление состоянием заявки', () => {

        it('Должен помечать заявку как сделанную', async () => {
            const dataSubject = new Subject(subjectToCreate)
            const subject = await dataSubject.save()
            const dataTeacher = new Teacher({ ...teacherToCreate, subject: subject._id })
            const teacher = await dataTeacher.save()
            const application = new Application({ ...applicationToCreate, teacher: teacher._id })
            application.save().then(() => {
                chai.request(server)
                    .post('/set-application-as-done')
                    .set('Authorization', `Bearer ${token}`)
                    .send({ applicationId: application._id })
                    .end((err, res) => {
                        expect(res.body.success).to.be.true
                        expect(res.body.application).property('isDone').to.be.true
                    })
            })
        })
        
    })
    

})