process.env.NODE_ENV = 'test'
import chai from 'chai'
import chaiHTTP from 'chai-http'
import db from '../src/models/index'
import server from '../src/index'
import secret from '../src/secret'
import jwt from 'jsonwebtoken'

const { Subject, Teacher } = db
const expect = chai.expect

chai.use(chaiHTTP)

describe('INFO', () => {

    describe('Добавление видео', () => {

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

        it('Должен добавлять видео', async () => {
            const dataSubject = new Subject(subjectToCreate)
            const subject = await dataSubject.save()
            const dataTeacher = new Teacher({ ...teacherToCreate, subject: subject._id })
            const teacher = await dataTeacher.save()
            const teacherToken = jwt.sign({ id: teacher._id }, secret)
            chai.request(server)
                .post(`/link-video`)
                .set('Authorization', `Bearer ${teacherToken}`)
                .send({ url: 'https://www.youtube.com/watch?v=rXxCr3Kx9vw' })
                .end((err, res) => {
                    expect(res.body.subject).property('videos').not.to.have.length(0)
                })
        })

    })

})