const { fetchAllNotes } = require("../models/notes.model");

exports.getAllNotes = (req, res, next) => {
  const { user_id } = req.user;

  fetchAllNotes(user_id)
    .then((notes) => {
      res.status(200).send({ notes });
    })
    .catch((err) => next(err));
};
