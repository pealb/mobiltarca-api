var db = require('./db');

module.exports = {
    updateUser: updateUser,
    deleteUser: deleteUser,
    getUser: getUser
}

function updateUser(req, res) {
    var session_id = req.headers.x_session_id

    var email = req.swagger.params.user.value.email;
    var pw = req.swagger.params.user.value.password;
    var firstName = req.swagger.params.user.value.firstName;
    var lastName = req.swagger.params.user.value.lastName;

    var new_user = {
        "email": email,
        "password": pw,
        "firstName": firstName,
        "lastName": lastName
    }

    var authenticated = db.getObject('sessions', {session_id: session_id});
    if(!authenticated) {
        res.send(401, {
            message: "Unauthorized"
        });
    }
    else {
        var objectToUpdate = db.getObject('users', {_id: session_id});

        if(objectToUpdate) {
            objectToUpdate = new_user;
            db.updateObject('users', {_id: session_id}, objectToUpdate);
            
            res.json({
                user: objectToUpdate
            });
        } else {
            res.send(400, {
                message: "User not found."
            })
        }  
    }
}

function deleteUser(req, res) {
    var session_id = req.headers.x_session_id;
    var authenticated = db.getObject('sessions', {session_id: session_id});
    if(!authenticated) {
        res.send(401, {
            message: "Unauthorized"
        });
    }
    else {
        var objectToDelete = db.getObject('users', {_id: session_id});
        if(objectToDelete) {
            db.deleteObject('sessions', {session_id: session_id});
            db.deleteObject('users', {_id: session_id});
            res.send({message: "User deleted"});
        }
    }
}

function getUser(req, res) {
    var session_id = req.headers.x_session_id;
    var authenticated = db.getObject('sessions', {session_id: session_id});
    if(!authenticated) {
        res.send(401, {
            message: "Unauthorized"
        });
    }
    else {
        var email = req.query.email;
        var userToFind = db.getObject('users', {email: email});
        var authenticatedUser = db.getObject('users', {_id: session_id});
        if(userToFind) {
            if(userToFind.email != authenticatedUser.email) {
                res.send(400, {
                    message: "No permission"
                });
            }
            else {
                res.json({
                    user: userToFind
                });
            }
        }
        else {
            res.send(400, {
                message: "No user found with this email"
            });
        }
    }
}