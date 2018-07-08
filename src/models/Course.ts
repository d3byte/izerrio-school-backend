import mongoose from 'mongoose'

const { Schema } = mongoose

const courseSchema = new Schema({
    
})

const Course = mongoose.model('Course', courseSchema)

export default Course