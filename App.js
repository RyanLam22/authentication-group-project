const express = require('express')
const app = express()
const User = require('./model/user')
const accountController = require('./controller/accountController')
const LocalStrategy = require('passport-local');
const bodyParser = require('body-parser');
const passport = require('passport');
app.use(bodyParser.urlencoded({ extended: true }));


require('./middleware/auth.js')()
const mongoose = require('mongoose');
const mongoString = 'mongodb+srv://RyanLam:Ryanlam5784@cluster0.bguezof.mongodb.net/?retryWrites=true&w=majority';
mongoose.connect(mongoString);

passport.use(new LocalStrategy({session: false},(User.authenticate())));
passport.serializeUser(User.serializeUser());
app.use(passport.initialize());

app.get('/', (req, res) => { res.send('Introduction JWT Auth') })
app.get('/profile', passport.authenticate('jwt', { session: false }), accountController.profile)
app.post('/login', accountController.login);
app.post('/register', accountController.register)
app.listen(8000, () => { console.log('Server started.') });
