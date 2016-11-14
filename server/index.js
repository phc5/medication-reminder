import 'babel-polyfill';
import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import passport from 'passport';

import User from '../models/user-model';
import Medications from '../models/medication-model';

const jsonParser = bodyParser.json();
import {BasicStrategy} from 'passport-http';

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
                    return res.status(201).json("account created");
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

// add medication to a user's medication list
// request body must include:
// {
    // userId: ObjectID,
//     "name": "medication name",
    // "date": "Date (day of week",
    // "time": "time",
    // "taken", false
//     }
// }
app.post('/medication', jsonParser, passport.authenticate('basic', {session:false}), function(req, res) {
    const medication = req.body;
    if (!medication.userId) {
        return res.status(422).json({message: 'Missing field: userId'});
    }
     if (!medication.name) {
        return res.status(422).json({message: 'Missing field: name'});
    }
    if (typeof(medication.name) !== 'string') {
        return res.status(422).json({message: 'Incorrect field type: name'});
    }
    if (!medication.date) {
        return res.status(422).json({message: 'Missing field: date'});
    }
    if (typeof(medication.date) !== 'string') {
        return res.status(422).json({message: 'Incorrect field type: date'});
    }
    if (!medication.time) {
        return res.status(422).json({message: 'Missing field: time'});
    }
    if (typeof(medication.time) !== 'string') {
        return res.status(422).json({message: 'Incorrect field type: time'});
    }
    if (typeof(medication.taken) !== 'boolean') {
        return res.status(422).json({message: 'Incorrect field type: taken'});
    }
    Medications.create({
                userId: medication.userId,
                name: medication.name, 
                date: medication.date, 
                time: medication.time,
                taken: medication.taken
            }, function(err, med) {
                if (err) {
                    return res.status(500).json({
                        message: 'Internal server error'
                    });
                }
                return res.status(201).json({med});
            }
    );
})

// modify medication attributes
app.put('/medication', jsonParser, passport.authenticate('basic', {session:false}), function(req, res) {
    console.log(req.body);
  const medication = req.body;
    if (!medication.name) {
        return res.status(422).json({message: 'Missing field: name'});
    }
    if (typeof(medication.name) !== 'string') {
        return res.status(422).json({message: 'Incorrect field type: name'});
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
    User.findOneAndUpdate({username: req.user.username, medications: {name: medication.name}}, {$set: {"medications.$.name": 
            {
                name: medication.name, 
                reminder:
                    {
                    date: medication.reminder.date, 
                    time: medication.reminder.time,
                    taken: medication.reminder.taken
                    }
            }
        }}, function(err, medList) {
                if (err) {
                    console.log(err);
                        return res.status(500).json({
                            message: 'Internal server error'
                        });
                    }
                    return res.status(201).json({medList});
            }
    );
});



const HOST = process.env.HOST;
const PORT = process.env.PORT || 8080;

console.log(`Server running in ${process.env.NODE_ENV} mode`);

function runServer() {
    let databaseUri = process.env.DATABASE_URI || global.databaseUri || 'mongodb://localhost/medList';
    mongoose.connect(databaseUri).then(function() {
       app.listen(PORT, HOST, (err) => {

            if (err) {
                console.error(err);
                return(err);
            }
            const host = HOST || 'localhost';
            console.log(`Listening on ${host}:${PORT}`);
        });
    });
}

if (require.main === module) {
    runServer();
}
