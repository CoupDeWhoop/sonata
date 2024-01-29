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
            console.log(body)

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


    describe('GET /api/lessons/', () => {
        
    });
})