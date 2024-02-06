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
    describe('GET /api/lessons/admin', () => {
        test('200 - responds with an array of all lessons data for admininstrator', async () => {
            const credentials = {
                email: process.env.ADMIN_EMAIL,
                password: 'AdminPassword'
            };
            const adminResponse = await request(app)
                .post("/api/auth/login")
                .send(credentials);
            accessTokens = adminResponse.body.tokens
            
            const response = await request(app)
                .get("/api/lessons/admin")
                .set('Authorization', `Bearer ${accessTokens.accessToken}`)
                .expect(200);
            const { body } = response;

            expect(body.lessons).toHaveLength(6)
            for (const lesson of body.lessons) {
                expect(lesson).toHaveProperty("lesson_date", expect.any(String))
                // this time cheking might be unneccessary!
                const isValidTime = /^(\d{2}):(\d{2}):(\d{2})$/.test(lesson.lesson_time)
                expect(isValidTime).toBe(true);
                expect(lesson.duration).toEqual(expect.any(Number));
            }
        });

        test('403 - rejects non admin user for GET all lessons ', async () => {
            const response = await request(app)
                .get("/api/lessons/admin")
                .set('Authorization', `Bearer ${accessTokens.accessToken}`)
                .expect(403);

            const { body } = response;
            expect(body.error).toBe("Forbidden: Admin privileges required")

            })
    })

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
    });


    describe('GET /api/users', () => {
        test('200 - should respond with an array of user objects ', async () => {
            const response = await request(app)
                .get('/api/users')
                .set('Authorization', `Bearer ${accessTokens.accessToken}`)
                .expect(200)
            expect(response.body.users).toHaveLength(2)
            response.body.users.forEach((user) => {
                expect(user).toHaveProperty("user_id", expect.any(String))
                expect(user).toHaveProperty("user_name", expect.any(String))
                expect(user).toHaveProperty("user_email", expect.any(String))
                expect(user).toHaveProperty("user_password", expect.any(String))
                expect(user).toHaveProperty("instrument", expect.any(String))
            }) 
        });
    });
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
