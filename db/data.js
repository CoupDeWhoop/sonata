// data.js

const lessonsData = [
    { day: '2024-01-01', time: '10:00:00', length: 60 },
    { day: '2024-01-03', time: '15:30:00', length: 45 },
    { day: '2024-01-05', time: '11:15:00', length: 75 }
  ];
  
  const lessonNotesData = [
    { lesson_id: 1, note_number: 1, notes: 'Focused on scales.' },
    { lesson_id: 1, note_number: 2, notes: 'Practiced arpeggios.' },
    { lesson_id: 2, note_number: 1, notes: 'Introduced a new piece.' },
    { lesson_id: 2, note_number: 2, notes: 'Discussed phrasing.' },
    { lesson_id: 2, note_number: 3, notes: 'Addressed fingering techniques.' },
    { lesson_id: 3, note_number: 1, notes: 'Reviewed previous material.' },
    { lesson_id: 3, note_number: 2, notes: 'Emphasized dynamics.' }
  ];
  
  const practiceData = [
    { day: '2024-01-02', time: '12:45:00', length: 30 },
    { day: '2024-01-04', time: '09:00:00', length: 60 },
    { day: '2024-01-06', time: '14:00:00', length: 45 }
  ];
  
  const practiceNotesData = [
    { practice_id: 1, note_number: 1, notes: 'Focused on finger exercises.' },
    { practice_id: 2, note_number: 1, notes: 'Practiced sight-reading.' },
    { practice_id: 2, note_number: 2, notes: 'Worked on rhythm.' },
    { practice_id: 2, note_number: 3, notes: 'Explored expression techniques.' },
    { practice_id: 3, note_number: 1, notes: 'Reviewed previous material.' },
    { practice_id: 3, note_number: 2, notes: 'Focused on dynamics.' },
    { practice_id: 3, note_number: 3, notes: 'Practiced specific passages.' }
  ];
  
  module.exports = {
    lessonsData,
    lessonNotesData,
    practiceData,
    practiceNotesData
  };
  