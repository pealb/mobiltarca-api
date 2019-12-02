var crypto = require('crypto');
_ = require("lodash");
require("underscore-query")(_);

var db = {
};

module.exports = {
  initCollection: initCollection,
  getObject: getObject,
  getObjects: getObjects,
  createObject: createObject,
  updateObject: updateObject,
  deleteObject: deleteObject
};

function getRandomId() {
  return crypto.randomBytes(12).toString('hex');
}

function initCollection(collection_name) {
  db[collection_name] = [];
}

function findObject(collection_name, filter) {
  var obj = _.query(db[collection_name], filter)[0];
  if(!obj) return null;
  else return obj;
}

function getObject(collection_name, filter) {
  return findObject(collection_name, filter);
}

function getObjects(collection_name, filter) {
  var obj = _.query(db[collection_name], filter);
  if(!obj.length) throw new Error('Object not found in collection: ' + collection_name);
  else return obj;
}

function createObject(collection_name, new_object) {
  var obj = {
    _id: getRandomId()
  };
  db[collection_name].push(Object.assign(obj, new_object));
  return {
    _id: obj._id
  };
}

function updateObject(collection_name, filter, update_object) {
  var obj = findObject(collection_name, filter);
  var index = db[collection_name].indexOf(obj);
  db[collection_name][index] = Object.assign(obj, update_object);
  return {
    _id: obj._id
  };
}

function deleteObject(collection_name, filter) {
  var obj = findObject(collection_name, filter);
  db[collection_name].splice(db[collection_name].indexOf(obj), 1);
  return {
    _id: obj._id
  };
}