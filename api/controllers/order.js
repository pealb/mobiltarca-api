var db = require('./db');

module.exports = {
    listOrders: listOrders,
    createOrder: createOrder
}

db.initCollection('orders');

function listOrders(req, res) {
    var session_id = req.headers.x_session_id
    var authenticated = db.getObject('sessions', {session_id: session_id});
    if(!authenticated) {
        res.send(401, {
            message: "Unauthorized"
        });
    }
    else {
        var objects = db.getObjects('orders', {session_id: session_id});
        res.send(200, {
            orders: objects
        });
    } 
}

function createOrder(req, res) {
    var session_id = req.headers.x_session_id;
    var authenticated = db.getObject('sessions', {session_id: session_id});
    if(!authenticated) {
        res.send(401, {
            message: "Unauthorized"
        });
    }
    else {
        var totalPrice = req.swagger.params.order.value.totalPrice;
        if(totalPrice) {
            var date = new Date();
            var day = date.getDate();
            var monthIndex = date.getMonth();
            var year = date.getFullYear();
            var order = {
                "session_id": session_id,
                "totalPrice": totalPrice,
                "when": year + "-" + ("0" + (monthIndex)).slice(-2) + "-" + ("0" + day).slice(-2)
            }
            db.createObject('orders', order);
            res.send({order: order});
        } else {
            res.send(400, {
                message: "Order missing"
            })
        }
    } 
}