const usersData = [
    { uid: 1, username: 'Damien', password: 'Password123', instrument: 'Piano' },
    { uid: 2, username: 'Stef', password: 'SecurePassword456', instrument: 'Guitar' }
];

const lessonsData = [
    { user_id: 1, lesson_date: '2024-01-01', lesson_time: '10:00:00', length: 60 },
    { user_id: 1, lesson_date: '2024-01-03', lesson_time: '15:30:00', length: 45 },
    { user_id: 1, lesson_date: '2024-01-05', lesson_time: '11:15:00', length: 75 },
    { user_id: 2, lesson_date: '2024-01-02', lesson_time: '09:00:00', length: 60 },
    { user_id: 2, lesson_date: '2024-01-04', lesson_time: '14:00:00', length: 45 },
    { user_id: 2, lesson_date: '2024-01-06', lesson_time: '16:30:00', length: 60 }
];

const lessonNotesData = [
    { lesson_id: 1, note_number: 1, notes: 'Focused on scales.' },
    { lesson_id: 1, note_number: 2, notes: 'Practiced arpeggios.' },
    { lesson_id: 2, note_number: 1, notes: 'Introduced a new piece.' },
    { lesson_id: 2, note_number: 2, notes: 'Discussed phrasing.' },
    { lesson_id: 2, note_number: 3, notes: 'Addressed fingering techniques.' },
    { lesson_id: 3, note_number: 1, notes: 'Reviewed previous material.' },
    { lesson_id: 3, note_number: 2, notes: 'Emphasized dynamics.' },
    { lesson_id: 4, note_number: 1, notes: 'Worked on chords.' },
    { lesson_id: 5, note_number: 1, notes: 'Practiced scales.' },
    { lesson_id: 6, note_number: 1, notes: 'Reviewed previous lesson.' }
];

const practiceData = [
    { uid: 1, practice_date: '2024-01-02', practice_time: '12:45:00', length: 30 },
    { uid: 1, practice_date: '2024-01-04', practice_time: '09:00:00', length: 60 },
    { uid: 1, practice_date: '2024-01-06', practice_time: '14:00:00', length: 45 },
    { uid: 2, practice_date: '2024-01-01', practice_time: '11:30:00', length: 45 },
    { uid: 2, practice_date: '2024-01-03', practice_time: '13:00:00', length: 60 },
    { uid: 2, practice_date: '2024-01-05', practice_time: '10:00:00', length: 30 }
];

const practiceNotesData = [
    { practice_id: 1, note_number: 1, notes: 'Focused on finger exercises.' },
    { practice_id: 2, note_number: 1, notes: 'Practiced sight-reading.' },
    { practice_id: 2, note_number: 2, notes: 'Worked on rhythm.' },
    { practice_id: 2, note_number: 3, notes: 'Explored expression techniques.' },
    { practice_id: 3, note_number: 1, notes: 'Reviewed previous material.' },
    { practice_id: 3, note_number: 2, notes: 'Focused on dynamics.' },
    { practice_id: 3, note_number: 3, notes: 'Practiced specific passages.' },
    { practice_id: 4, note_number: 1, notes: 'Practiced chords.' },
    { practice_id: 5, note_number: 1, notes: 'Worked on rhythm patterns.' },
    { practice_id: 6, note_number: 1, notes: 'Reviewed previous lesson.' }
];

module.exports = {
    usersData,
    lessonsData,
    lessonNotesData,
    practiceData,
    practiceNotesData
};
  