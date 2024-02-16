const app = require('../app');
const request = require('supertest');
const db = require('../db/connection');
const seed = require('../db/seed')
const data = require('../db/data')
const jwt = require('jsonwebtoken')

let accessTokens;

beforeEach(() => seed(data));
afterAll(() => db.end());

beforeEach(async() => {
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
        .then(({body}) => {
            expect(body.msg).toBe('Path not found.')

        });

        })
    });

    describe('GET /api/lessons', () => {
        test('200 - it should respond with an array of lessons associated with the logged-in user', async() => {
            const response = await request(app)
                .get("/api/lessons")
                .set('Authorization', `Bearer ${accessTokens.accessToken}`)
                .expect(200);

            const decodedPayload = jwt.decode(accessTokens.accessToken);
            const { body } = response;
            expect(body.lessons).toHaveLength(3)
            body.lessons.forEach((lesson) => {
                expect(lesson).toMatchObject({
                    lesson_id: expect.any(Number),
                    user_id: decodedPayload.user_id,
                    lesson_date: expect.any(String),
                    lesson_time: expect.any(String),
                    duration: expect.any(Number)
                })
            })
        });
        test('401: GET request reponds with appropriate status and error when given invalid token', async() => {
            const response = await request(app)
                .get("/api/lessons")
                .set('Authorization', `Bearer saioashisohaio`)
                .expect(401);
            expect( response.body.error ).toBe('jwt malformed')
        });
    });

    describe('GET /api/lessons/notes', () => {
        test('200 - It should respond with an array of all lesson_notes associated with the logged-in user', async() => {
            const response = await request(app)
                .get('/api/lessons/notes')
                .set('Authorization', `Bearer ${accessTokens.accessToken}`)
                .expect(200)

            const { body } = response; 
            expect(body.notes).toHaveLength(7)
            body.notes.forEach((note) => {
                expect(note).toMatchObject({
                    note_id: expect.any(Number),
                    lesson_id: expect.any(Number),
                    notes: expect.any(String),
                    lesson_date: expect.any(String),
                    lesson_time: expect.any(String),
                    duration: expect.any(Number)
                })
            })
        });
    });

    describe('GET /api/lessons/notes/:lesson_id', () => {
        test('200 - should respond with a array of notes associated with given lesson and user', async() => {
            const response = await request(app)
                .get('/api/lessons/notes/2')
                .set('Authorization', `Bearer ${accessTokens.accessToken}`)
                .expect(200)

            const { body } = response; 
            expect(body.notes).toHaveLength(3)
            body.notes.forEach((note) => {
                expect(note).toMatchObject({
                    note_id: expect.any(Number),
                    lesson_id: 2,
                    notes: expect.any(String),
                    lesson_date: expect.any(String),
                    lesson_time: expect.any(String),
                    duration: expect.any(Number)
                })
            })
        });
        test('404 - lesson_id not found', async() => {
            const response = await request(app)
                .get("/api/lessons/notes/108")
                .set('Authorization', `Bearer ${accessTokens.accessToken}`)
                .expect(404)

            const { body } = response;
            expect(body.msg).toBe('Lesson not found') 
        });
        test('status 400 - article_id is a number', async() => {
            const response = await request(app)
                .get("/api/lessons/notes/i2a3m")
                .set('Authorization', `Bearer ${accessTokens.accessToken}`)
                .expect(400)

            const { body } = response;
            expect(body.msg).toBe('Invalid request') 
        })
    });

    describe('GET /api/practises', () => {
        test('200 - should respond with an array of practice sessions associated with the logged-in user', async() => {
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
                    practice_date: expect.any(String),
                    practice_time: expect.any(String),
                    duration: expect.any(Number)
                })
            })
        });
        test('401: GET request reponds with appropriate status and error when given invalid token', async() => {
            const response = await request(app)
                .get("/api/practises")
                .set('Authorization', `Bearer saioashisohaio`)
                .expect(401);
            expect( response.body.error ).toBe('jwt malformed')
        });
    });

    describe('GET /api/practises/notes', () => {
        test('200 - should respond with an array of all practice notes for the user', async() => {
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
                    practice_date: expect.any(String),
                    practice_time: expect.any(String)
                })
            })
        });
    });

    describe('GET /api/practises/notes/:practice_id', () => {
        test('200 - should serve an array of practice notes linked to the given practice_id', async() => {
            const response = await request(app)
                .get('/api/practises/notes/3')
                .set('Authorization', `Bearer ${accessTokens.accessToken}`)
                .expect(200)
            const { body: { notes }} = response;
            expect(notes).toHaveLength(3)
            notes.forEach(note => {
                expect(note).toMatchObject({
                    practice_id: expect.any(Number),
                    note_id: expect.any(Number),
                    notes: expect.any(String),
                    practice_date: expect.any(String),
                    practice_time: expect.any(String)
                })
            })
        });
        test('404 - should respond with a 404 status code when practice_id for valid user', async() => {
            const response = await request(app)
                .get('/api/practises/notes/999')
                .set('Authorization', `Bearer ${accessTokens.accessToken}`)
                .expect(404);
            expect (response.body.msg).toBe('Not found')
        });
        test('400 - should respond with a 400 status code for invalid input', async() => {
            const response = await request(app)
                .get('/api/practises/notes/invalid_id')
                .set('Authorization', `Bearer ${accessTokens.accessToken}`)
                .expect(400);
        });
        test('401 - should respond with a 401 status code when invalid authorization token is provided', async() => {
           let invalidToken = accessTokens.accessToken.slice(0, -1) + 'a'
            const response = await request(app)
                .get('/api/practises/notes/3')
                .set('Authorization', `Bearer ${invalidToken}`)
                .expect(401);
            expect(response.body.error).toBe('invalid signature')
        });
        test('401 - should respond with a 401 status code when no authorization token is provided', async() => {
            const response = await request(app)
                .get('/api/practises/notes/3')
                .expect(401);
            expect(response.body.error).toBe('Null token')
        });
    });


    // describe('GET /api')

})

describe('POST', () => {

    describe('POST /api/users', () => {
        test('201 - responds with the added user', async () => {
            const newUser = {user_name: "Harry", user_email: "haribo@hazbob.bob", user_password: "testPassword1234", instrument: "Harmonica"}
            const response = await request(app)
                .post("/api/users")
                .send(newUser)
                .expect(201);

            const { body: { user } } = response;
            expect(user).toMatchObject({
                user_id: expect.any(String),
                user_name: "Harry",
                user_email: "haribo@hazbob.bob", 
                user_password: expect.any(String), 
                instrument: "Harmonica"
            })
        });
    })

})
