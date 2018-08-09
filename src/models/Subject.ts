import mongoose from 'mongoose'

const { Schema } = mongoose

const subjectSchema = new Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    teachers: [{ type: Schema.Types.ObjectId, ref: 'Teacher' }],
    videos: [{ type: String }]
})

const subject = mongoose.model('Subject', subjectSchema)

export default subject