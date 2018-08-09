import mongoose from 'mongoose'

const { Schema } = mongoose

const applicationSchema = new Schema({
    sum: { type: Number, required: true },
    system: { type: String, required: true },
    account: { type: String, required: true },
    teacher: { type: Schema.Types.ObjectId, ref: 'Teacher' },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    isDone : { type: Boolean, default: false },
})

const Application = mongoose.model('Application', applicationSchema)

export default Application