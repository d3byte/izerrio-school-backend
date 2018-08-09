import express from 'express'
import expressJWT from 'express-jwt'
import secret from '../secret'

import {  login, addSubjectToUser, getUser, getUsers, turnHelperIntoUser, turnUserIntoHelper, getHelpers, getHelpersOfCourse, getStatistics,  } from './userController'
import { createTeacher, authorizeTeacher, getTeacher, getTeachers, getStudents, removeTeacher } from './teacherController'
import { createSubject, addTeacherToSubject, removeTeacherFromSubject, getSubjects, getSubject, removeSubject, addVideoToSubject, removeVideoFromSubject } from './subjectController'
import { createApplication, setApplicationAsDone, removeApplication, getApplications } from './applicationController'
import { getLink, sosatFreeKassa, successPayment, unsuccessPayment } from './infoController'

const controllers = express()

// Info
controllers.get('/', sosatFreeKassa)
controllers.get('/success-pay', successPayment)
controllers.get('/unsuccess-pay', unsuccessPayment)
controllers.get('/get-vk-url', getLink)

// User
controllers.get('/vk-auth', login)
controllers.get('/get-user', expressJWT({ secret }), getUser)
controllers.get('/get-users', expressJWT({ secret }), getUsers)
controllers.get('/get-helpers', expressJWT({ secret }), getHelpers)
controllers.get('/stats', expressJWT({ secret }), getStatistics)
controllers.get('/add-course', expressJWT({ secret }), addSubjectToUser)
controllers.post('/get-helpers-of-course', expressJWT({ secret }), getHelpersOfCourse)
controllers.post('/user-to-helper', expressJWT({ secret }), turnUserIntoHelper)
controllers.post('/helper-to-user', expressJWT({ secret }), turnHelperIntoUser)

// Teacher
controllers.post('/create-teacher', expressJWT({ secret }), createTeacher)
controllers.post('/auth-teacher', authorizeTeacher)
controllers.get('/get-teacher', expressJWT({ secret }), getTeacher)
controllers.get('/get-teachers', expressJWT({ secret }), getTeachers)
controllers.get('/get-students', expressJWT({ secret }), getStudents)
controllers.post('/remove-teacher', expressJWT({ secret }), removeTeacher)

// Subject
controllers.post('/create-subject', expressJWT({ secret }), createSubject)
controllers.post('/add-teacher-to-subject', expressJWT({ secret }), addTeacherToSubject)
controllers.post('/remove-teacher-from-subject', expressJWT({ secret }), removeTeacherFromSubject)
controllers.post('/add-video', expressJWT({ secret }), addVideoToSubject)
controllers.post('/remove-video', expressJWT({ secret }), removeVideoFromSubject)
controllers.post('/get-subject', expressJWT({ secret }), getSubject)
controllers.get('/get-subjects', expressJWT({ secret }), getSubjects)
controllers.post('/remove-subject', expressJWT({ secret }), removeSubject)

// Application
controllers.post('/create-application', expressJWT({ secret }), createApplication)
controllers.get('/get-applications', expressJWT({ secret }), getApplications)
controllers.post('/set-application-as-done', expressJWT({ secret }), setApplicationAsDone)
controllers.post('/remove-application', expressJWT({ secret }), removeApplication)

export default controllers