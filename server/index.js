import 'babel-polyfill';
import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt.js';
import passport from 'passport';

import User from './user-model';

const jsonParser = bodyParser.json();
import BasicStrategy from 'passport-http'.BasicStrategy;

const strategy = new BasicStrategy(function(username, password, callback) {
    User.findOne({
        username: username
    }, function (err, user) {
        if (err) {
            callback(err);
            return;
        }

        if (!user) {
            return callback(null, false, {
                message: 'Incorrect username.'
            });
        }

        user.validatePassword(password, function(err, isValid) {
            if (err) {
                return callback(err);
            }

            if (!isValid) {
                return callback(null, false, {
                    message: 'Incorrect password.'
                });
            }
            return callback(null, user);
        });
    });
});

passport.use(strategy);

const app = express();
app.use(passport.initialize());

const HOST = process.env.HOST;
const PORT = process.env.PORT || 8080;

console.log(`Server running in ${process.env.NODE_ENV} mode`);\

app.use(express.static(process.env.CLIENT_PATH));

//create new username and password
app.post('/user', jsonParser, function(req, res) {
    if (!req.body) {
        return res.status(400).json({
            message: "No request body"
        });
    }
    if (!('username' in req.body)) {
        return res.status(422).json({
            message: 'Missing field: username'
        });
    }
    let username = req.body.username;
    if (typeof username !== 'string') {
        return res.status(422).json({
            message: 'Incorrect field type: username'
        });
    }
    username = username.trim();
    if (username === '') {
        return res.status(422).json({
            message: 'Incorrect field length: username'
        });
    }
    User.findOne({username: username}).then((result) => {
        if(result) {
            return res.status(409).json({message: "Username already taken."});
        }
        if (!('password' in req.body)) {
            return res.status(422).json({
                message: 'Missing field: password'
            });
        }
        let password = req.body.password;
        if (typeof password !== 'string') {
            return res.status(422).json({
                message: 'Incorrect field type: password'
            });
        }
        password = password.trim();
        if (password === '') {
            return res.status(422).json({
                message: 'Incorrect field length: password'
            });
        }
        bcrypt.genSalt(10, function(err, salt) {
            if (err) {
                return res.status(500).json({
                    message: 'Internal server error'
                });
            }
            bcrypt.hash(password, salt, function(err, hash) {
                if (err) {
                    return res.status(500).json({
                        message: 'Internal server error'
                    });
                }
               let user = new User({
                    username: username,
                    password: hash
                });
                user.save(function(err) {
                    if (err) {
                        return res.status(500).json({
                            message: 'Internal server error'
                        });
                    }
                    return res.status(201).json({});
                });
            });
        });
    });
});

//get user medication data; requires authentication
app.get('/medication', passport.authenticate('basic', {session:false}), function(req, res) {
    User.find().select('_id username').exec(function(err, meds) {
        if (err) {
            return res.status(500).json({message: 'Internal Server Errror'});
        }
        res.json(meds);
    });
});

app.post('/medication', passport.authenticate('basic', {session:false}), function(req, res) {
    const medication = req.body.med;
    if (!medication.name) {
        return res.status(422).json({message: 'Missing field: med'});
    }
    if (typeof(medication.name) !== 'string') {
        return res.status(422).json({message: 'Incorrect field type: med'});
    }
    if (!medication.reminder.date) {
        return res.status(422).json({message: 'Missing field: reminder.date'});
    }
    if (typeof(medication.reminder.date) !== 'string') {
        return res.status(422).json({message: 'Incorrect field type: reminder.date'});
    }
    if (!medication.reminder.time) {
        return res.status(422).json({message: 'Missing field: reminder.time'});
    }
    if (typeof(medication.reminder.time) !== 'string') {
        return res.status(422).json({message: 'Incorrect field type: reminder.time'});
    }
    User.findOneAndUpdate({username: req.params.username}, {$push: {'medications': 
        {medication: medication.name, 
            date: medication.reminder.date, 
            time: medication.reminder.time}
        }, {new: true}, function(err, model) {console.log(err);}
    });
})


function runServer() {
    return new Promise((resolve, reject) => {
        app.listen(PORT, HOST, (err) => {
            if (err) {
                console.error(err);
                reject(err);
            }

            const host = HOST || 'localhost';
            console.log(`Listening on ${host}:${PORT}`);
        });
    });
}

if (require.main === module) {
    runServer();
}
