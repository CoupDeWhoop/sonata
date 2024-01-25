const app = require('../app')

beforeEach(() => seed(data));
afterAll(() => db.end());