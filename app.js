const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const ejs = require('ejs');
app.set('view engine', 'ejs');
const User = require('./schemas/user');
const passport = require('passport');
const session = require('express-session');
const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;

const mongoose = require('mongoose');

mongoose.connect(`mongodb://localhost:27017/auth`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
mongoose.connection.once('open', () => {
    console.log(`connected to database`)
}).on('error', (err) => {
    console.log(`error: ${err}`)
});
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(
    session({
        secret: 'lol',
        resave: true,
        saveUninitialized: true,
    })
);

require('./auth/passport-local')(passport);
const {
    ensureAuthenticated,
    forwardAuthenticated
} = require('./auth/auth');

app.use(passport.initialize());
app.use(passport.session());


app.get('/', forwardAuthenticated, (req, res) => {
    res.render('login')
});

app.get('/signup', (req, res) => {
    res.render('register')
})

app.get('/dashboard', ensureAuthenticated, (req, res) => {
    res.render('dashboard', {
        name: req.user.name
    })
})


app.post('/signup', (req, res) => {
    User.findOne({
        email: req.body.email
    }, (err, data) => {
        if (err) {
            console.log(err);
        } else {
            if (data == null) {
                console.log('data not found')

                newUser = new User({
                    email: req.body.email,
                    name: req.body.name,
                    password: req.body.password
                });
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) return err;
                        newUser.password = hash;
                        newUser.save().then(() => {
                            res.redirect('/')
                        })
                    })
                })

            } else {
                res.redirect('/')
            }
        }
    })
})

app.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/',
        failureFlash: false
    })(req, res, next);
});

app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
})

app.listen(3000, () => {
    console.log('server started in port 3000')
})