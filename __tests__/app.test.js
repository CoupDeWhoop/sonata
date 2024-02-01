const app = require('../app');
const request = require('supertest');
const db = require('../db/connection');
const seed = require('../db/seed')
const data = require('../db/data')

beforeEach(() => seed(data));
afterAll(() => db.end());

describe('GET', () => {

    describe('GET /api/lessons', () => {
        test('200 - responds with an array of lessons data', async () => {
            const response = await request(app)
                .get("/api/lessons")
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
    })


    describe('GET /api/users', () => {
        it('200 - should respond with an array of user objects ', async () => {
            const response = await request(app)
                .get('/api/users')
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

    describe('POST /api/login', () => {
        test('200 - user login succesful with valid credentials', () => {

        })
        test('401 - invalid email provided during login', async() => {
            const credentials = {
                email: 'test@test.com',
                password: 'Password123'
            };

            const response = await request(app)
                .post("/api/login")
                .send(credentials)
                .expect(401)
                    
            expect(response.body.msg).toBe('Email is incorrect')
        })

    });


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