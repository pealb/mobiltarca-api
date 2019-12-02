var db = require('./db');

module.exports = {
    createUser: createUser,
    login: login,
    logout: logout
}

db.initCollection('users');

function createUser(req, res) {
    try {
        var email = req.swagger.params.user.value.email;
        var pw = req.swagger.params.user.value.password;

        var new_user = {
            "email": email,
            "password": pw
        }

        console.log(new_user);

        if(db.getObject('users', new_user) == null) {
            var _id = db.createObject('users', new_user);

            res.json({
                _id: _id._id
            });
        } else {
            res.send(400, {
                message: "User already exists!"
            })
        }
    } catch (err) {
        return res.send(400, {
            message: err.message
        })
    }
}

function login(req, res) {
    if(!req.body.email || !req.body.password) {
        res.send(401, {
            message: "Email or password missing!"
        })
    } else {
        var email = req.body.email;
        var pw = req.body.password;

        if(db.getObject('sessions', {email: email})) {
            res.send(400, {
                message: "You are already logged in."
            });
        } else {
            try {
                var user = db.getObject('users', {email: email});
                
                if(user.password == pw) {
                    db.createObject('sessions', {
                        "session_id": user._id,
                        "username": email
                    })

                    res.json({
                        "sessionID": user._id
                    });
                } else {
                    res.send(401, {
                        message: "Wrong password."
                    })
                }
            } catch (err) {
                res.send(401, {
                    message: "User not found."
                });
            }
        }
    }
}

function logout(req, res) {
    let session_id = req.headers.x_session_id;
    if(db.getObject('sessions', {session_id: session_id})) {
        db.deleteObject('sessions', {session_id: session_id});

        res.json({
            "sessionID": session_id
        });
    } else {
        res.send(400, {
            message: "User is not logged in."
        })
    }
}