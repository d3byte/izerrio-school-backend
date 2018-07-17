process.env.NODE_ENV = 'test'
import mongoose from 'mongoose'
import chai from 'chai'
import chaiHTTP from 'chai-http'
import db from '../src/models/index'
import server from '../src/index'
import token from './getUserToken'

const { Subject, Teacher } = db
const expect = chai.expect

chai.use(chaiHTTP)

describe('Model -> Subject', () => {
    before(done => {
        Subject.remove({}, err => {
            done()
        })
    })

    const subjectToCreate = {
        name: 'Математика',
        price: 1500,
    }

    const subjectWithError = {
        name: 'Математика',
    }

    const teacherToCreate = {
        firstName: 'Егор',
        lastName: 'Летуновский',
        username: 'egor',
        password: 'letun',
    }

    describe('Создание/удаления предмета', () => {

        it('Должен создавать предмет', () => {
            chai.request(server)
                .post('/create-subject')
                .set('Authorization', `Bearer ${token}`)
                .send(subjectToCreate)
                .end((err, res) => {
                    expect(res.body.subject).to.have.property('teachers')
                })
        })

        it('Не должен создавать предмет при несоблюдении модели', () => {
            chai.request(server)
                .post('/create-subject')
                .set('Authorization', `Bearer ${token}`)
                .send(subjectWithError)
                .end((err, res) => {
                    expect(res.body.error).to.be.string
                    expect(res.body.error).not.to.have.length(0)
                })
        })

        it('Должен удалять предмет', async () => {
            const subject = new Subject(subjectToCreate)
            subject.save().then(createdSubject => {
                chai.request(server)
                    .del('/remove-subject')
                    .set('Authorization', `Bearer ${token}`)
                    .send({ subjectId: createdSubject._id })
                    .end((err, res) => {
                        expect(res.body.success).to.be.true
                    })
            })
        })
    })

    describe('Добавление/удаления учителя', () => {

        it('Должен добавлять учителя в предмет', async () => {
            const dataSubject = new Subject(subjectToCreate)
            const subject = await dataSubject.save()
            const teacher: any = new Teacher({
                ...teacherToCreate,
                subject: subject._id,
            })
            teacher.save().then(() => {
                chai.request(server)
                    .post('/add-teacher-to-subject')
                    .set('Authorization', `Bearer ${token}`)
                    .send({ id: teacher.subject, teacherId: teacher._id })
                    .end((err, res) => {
                        expect(res.body.subject).to.have.property('_id')
                        expect(res.body.subject).to.have.property('name')
                        expect(res.body.subject).to.have.property('price')
                        expect(res.body.subject).to.have.property('teachers')
                        expect(res.body.subject.teachers).not.to.have.length(0)
                    })
            })
        })

        it('Должен удалять учителя из предмета', async () => {
            const dataSubject = new Subject(subjectToCreate)
            const subject = await dataSubject.save()
            const dataTeacher: any = new Teacher({
                ...teacherToCreate,
                subject: subject._id,
            })
            const teacher = await dataTeacher.save()
            Subject.update({ $push: { teachers: teacher._id } }, { new: true })
                .then(newSubject => {
                    chai.request(server)
                        .post('/remove-teacher-from-subject')
                        .set('Authorization', `Bearer ${token}`)
                        .send({ id: teacher.subject, teacherId: teacher._id })
                        .end((err, res) => {
                            expect(res.body.subject).to.have.property('_id')
                            expect(res.body.subject).to.have.property('name')
                            expect(res.body.subject).to.have.property('price')
                            expect(res.body.subject).to.have.property('teachers')
                            expect(res.body.subject.teachers).to.have.length(0)
                        })
                })
        })
    })

})