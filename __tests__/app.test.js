const app = require('../app');
const request = require('supertest');
const db = require('../db/connection');
const seed = require('../db/seed')
const data = require('../db/data')

beforeEach(() => seed(data));
afterAll(() => db.end());

describe('GET', () => {

    describe('GET /api/lessons', () => {
        test('200 - responds with an array of lessons data', () => {
            return request(app)
            .get("/api/lessons")
            .expect(200)
            .then(({body}) => {
                expect(body.lessons).toHaveLength(3)
                body.lessons.forEach((lesson) => {
                    expect(lesson).toHaveProperty("lesson_date", expect.any(String))
                    // this time cheking might be unneccessary!
                    const isValidTime = /^(\d{2}):(\d{2}):(\d{2})$/.test(lesson.lesson_time)
                    expect(isValidTime).toBe(true);
                    expect(lesson.duration).toEqual(expect.any(Number));
                })
            })
        });
    });
})