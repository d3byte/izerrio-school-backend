import mongoose from 'mongoose'

const { Schema } = mongoose

const teacherSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    isTeacher: { type: Boolean, default: true },
    subject: { type: Schema.Types.ObjectId, ref: 'Subject', required: true },
    applications: [{ type: Schema.Types.ObjectId, ref: 'Application', default: [] }],
})

// teacherSchema.plugin(require('mongoose-bcrypt'))

const Teacher = mongoose.model('Teacher', teacherSchema)

export default Teacher