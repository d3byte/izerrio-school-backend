import mongoose from 'mongoose'

const { Schema } = mongoose

const userSchema = new Schema({
    id: { type: String, required: true },
    domain: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    nickname: String,
    email: { type: String, required: true },
    courses: [{ type: Schema.Types.ObjectId, ref: 'Course', default: null }]
})

const User = mongoose.model('User', userSchema)

export default User