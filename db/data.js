const usersData = [
  {
    name: "Damien",
    email: "testemail@test.com",
    password: "Password123",
    instrument: "Piano",
  },
  {
    name: "Mike",
    email: process.env.ADMIN_EMAIL,
    password: "AdminPassword",
    instrument: "Guitar",
  },
];

const lessonsData = [
  { user_name: "Damien", lesson_timestamp: "2024-01-01 10:00:00", length: 60 },
  { user_name: "Damien", lesson_timestamp: "2024-01-03 15:30:00", length: 45 },
  { user_name: "Damien", lesson_timestamp: "2024-01-05 11:15:00", length: 75 },
  { user_name: "Mike", lesson_timestamp: "2024-01-02 09:00:00", length: 60 },
  { user_name: "Mike", lesson_timestamp: "2024-01-04 14:00:00", length: 45 },
  { user_name: "Mike", lesson_timestamp: "2024-01-06 16:30:00", length: 60 },
  { user_name: "Damien", lesson_timestamp: "2024-01-06 17:30:00", length: 30 },
];
const practisesData = [
  { name: "Damien", practice_timestamp: "2024-01-02 12:45:00", length: 30 },
  { name: "Damien", practice_timestamp: "2024-01-04 09:00:00", length: 60 },
  { name: "Damien", practice_timestamp: "2024-01-06 14:00:00", length: 45 },
  { name: "Mike", practice_timestamp: "2024-01-01 11:30:00", length: 45 },
  { name: "Mike", practice_timestamp: "2024-01-03 13:00:00", length: 60 },
  { name: "Mike", practice_timestamp: "2024-01-05 10:00:00", length: 30 },
];
const notesData = [
  {
    lesson_id: 1,
    note_number: 1,
    learning_focus: "Scales",
    note_content: "Focused on scales.",
  },
  {
    lesson_id: 1,
    note_number: 2,
    learning_focus: "Beethoven",
    note_content: "worked on opening scetion.",
  },
  {
    lesson_id: 2,
    note_number: 1,
    learning_focus: "Mozart Horn concerto",
    note_content: "Introduced a new piece.",
  },
  {
    lesson_id: 2,
    note_number: 2,
    learning_focus: "Beethoven",
    note_content: "Discussed phrasing.",
  },
  {
    lesson_id: 2,
    note_number: 3,
    learning_focus: "Finger Techniques",
    note_content: "Addressed finger techniques.",
  },
  {
    lesson_id: 3,
    note_number: 1,
    learning_focus: "Material Review",
    note_content: "Reviewed previous material.",
  },
  {
    lesson_id: 3,
    note_number: 2,
    learning_focus: "Dynamics",
    note_content: "Emphasized dynamics.",
  },
  {
    lesson_id: 4,
    note_number: 1,
    learning_focus: "Chords",
    note_content: "Worked on chords.",
  },
  {
    lesson_id: 5,
    note_number: 1,
    learning_focus: "Scales",
    note_content: "Practiced scales.",
  },
  {
    lesson_id: 6,
    note_number: 1,
    learning_focus: "Lesson Review",
    note_content: "Reviewed previous lesson.",
  },
  {
    practice_id: 1,
    note_number: 1,
    note_content: "Focused on finger exercises.",
    learning_focus: "Finger exercises",
  },
  {
    practice_id: 2,
    note_number: 1,
    note_content: "Practiced sight-reading.",
    learning_focus: "Sight-reading",
  },
  {
    practice_id: 2,
    note_number: 2,
    note_content: "Worked on rhythm.",
    learning_focus: "Rhythm",
  },
  {
    practice_id: 2,
    note_number: 3,
    note_content: "Explored expression techniques.",
    learning_focus: "Expression techniques",
  },
  {
    practice_id: 3,
    note_number: 1,
    note_content: "Reviewed previous material.",
    learning_focus: "Review",
  },
  {
    practice_id: 3,
    note_number: 2,
    note_content: "Focused on dynamics.",
    learning_focus: "Dynamics",
  },
  {
    practice_id: 3,
    note_number: 3,
    note_content: "Practiced specific passages.",
    learning_focus: "Specific passages",
  },
  {
    practice_id: 4,
    note_number: 1,
    note_content: "Practiced chords.",
    learning_focus: "Chords",
  },
  {
    practice_id: 5,
    note_number: 1,
    note_content: "Worked on rhythm patterns.",
    learning_focus: "Rhythm patterns",
  },
  {
    practice_id: 6,
    note_number: 1,
    note_content: "Reviewed previous lesson.",
    learning_focus: "Review",
  },
];

module.exports = {
  usersData,
  lessonsData,
  notesData,
  practisesData,
};
