const app = require('../app');
const request = require('supertest');
const db = require('../db/connection');
const seed = require('../db/seed')
const data = require('../db/data')

let accessTokens;

beforeEach(() => seed(data));
afterAll(() => db.end());

describe('Authorization', () => {
    
    describe('POST /api/auth/login', () => {
        test('200 - user login succesful with valid credentials', async() => {
            const credentials = {
                email: 'testemail@test.com',
                password: 'Password123'
            };
            const response = await request(app)
                .post("/api/auth/login")
                .send(credentials)
                .expect(200)
            
            expect(response.body.tokens).toMatchObject({
                accessToken: expect.any(String),
                refreshToken: expect.any(String)
            })
        })
        test('401 - invalid email provided during login', async() => {
            const credentials = {
                email: 'test@test.com',
                password: 'Password123'
            };

            const response = await request(app)
            .post("/api/auth/login")
                .send(credentials)
                .expect(401)
                    
            expect(response.body.msg).toBe('Email is incorrect')
        })
        test('401 - incorrect password provided during login', async() => {
            const credentials = {
                email: 'testemail@test.com',
                password: 'Password'
            };

            const response = await request(app)
            .post("/api/auth/login")
                .send(credentials)
                .expect(401)
 
            const { body : { msg } } = response;
            expect(msg).toBe("Incorrect Password")
        })

    });
});