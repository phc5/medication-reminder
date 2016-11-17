import 'babel-polyfill';
import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import passport from 'passport';
import schedule from 'node-schedule';
import morgan from 'morgan';
import {BasicStrategy} from 'passport-http';

// import {logger} from './utilities/logger';
import User from '../models/user-model';
import Medications from '../models/medication-model';
import {sendEmail} from './emailer';

const jsonParser = bodyParser.json();

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
                message: 'Incorrect credentials.'
            });
        }
        user.validatePassword(password, function(err, isValid) {
            if (err) {
                return callback(err);
            }
            if (!isValid) {
                return callback(null, false, {
                    message: 'Incorrect credentials.'
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
// requires
// {
//     username: new username,
//     password: new password
// }
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
    let email = req.body.email;
    if (typeof email !== 'string') {
        return res.status(422).json({
            message: 'Incorrect field type: email'
        });
    }
    email = email.trim();
    if (email === '') {
        return res.status(422).json({
            message: 'Incorrect field length: email'
        });
    }
    User.findOne({username: username}).then((result) => {
        if(result) {
            console.log(result);
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
                    password: hash,
                    email: email
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

// change username or password
// requires:
// {
//     "username": desired username,
//     "password": desired password,
//     "email": user email
// }
app.put('/user', jsonParser, passport.authenticate('basic', {session:false}), function(req, res) {
    const user = req.user;
    const updateUser = req.body;
    console.log("user auth info: ", user);
    console.log("updateUser ", updateUser);

    let password = updateUser.password;
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
            User.findOneAndUpdate({username: user.username}, {$set: { 
                        username: updateUser.username,
                        password: hash,
                        email: updateUser.email
                    }}, 
                    function(err, med) {
                        if (err) {
                            return res.status(500).json({message: 'Internal server error'});
                        }
                        if(!med) return res.status(400).json("no entries found")
                        return res.status(202).json("account updated");
                    }
            );
        });
    });
});

// delete user account and associated medications
// requires authentication
app.delete('/user', passport.authenticate('basic', {session:false}), function(req, res) {
    const user = req.user;
    User.findOne({username: user.username}).exec(function(err, entry) {
        if (err) return res.status(500).json(err);
        if(JSON.stringify(entry._id) != JSON.stringify(user._id)) {
            return res.status(400).json("_id invalid");
        }
        User.remove({username: user.username}, function(err, count) {
        if (err) return res.status(501).json(err);
        Medications.remove({userId: user._id}, function(err, count) {
            if (err) return res.status(501).json(err);
            return res.status(200).json("account deleted");

            });
        })
    });
});


//get user medication data; requires authentication
// data will be returned as:
// {
//     "userId": User ObjectID,
//     "name": "medication name",
//     "date": "Date (day of week)",
//     "time": "time",
//     "taken", false
// }
app.get('/medication', passport.authenticate('basic', {session:false}), function(req, res) {
    Medications.find({userId: req.user._id}).exec(function(err, meds) {
        if (err) {
            return res.status(500).json({message: 'Internal Server Errror'});
        }
        res.json(meds);
    });
});

//
Medications.find({}, function(data) {
    console.log("saved medication data: ", data);
    if(!data) return [];
    return data.map(entry => {
        let firstReminder = (new Date(Date.now() + 5000));
        entry.days.map(day => {
            if(entry.nextReminder <= Date.now()) {
                return schedule.scheduleJob(time, function() {
                    console.log("running scheduler");
                    //generate email
                    console.log("entry; ", entry);
                    if(entry.indexOf(day) == (entry.length - 1)) {
                        let nextReminderDate = setDay(Date.now(), entry.day[0]);
                    } else {
                        let nextReminderDate = setDay(Date.now(), entry.day[(entry.indexOf(day) + 1)]);
                    }
                    sendEmail(entry.email, entry.name, function() {
                        Medications.findOne({_id: entry._id},{
                            $set: {
                                nextReminder: nextReminderDate,
                                lastReminder: Date.now()
                            }
                            }, function(err) {
                                console.log(err);
                            }
                        );
                    });
                });
            }
        });
    });
});

// finds the date of the next spedified day of week from the intial date
// date = initial date
// dayOfWeek 0-7, corresponding to the day of the week, were Sunday is 0 and 7
function setDay(date, dayOfWeek) {
  date = new Date(date.getTime());
  date.setDate(date.getDate() + (dayOfWeek + 7 - date.getDay()) % 7);
  return date;
}

function scheduleReminder(med, entry, day) {
    console.log("running scheduler");
    //generate email
    let nextReminderDate;
    if(med.days.indexOf(day) == (med.days.length - 1)) {
        nextReminderDate = Date.now(setDay(new Date(Date.now()), med.days[0]));
    } else {
        nextReminderDate = Date.now(setDay(new Date(Date.now()), med.days[(med.days.indexOf(day) + 1)]));
    }
    let emailPromise = new Promise((resolve) => {
        sendEmail(entry.email, med.name);
        console.log("running sendEmail");
        resolve("Success!");
    })
    .then(function() {
        let lastReminderDate = Date.now();
        Medications.update({_id: med._id},{
                $set: {
                    nextReminder: nextReminderDate,
                    lastReminder: lastReminderDate
                }
            }
        );
        return
    })
    .catch(err => {
        console.log(err);
    });
}

// add medication to a user's medication list
// request body must include:
// {
//     "name": "medication name",
//     "firstReminder": unix time of first reminder,
//     "days": days of week for reminder - as array,
//     "taken", false
// }
app.post('/medication', jsonParser, passport.authenticate('basic', {session:false}), function(req, res) {
    const medication = req.body;
     if (!medication.name) {
        return res.status(422).json({message: 'Missing field: name'});
    }
    if (typeof(medication.name) !== 'string') {
        return res.status(422).json({message: 'Incorrect field type: name'});
    }
    if (!medication.firstReminder) {
        return res.status(422).json({message: 'Missing field: firstReminder'});
    }
    if (typeof(medication.firstReminder) !== 'number') {
        return res.status(422).json({message: 'Incorrect field type: firstReminder'});
    }
    if (!medication.days) {
        return res.status(422).json({message: 'Missing field: days'});
    }
    if (typeof(medication.days) !== 'object') {
        return res.status(422).json({message: 'Incorrect field type: days'});
    }
    if (typeof(medication.taken) !== 'boolean') {
        return res.status(422).json({message: 'Incorrect field type: taken'});
    }
    // Look up user to retrieve email
    User.findOne({username: req.user.username}).exec(function(err, entry) {
        if(err) return res.status(500).json({
                        message: 'Internal server error'
        });
        // use second day of week submitted, if exists, otherwise use first day of week submitted
        let dayOfWeek = medication.days[1] ? medication.days[1] : medication.days[0];
        // convert to medication.firstReminder instead of Date.now()
        let nextReminder = Date.parse(setDay(new Date(Date.now()), dayOfWeek));
        Medications.create({
                userId: entry._id,
                name: medication.name, 
                firstReminder: medication.firstReminder,
                days: medication.days,
                taken: medication.taken,
                nextReminder: nextReminder,
                lastReminder: 0
            }, function(err, med) {
                if (err) {
                    return res.status(500).json({
                        message: 'Internal server error happening here'
                    });
                }
                // let firstReminder = (new Date(Date.now() + 5000));
                let firstReminder = new Date(med.firstReminder);
                med.days.map(day => {
                    if(med.days.indexOf(day) == 0) {
                        schedule.scheduleJob(firstReminder, function() {
                            scheduleReminder(med, entry, day)
                        });
                    } else {
                        let time = setDay(firstReminder, day);
                        return schedule.scheduleJob(time, function(){
                            scheduleReminder(med, entry, day)
                        });
                    }
                });
                return res.status(201).json({med});
            }
        );
    })
});

// modify medication attributes
// must send in full medication object:
// {
//     "_id": medication id,
//     "userId": User ObjectID,
//     "name": medication name,
//     "firstReminder": Unix time of first reminder,
//     "days": days of week for reminder - as array,
//     "taken": boolean value of whether medication was taken,
//     "nextReminder": Unix time of next reminder,
//     "lastReminder": Unix time of last reminder
// }
app.put('/medication', jsonParser, passport.authenticate('basic', {session:false}), function(req, res) {
  const medication = req.body;
  console.log(medication);
  let updateObject = Medications.findOne({_id: medication._id}, function() {
    if (medication.name) {
        if (typeof(medication.name) !== 'string') {
            return res.status(422).json({message: 'Incorrect field type: name'});
        }
        updateObject.name = medication.name;
    }
    if (medication.firstReminder) {
        if (typeof(medication.name) !== 'string') {
            return res.status(422).json({message: 'Incorrect field type: name'});
        }
        updateObject.name = medication.name;
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
    Medications.findOneAndUpdate({_id: medication._id, userId: req.user._id}, {$set: { 
                userId: medication.userId,
                name: medication.name, 
                date: medication.date, 
                time: medication.time,
                taken: medication.taken
            }}, 
            {new: true}, 
            function(err, med) {
                if (err) {
                    return res.status(500).json({message: 'Internal server error'});
                }
                if(!med) return res.status(400).json("no entries found")
                return res.status(201).json({med});
            }
    );
  });
});

// delete medication
// requires
// {
//     _id: medication ObjectID
// }
app.delete('/medication', jsonParser, passport.authenticate('basic', {session:false}), function(req, res) {
    const medication = req.body;
    if (!medication._id) {
        return res.status(422).json({message: 'Missing field: id'});
    }
    if (typeof(medication._id) !== 'string') {
        return res.status(422).json({message: 'Incorrect field type: id'});
    }


    Medications.remove({_id: medication._id}, function(err, count) {
        if (err) return res.status(501).json(err);
        if (count.result.n == 0) return res.status(400).json("no entries match medication id sent");
        res.status(200).json(count.result.n + " object(s) removed");
    });
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
    }).catch(err => {console.error("err: ",err)});
}

if (require.main === module) {
    runServer();
}
