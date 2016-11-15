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

// app.delete('/user', passport.authenticate('basic', {session:false}), function(req, res) {
//     if (!medication._id) {
//         return res.status(422).json({message: 'Missing field: id'});
//     }
//     if (typeof(medication._id) !== 'string') {
//         return res.status(422).json({message: 'Incorrect field type: id'});
//     }


//     Medications.remove({_id: req.body._id}, function(err, count) {
//         if (err) return res.status(501).json(err);
//         if (count.result.n == 0) return res.status(400).json("no entries match medication id sent");
//         res.status(200).json(count.result.n + " object(s) removed");
//     });
// });


//get user medication data; requires authentication
app.get('/medication', passport.authenticate('basic', {session:false}), function(req, res) {
    console.log("req.user!!!! ", req.user);
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
//     "userId": User ObjectID,
//     "name": "medication name",
//     "date": "Date (day of week)",
//     "time": "time",
//     "taken", false
// }
app.post('/medication', jsonParser, passport.authenticate('basic', {session:false}), function(req, res) {
    const medication = req.body;
    console.log("req.user!!!! ", req.user);
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
    User.findOne({username: req.user.username}).exec(function(err, entry) {
        console.log("Username found: ", entry);
        Medications.create({
                userId: entry._id,
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
});

// modify medication attributes
app.put('/medication', jsonParser, passport.authenticate('basic', {session:false}), function(req, res) {
  const medication = req.body;
  console.log(medication);
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

app.delete('/medication', jsonParser, passport.authenticate('basic', {session:false}), function(req, res) {
    const medication = req.body;
    if (!medication._id) {
        return res.status(422).json({message: 'Missing field: id'});
    }
    if (typeof(medication._id) !== 'string') {
        return res.status(422).json({message: 'Incorrect field type: id'});
    }


    Medications.remove({_id: req.body._id}, function(err, count) {
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
    });
}

if (require.main === module) {
    runServer();
}
