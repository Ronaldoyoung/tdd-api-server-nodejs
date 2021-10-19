const app = require('./index');
const request = require('supertest');
const should = require('should');

describe('GET /users는', () => {
  describe('성공시', () => {
    it('유저 객체를 담은 배열로 응답함.', (done) => {
      request(app)
        .get('/users')
        .end((err, res) => {
          res.body.should.be.instanceOf(Array);
          done();
        })
    });
    it('최대 limit 갯수만큼 응답한다.', (done) => {
      request(app)
        .get('/users?limit=2')
        .end((err, res) => {
          res.body.should.be.lengthOf(2)
          done();
        })
    })
  })
  describe('실패 시', () => {
    it('limit이 숫자형이 아니면 400을 응답한다.', (done) => {
      request(app)
        .get('/users?limit=two')
        .expect(400)
        .end(done)
    })
  })
});

describe('GET /users/1 는', () => {
  describe('성공시', () => {
    it('id 가 1인 유저 객체를 반환한다.', (done) => {
      request(app)
        .get('/users/1')
        .end((err, res) => {
          res.body.should.have.property('id', 1);
          done()
        })
    });
  })
  describe('실패 시', () => {
    it('id가 숫자가 아닐경우 400으로 응답한다.', (done) => {
      request(app)
        .get('/users/won')
        .expect(400)
        .end(done)
    })
    it('id로 유저를 찾을 수 없을 경우 404로 응답하낟.', (done) => {
      request(app)
        .get('/users/999')
        .expect(404)
        .end(done)
    })
  })
});

describe('DELETE /users/1', () => {
  describe('성공 시', () => {
    it('204를 응답한다.', (done) => {
      request(app)
        .delete('/users/1')
        .expect(204)
        .end(done);
    })
  })
  describe('실패 시', (done) => {
    it('id 가 숫자가 아닐 경우 400 으로 응답한다.', done => {
      request(app)
        .delete('/users/won')
        .expect(400)
        .end(done);
    })
  })
});

describe('POST /users', () => {
  describe('성공시', () => {
    let name = 'daniel', body;
    before(done => {
      request(app)
        .post('/users')
        .send({ name })
        .expect(201)
        .end((err, res) => {
          body = res.body;
          done();
        });
    })
    it('생성 된 유저 객체를 반환한다.', () => {
      body.should.have.property('id');
    });
    it('입력한 name 을 반환한다.', () => {
      body.should.have.property('name', name);
    })
  })
})