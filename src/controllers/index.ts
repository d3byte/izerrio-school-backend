import express from 'express'
import expressJWT from 'express-jwt'
import secret from '../secret'

import {  login, addSubjectToUser, getUser, turnHelperIntoUser, turnUserIntoHelper } from './userController'
import { createTeacher, authorizeTeacher, removeTeacher } from './teacherController'
import { createSubject, addTeacherToSubject, removeTeacherFromSubject, removeSubject } from './subjectController'
import { createApplication, setApplicationAsDone, removeApplication } from './applicationController'
import { getLink } from './infoController'

const controllers = express()

// Info
controllers.get('/get-vk-url', getLink)

// User
controllers.get('/vk-auth', login)
controllers.get('/get-user', expressJWT({ secret }), getUser)
controllers.get('/add-course', expressJWT({ secret }), addSubjectToUser)
controllers.post('/user-to-helper', expressJWT({ secret }), turnUserIntoHelper)
controllers.post('/helper-to-user', expressJWT({ secret }), turnHelperIntoUser)

// Teacher
controllers.post('/create-teacher', expressJWT({ secret }), createTeacher)
controllers.post('/auth-teacher', authorizeTeacher)
controllers.delete('/remove-teacher', expressJWT({ secret }), removeTeacher)

// Subject
controllers.post('/create-subject', expressJWT({ secret }), createSubject)
controllers.post('/add-teacher-to-subject', expressJWT({ secret }), addTeacherToSubject)
controllers.post('/remove-teacher-from-subject', expressJWT({ secret }), removeTeacherFromSubject)
controllers.delete('/remove-subject', expressJWT({ secret }), removeSubject)

// Application
controllers.post('/create-application', expressJWT({ secret }), createApplication)
controllers.post('/set-application-as-done', expressJWT({ secret }), setApplicationAsDone)
controllers.delete('/remove-application', expressJWT({ secret }), removeApplication)

export default controllers