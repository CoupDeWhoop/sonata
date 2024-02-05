const { fetchAllUsers, insertUser } = require('../models/users.model.js')

exports.getUsers = (req, res, next) => {
    fetchAllUsers()
        .then((users) => {
            res.status(200).send({users})
        })
        .catch((err) => next(err));
}

exports.postUser = (req, res, next) => {
    insertUser(req.body)
        .then((user) => {
            res.status(201).send({user});
        })
        .catch((err) => {
            return next(err)
        });
}