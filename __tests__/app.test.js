const app = require('../app');
const request = require('supertest');
const db = require('../db/connection');
const seed = require('../db/seed')
const data = require('../db/data')
const jwt = require('jsonwebtoken')

let accessTokens;

beforeEach(() => seed(data));
afterAll(() => db.end());

beforeEach(async () => {
    const credentials = {
        email: 'testemail@test.com',
        password: 'Password123'
    };
    const response = await request(app)
        .post("/api/auth/login")
        .send(credentials)

    accessTokens = response.body.tokens
})

describe('GET', () => {

    describe('GET /*', () => {
        test('404 path not found', () => {
            return request(app)
                .get("/api/westworld")
                .expect(404)
                .then(({ body }) => {
                    expect(body.msg).toBe('Path not found.')

                });

        })
    });

    describe('GET /api/lessons', () => {
        test('200 - it should respond with an array of lessons associated with the logged-in user', async () => {
            const response = await request(app)
                .get("/api/lessons")
                .set('Authorization', `Bearer ${accessTokens.accessToken}`)
                .expect(200);

            const decodedPayload = jwt.decode(accessTokens.accessToken);
            const { body } = response;
            expect(body.lessons).toHaveLength(4)
            body.lessons.forEach((lesson) => {
                expect(lesson).toMatchObject({
                    lesson_id: expect.any(Number),
                    user_id: decodedPayload.user_id,
                    lesson_timestamp: expect.any(String), // Updated to timestamp
                    duration: expect.any(Number)
                })
            })
        });
        test('401: GET request responds with appropriate status and error when given invalid token', async () => {
            const response = await request(app)
                .get("/api/lessons")
                .set('Authorization', `Bearer saioashisohaio`)
                .expect(401);
            expect(response.body.error).toBe('jwt malformed')
        });
    });

    describe('GET /api/lessons/notes', () => {
        test('200 - It should respond with an array of all lesson_notes associated with the logged-in user', async () => {
            const response = await request(app)
                .get("/api/lessons/notes")
                .set('Authorization', `Bearer ${accessTokens.accessToken}`)
                .expect(200);

            const { body } = response;
            expect(body.lessons).toHaveLength(4)
            body.lessons.forEach((lesson) => {
                expect(lesson).toMatchObject({
                    lesson_id: expect.any(Number),
                    lesson_timestamp: expect.any(String),
                    duration: expect.any(Number),
                    notes: expect.any(Array)
                })
                lesson.notes.forEach((note)=>{
                    expect(note).toEqual(
                        expect.objectContaining({
                            note_id: expect.any(Number),
                            notes: expect.any(String),
                            learning_focus: expect.any(String)                       
                        })
                    )
                })   
            })
        });
    });

    describe('GET /api/lessons/:/lesson_id/notes', () => {
        test('200 - should respond with an array of notes associated with given lesson and user', async () => {
            const response = await request(app)
                .get('/api/lessons/2/notes')
                .set('Authorization', `Bearer ${accessTokens.accessToken}`)
                .expect(200)

            const { body } = response;
            const lesson = body.lessons[0]
            expect(lesson).toMatchObject({
                lesson_id: expect.any(Number),
                lesson_timestamp: expect.any(String),
                duration: expect.any(Number),
                notes: expect.any(Array)
            })
            lesson.notes.forEach((note)=>{
                expect(note).toEqual(
                    expect.objectContaining({
                        note_id: expect.any(Number),
                        notes: expect.any(String),
                        learning_focus: expect.any(String)      
                    })
                )
            })   

        });
        test('404 - lesson_id not found', async () => {
            const response = await request(app)
                .get("/api/lessons/108/notes")
                .set('Authorization', `Bearer ${accessTokens.accessToken}`)
                .expect(404)

            const { body } = response;
            expect(body.msg).toBe('Lesson not found')
        });
        test('status 400 - article_id is a number', async () => {
            const response = await request(app)
                .get("/api/lessons/i2a3m/notes")
                .set('Authorization', `Bearer ${accessTokens.accessToken}`)
                .expect(400)

            const { body } = response;
            expect(body.msg).toBe('Invalid request')
        })
    });

    describe('GET /api/practises', () => {
        test('200 - should respond with an array of practice sessions associated with the logged-in user', async () => {
            const response = await request(app)
                .get("/api/practises")
                .set('Authorization', `Bearer ${accessTokens.accessToken}`)
                .expect(200);

            const decodedPayload = jwt.decode(accessTokens.accessToken);
            expect(response.body.practises).toHaveLength(3)
            response.body.practises.forEach(practice => {
                expect(practice).toMatchObject({
                    practice_id: expect.any(Number),
                    user_id: decodedPayload.user_id,
                    practice_timestamp: expect.any(String), // Updated to timestamp
                    duration: expect.any(Number)
                })
            })
        });
        test('401: GET request responds with appropriate status and error when given invalid token', async () => {
            const response = await request(app)
                .get("/api/practises")
                .set('Authorization', `Bearer saioashisohaio`)
                .expect(401);
            expect(response.body.error).toBe('jwt malformed')
        });
    });

    describe('GET /api/practises/notes', () => {
        test('200 - should respond with an array of all practice notes for the user', async () => {
            const response = await request(app)
                .get('/api/practises/notes')
                .set('Authorization', `Bearer ${accessTokens.accessToken}`)
                .expect(200);
            expect(response.body.notes).toHaveLength(7)
            response.body.notes.forEach(note => {
                expect(note).toMatchObject({
                    practice_id: expect.any(Number),
                    note_id: expect.any(Number),
                    notes: expect.any(String),
                    practice_timestamp: expect.any(String), // Updated to timestamp
                })
            })
        });
    });

    describe('GET /api/practises/:practice_id/notes', () => {
        test('200 - should serve an array of practice notes linked to the given practice_id', async () => {
            const response = await request(app)
                .get('/api/practises/3/notes')
                .set('Authorization', `Bearer ${accessTokens.accessToken}`)
                .expect(200)
            const { body: { notes } } = response;
            expect(notes).toHaveLength(3)
            notes.forEach(note => {
                expect(note).toMatchObject({
                    practice_id: expect.any(Number),
                    note_id: expect.any(Number),
                    notes: expect.any(String),
                    practice_timestamp: expect.any(String), // Updated to timestamp
                })
            })
        });
        test('404 - should respond with a 404 status code when practice_id for valid user', async () => {
            const response = await request(app)
                .get('/api/practises/999/notes')
                .set('Authorization', `Bearer ${accessTokens.accessToken}`)
                .expect(404);
            expect(response.body.msg).toBe('Not found')
        });
        test('400 - should respond with a 400 status code for invalid input', async () => {
            const response = await request(app)
                .get('/api/practises/invalid_id/notes')
                .set('Authorization', `Bearer ${accessTokens.accessToken}`)
                .expect(400);
        });
        test('401 - should respond with a 401 status code when invalid authorization token is provided', async () => {
            let invalidToken = accessTokens.accessToken.slice(0, -1) + 'a'
            const response = await request(app)
                .get('/api/practises/3/notes')
                .set('Authorization', `Bearer ${invalidToken}`)
                .expect(401);
            expect(response.body.error).toBe('invalid signature')
        });
        test('401 - should respond with a 401 status code when no authorization token is provided', async () => {
            const response = await request(app)
                .get('/api/practises/3/notes')
                .expect(401);
            expect(response.body.error).toBe('Null token')
        });
    });


    // describe('GET /api')

})

describe('POST', () => {
    describe('POST api/lessons', () => {
        test('201 should respond with the posted lesson object', async() => {
            const currentTimeStamp = new Date().toISOString()
            const decodedPayload = jwt.decode(accessTokens.accessToken);
            const newLesson = {timestamp: currentTimeStamp, duration: 30}
            const response = await request(app)
                .post('/api/lessons')
                .send(newLesson)
                .set('Authorization', `Bearer ${accessTokens.accessToken}`)
                .expect(201)
            expect(response.body.lesson).toMatchObject({
                lesson_id: 8,
                user_id: decodedPayload.user_id,
                lesson_timestamp: currentTimeStamp,
                duration: 30
            })
        });

        test('201 if duration is missing, it should default to 20', async () => {
            const currentTimeStamp = new Date().toISOString()
            const decodedPayload = jwt.decode(accessTokens.accessToken);
            const newLesson = {timestamp: currentTimeStamp}
            const response = await request(app)
                .post('/api/lessons')
                .send(newLesson)
                .set('Authorization', `Bearer ${accessTokens.accessToken}`)
                .expect(201);
                expect(response.body.lesson).toMatchObject({
                    lesson_id: 8,
                    user_id: decodedPayload.user_id,
                    lesson_timestamp: currentTimeStamp,
                    duration: 20
                })
        });
        test('400 should respond with an error if timestamp is missing', async () => {
            const decodedPayload = jwt.decode(accessTokens.accessToken);
            const newLesson = { user_id: decodedPayload.user_id, duration: 30 };
            const response = await request(app)
                .post('/api/lessons')
                .send(newLesson)
                .set('Authorization', `Bearer ${accessTokens.accessToken}`)
                .expect(400);
            expect(response.body.msg).toBe('Invalid request');
        });
        
    });

    describe('POST api/lessons/:lesson_id/notes', () => {
        test('201 should respond with the posted lesson note', async() => {
            const newNote = {learning_focus: 'scales', notes: "C minor pentatonic, 15 octaves. 11 fingers contrary motion" }
            const response = await request(app)    
                .post('/api/lessons/3/notes')
                .set('Authorization', `Bearer ${accessTokens.accessToken}`)
                .send(newNote)
                .expect(201)
            expect(response.body.note).toMatchObject({
                    note_id: expect.any(Number),
                    lesson_id: 3,
                    learning_focus: 'scales',
                    notes: 'C minor pentatonic, 15 octaves. 11 fingers contrary motion'
            })
        });
        test('403 should respond with an error if user tries to post to a lesson not of theirs ', async() => {
            const newNote = {notes: "C minor pentatonic, 15 octaves. 11 fingers contrary motion" }
            const response = await request(app)    
                .post('/api/lessons/4/notes')
                .set('Authorization', `Bearer ${accessTokens.accessToken}`)
                .send(newNote)
                .expect(403)
        });
    });

    describe('POST api/practises', () => {
        test('201 - should respond with the posted practice object', async() => {
            const currentTimeStamp = new Date().toISOString()
            const decodedPayload = jwt.decode(accessTokens.accessToken);
            const newPractice = {timestamp: currentTimeStamp, duration:15};
            const response = await request(app)
                .post('/api/practises')
                .send(newPractice)
                .set('Authorization', `Bearer ${accessTokens.accessToken}`)
                .expect(201)
            expect(response.body.note).toMatchObject({
                practice_id: expect.any(Number),
                user_id: decodedPayload.user_id,
                practice_timestamp: currentTimeStamp,
                duration: 15
            })
        });
        test('400 - POST request should reject malformed input', async() => {
            const response = await request(app)
                .post('/api/practises')
                .set('Authorization', `Bearer ${accessTokens.accessToken}`)
                .send({timestamp: "2024-01-02 234", duration: 32})
                .expect(400)
            const response2 = await request(app)
                .post('/api/practises')
                .set('Authorization', `Bearer ${accessTokens.accessToken}`)
                .send({timestamp: new Date().toISOString(), duration: 'Phil'})
                .expect(400)
        })
    });

    describe('POST api/practises/:practice_id/notes', () => {
        test('201 should respond with the posted practice note ', async() => {
            const newNote = {practice_id: 3, notes: "managed to conquer G# minor"};
            const response = await request(app)    
                .post('/api/practises/3/notes')
                .set('Authorization', `Bearer ${accessTokens.accessToken}`)
                .send(newNote)
                .expect(201)
            expect(response.body.note).toMatchObject({
                practice_id: 3,
                notes: "managed to conquer G# minor",
                note_id: expect.any(Number)
            })
        });
        test('404 should respond with Not Found if practice ID does not exist', async() => {
            const nonExistentPracticeId = 999; // Assuming this ID does not exist
            const newNote = { practice_id: nonExistentPracticeId, notes: "Some notes" };
            const response = await request(app)
                .post(`/api/practises/${nonExistentPracticeId}/notes`)
                .set('Authorization', `Bearer ${accessTokens.accessToken}`)
                .send(newNote)
                .expect(404);
            expect(response.body.msg).toBe('Resource not found');
        });
        test('403 -  it should reject a POST request to another users practice', async() => {
            const newNote = {practice_id: 6, notes: "notes going to wrong place"};
            const response = await request(app)    
                .post(`/api/practises/${newNote.practice_id}/notes`)
                .set('Authorization', `Bearer ${accessTokens.accessToken}`)
                .send(newNote)
                .expect(403)
            expect(response.body.msg).toBe('Forbidden')
        });
    });

    describe('DELETE', () => {
        
    });

    describe('PATCH', () => {
        describe('PATCH /api/lessons/notes', () => {
            test('should update the notes of the given note_id', async() => {
                const newLessonNotes = {note_id: 3, notes: "gave up on that piece. Onwards!"}
                const response = await request(app)
                    .patch('/api/lessons/notes')
                    .set('Authorization', `Bearer ${accessTokens.accessToken}`)
                    .send(newLessonNotes)
                    .expect(200)
                expect(response.body.note).toMatchObject(
                    {note_id: 3, lesson_id:2, learning_focus: "Mozart Horn concerto", notes: "gave up on that piece. Onwards!"}
                )
            });
            test('should not update another users lesson note', async() => {
                const newLessonNotes = {note_id: 9, notes: "what have you been working on Mike?"};
                const response = await request(app)
                .patch('/api/lessons/notes')
                .set('Authorization', `Bearer ${accessTokens.accessToken}`)
                .send(newLessonNotes)
                .expect(403)
            });
        });

        describe('PATCH /api/practises/:practice_id/notes', () => {
            test('200 should update the notes given note_id', async() => {
                const newPracticeNotes = {note_id: 2, notes: "gave up on that piece. Onwards!"}
                const response = await request(app)
                    .patch('/api/practises/2/notes')
                    .set('Authorization', `Bearer ${accessTokens.accessToken}`)
                    .send(newPracticeNotes)
                    .expect(200)
                expect(response.body.note).toMatchObject(
                    {note_id: 2, practice_id:2, notes: "gave up on that piece. Onwards!"}
                )
            });
        });
    });

    describe('DELETE', () => {
        describe('DELETE /api/lessons/:lesson_id', () => {
            test('204 should delete the lesson with given lesson_id', async() => {
                const response = await request(app)
                    .delete('/api/lessons/2')
                    .set('Authorization', `Bearer ${accessTokens.accessToken}`)
                    .expect(204)
                const remainingUserLessons = await request(app)
                    .get('/api/lessons')
                    .set('Authorization', `Bearer ${accessTokens.accessToken}`)    
                    .expect(200)    
                expect(remainingUserLessons.body.lessons).toHaveLength(3)    
                })
        });

        test('404 should respond with Not Found if lesson_id does not exist', async () => {
            const nonExistentLessonId = 999; 
            const response = await request(app)
                .delete(`/api/lessons/${nonExistentLessonId}`)
                .set('Authorization', `Bearer ${accessTokens.accessToken}`)
                .expect(404);
            expect(response.body.msg).toBe('Lesson not found');
        });

        test('403 should respond with Forbidden if user does not have permission', async () => {
            const response = await request(app)
                .delete('/api/lessons/5')
                .set('Authorization', `Bearer ${accessTokens.accessToken}`)
                .expect(403);
            expect(response.body.msg).toBe('Forbidden');
        });

    })

    describe('DELETE /api/practises/:practice_id', () => {
        test('204 should delete the lesson with given practice_id', async() => {
            const response = await request(app)
                .delete('/api/practises/1')
                .set('Authorization', `Bearer ${accessTokens.accessToken}`)
                .expect(204)
            const remainingPractises = await request(app)
                .get('/api/practises')
                .set('Authorization', `Bearer ${accessTokens.accessToken}`)    
                .expect(200)    
            expect(remainingPractises.body.practises).toHaveLength(2)    
        })

        test('404 should respond with Not Found if practice_id does not exist', async () => {
            const nonExistentId = 992; 
            const response = await request(app)
                .delete(`/api/practises/${nonExistentId}`)
                .set('Authorization', `Bearer ${accessTokens.accessToken}`)
                .expect(404);
            expect(response.body.msg).toBe('Practice not found');
        });

        test('403 should respond with Forbidden if user does not have permission', async () => {
            const response = await request(app)
                .delete('/api/practises/4')
                .set('Authorization', `Bearer ${accessTokens.accessToken}`)
                .expect(403);
            expect(response.body.msg).toBe('Forbidden');
        });

    });

})

