const { fetchUserPractises, fetchUserPracticeNotes, insertPractice, insertPracticeNote, updatePracticeNote, fetchPracticeByPracticeId, removePracticeNoteByPracticeId, removePracticeByPracticeId, fetchPracticeNoteByNoteId } = require('../models/practises.model.js');
const { checkExists, checkUserMatch } = require('../utils/utils.js');

exports.getUserPractises = (req, res, next) => {
    const { user_id } = req.user;

    fetchUserPractises(user_id)
        .then((practises) => {
            res.status(200).send({ practises })
        })
        .catch((err) => {
            next(err)
        })
}

exports.getUserPracticeNotes = (req, res, next) => {
    const { user_id } = req.user;
    const { practice_id } = req.params;
    fetchUserPracticeNotes(user_id, practice_id)
        .then((notes) => {
            res.status(200).send({ notes })
        })
        .catch((err) => {
            next(err)
        })
}

exports.postPractice = (req, res, next) => {
    const { user_id } = req.user;
    const { timestamp, duration } = req.body;
    insertPractice(user_id, timestamp, duration)
        .then((note) => {
            res.status(201).send({ note })
        })
        .catch((err) => next(err))
}

exports.postPracticeNote = (req, res, next) => {
    const { user_id } = req.user;
    const { note_content, practice_id, learning_focus } = req.body;
    checkExists('practises', 'practice_id', practice_id)
        .then(() => {
            return fetchUserPractises(user_id, practice_id)  // checks practice belongs to user
        })
        .then((matches) => {
            if (matches.length === 0) return Promise.reject({status: 403, msg: "Forbidden"})
            return insertPracticeNote(practice_id, note_content, learning_focus)
        })
        .then((note) => {
            res.status(201).send({note})
        })
        .catch((err) => next(err))

}

exports.patchPracticeNote = (req, res, next) => {
    const { user_id } = req.user;
    const { note_content, learning_focus } = req.body;
    const { practice_id, note_id } = req.params;
    checkUserMatch('notes', 'practises', 'practice_id', practice_id, user_id)
    .then(() => {
        return fetchPracticeNoteByNoteId(note_id, practice_id)
    })
    .then(() => {
        const updateFields = {};
        if (learning_focus) {
            updateFields.learning_focus = learning_focus;
        }
        if (note_content) {
            updateFields.note_content = note_content;
        }
        
        return updatePracticeNote(note_id, updateFields);
    })
    .then((updatedNote) => {
        res.status(200).json({ note: updatedNote });
    })
    .catch((err) => {
        next(err);
    });
}

exports.deletePracticeByPracticeId = (req, res, next) => {
    const { user_id } = req.user;
    const { practice_id } = req.params;
    fetchPracticeByPracticeId(user_id, practice_id)
        .then(() => {
            return removePracticeNoteByPracticeId(practice_id)
        })
        .then(()=> {
            return removePracticeByPracticeId(practice_id)
        })
        .then(() => {
            res.status(204).send()
        })
        .catch((err) => next(err))

}





