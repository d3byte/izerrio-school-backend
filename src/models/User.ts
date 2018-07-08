import mongoose from 'mongoose'

const { Schema } = mongoose

const userSchema = new Schema({
    id: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    avatar: { type: String, required: true },
    courses: [{ type: Schema.Types.ObjectId, ref: 'Course', default: null }]
})

const User = mongoose.model('User', userSchema)

export default User