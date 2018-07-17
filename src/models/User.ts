import mongoose from 'mongoose'

const { Schema } = mongoose

const userSchema = new Schema({
    id: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    avatar: { type: String, required: true },
    subjects: [{
        teacher: { type: Schema.Types.ObjectId, ref: 'Teacher', required: true },
        subject: { type: Schema.Types.ObjectId, ref: 'Subject', required: true },
    }],
    isAdmin: { type: Boolean, default: true },
})

const User = mongoose.model('User', userSchema)

export default User