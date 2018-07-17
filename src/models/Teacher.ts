import mongoose from 'mongoose'

const { Schema } = mongoose

const teacherSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true, bcrypt: true },
    subject: { type: Schema.Types.ObjectId, ref: 'Subject', required: true },
    applications: [{ type: Schema.Types.ObjectId, ref: 'Application', default: null }],
})

teacherSchema.plugin(require('mongoose-bcrypt'))

const Teacher = mongoose.model('Teacher', teacherSchema)

export default Teacher