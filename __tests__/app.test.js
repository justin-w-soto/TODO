require('dotenv').config();

const { execSync } = require('child_process');

const fakeRequest = require('supertest');
const app = require('../lib/app');
const client = require('../lib/client');

describe('app routes', () => {
  describe('routes', () => {
    let token;
  
    beforeAll(async () => {
      execSync('npm run setup-db');
  
      await client.connect();
      const signInData = await fakeRequest(app)
        .post('/auth/signin')
        .send({
          email: 'jon@user.com',
          password: '1234'
        });
      
      token = signInData.body.token; // eslint-disable-line
    }, 10000);
  
    afterAll(done => {
      return client.end(done);
    });

    test('returns todos', async() => {

      const expectation = [
        {
          id: 1,
          todo: 'wash the desert tortoise',
          completed: false,
          owner_id: 2
        },
        {
          id: 2,
          todo: 'wash the double doodle',
          completed: false,
          owner_id: 2
        },
        {
          id: 3,
          todo: 'wash the donkey',
          completed: false,
          owner_id: 2
        },
        {
          id: 4,
          todo: 'wash the dolphin',
          completed: false,
          owner_id: 2
        },
        {
          id: 5,
          todo: 'wash the dung beetle',
          completed: false,
          owner_id: 2
        }
        ];

      const data = await fakeRequest(app)
        .get('/api/todos')
        .set('Authorization', token)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);
    });
  });
});
