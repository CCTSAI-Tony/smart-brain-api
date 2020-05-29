const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const db = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : '',//need to connect
    password : '',
    database : 'smart-brain'
  }
});

const app = express();

//middleware
app.use(cors())//for security issue
app.use(bodyParser.json());

//always has response
app.get('/', (req, res)=> { res.send(db.users) })//just for test
app.post('/signin', signin.handleSignin(db, bcrypt))//automately recieve req, res, different syntex
app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) })
app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req, res, db)})//req.params
app.put('/image', (req, res) => { image.handleImage(req, res, db)})
app.post('/imageurl', (req, res) => { image.handleApiCall(req, res)})

app.listen(process.env.PORT || 3000, ()=> {
  console.log('app is running on port ${process.env.PORT}');
})
//app.listen(3000, () run after listen happens
