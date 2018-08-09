import mongoose from 'mongoose'
import moment from 'moment'

const addRealMonth = (d: any) => {
    var fm = moment(d).add(1, 'M');
    var fmEnd = moment(fm).endOf('month');
    return d.date() != fm.date() && fm.isSame(fmEnd.format('YYYY-MM-DD')) ? fm.add(1, 'd') : fm;  
}

const { Schema } = mongoose

const userSchema = new Schema({
    id: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    avatar: { type: String, required: true },
    subjects: [{
        teacher: { type: Schema.Types.ObjectId, ref: 'Teacher', required: true },
        helper: { type: Schema.Types.ObjectId, ref: 'User', default: null },
        subject: { type: Schema.Types.ObjectId, ref: 'Subject', required: true },
        validUntil: { type: Date, default: addRealMonth(moment()) }
    }],
    applications: [{ type: Schema.Types.ObjectId, ref: 'Application', default: [] }],
    teacher: { type: Schema.Types.ObjectId, ref: 'Teacher', default: null },
    subject: { type: Schema.Types.ObjectId, ref: 'Subject', default: null },
    students: [{ type: Schema.Types.ObjectId, ref: 'User', default: [] }],
    isAdmin: { type: Boolean, default: false },
    isHelper: { type: Boolean, default: false },
    balance: { type: Number, default: 0 },
})

const User = mongoose.model('User', userSchema)

export default User