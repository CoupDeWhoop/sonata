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
        test('400: GET request reponds with appropriate status and error when given invalid token', async() => {
            const response = await request(app)
                .get("/api/lessons")
                .set('Authorization', `Bearer saioashisohaio`)
                .expect(403);
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
