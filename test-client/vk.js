const request = require('tinyreq')
const express = require('express')
const cors = require('cors')

const app = express()

app.use(cors())

const PORT = 3123


const info = {
    app: 6621302,
    protectedKey: 'BuOkbxEly6ywp1t0rAhF',
    version: '5.80',
    redirect_uri: 'http://localhost:3123/vk_auth',
    response_type: 'code',
    code: ''
}



const makeRequest = () => request(`https://oauth.vk.com/access_token?client_id=${info.app}&client_secret=${info.protectedKey}&code=${info.code}&redirect_uri=${info.redirect_uri}`,  (err, body) => {
    let jsonBody = JSON.parse(body)
    const fields = {
        uids: jsonBody.user_id,
        fields: 'uid,first_name,last_name,screen_name,sex,bdate,photo_big',
        access_token: jsonBody.access_token
    }
    request(`https://api.vk.com/method/users.get?uids=${fields.uids}&fields=${fields.fields}&access_token=${fields.access_token}&version=${info.version}`, (err, body) => {
      console.log(body)
    })
});

app.get('/vk_auth', (req, res) => {
    const { code } = req.query
    info.code = code
    makeRequest()
    res.redirect('http://localhost:5500/test/index.html')
})

app.get('/get-url', (req, res) => res.json({ link }))
    
app.listen(PORT, () => console.log(`Server is running on localhost:${PORT}`))
    