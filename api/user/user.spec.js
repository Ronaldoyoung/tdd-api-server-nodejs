// 테스트 코드
const app = require('../../');
const request = require('supertest');
const should = require('should');
const models = require('../../models');

describe('GET /users는', () => {
  const users = [
    { name: 'alice' },
    { name: 'bak' },
    { name: 'chris' },
  ]
  before(() => models.sequelize.sync({ force: true }));
  before(() => models.User.bulkCreate(users));
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

describe('GET /users/:id 는', () => {
  const users = [
    { name: 'alice' },
    { name: 'bak' },
    { name: 'chris' },
  ]
  before(() => models.sequelize.sync({ force: true }));
  before(() => models.User.bulkCreate(users));
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

describe('DELETE /users/:id', () => {
  const users = [
    { name: 'alice' },
    { name: 'bak' },
    { name: 'chris' },
  ]
  before(() => models.sequelize.sync({ force: true }));
  before(() => models.User.bulkCreate(users));
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
  const users = [
    { name: 'alice' },
    { name: 'bak' },
    { name: 'chris' },
  ]
  before(() => models.sequelize.sync({ force: true }));
  before(() => models.User.bulkCreate(users));
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
  describe('실패 시', () => {
    it('name 파라미터 누락시 400 반환한다.', (done) => {
      request(app)
        .post('/users')
        .send({})
        .expect(400)
        .end(done)
    });
    it('name 이 중복일 경우 409를 반환한다.', done => {
      request(app)
        .post('/users')
        .send({ name: 'daniel' })
        .expect(409)
        .end(done)
    });
  });
});

describe('PUT /users/:id', () => {
  const users = [
    { name: 'alice' },
    { name: 'bak' },
    { name: 'chris' },
  ]
  before(() => models.sequelize.sync({ force: true }));
  before(() => models.User.bulkCreate(users));
  describe('성공 시', () => {
    it('변경된 name 을 반환한다.', done => {
      const name = 'chally';
      request(app)
        .put('/users/3')
        .send({ name })
        .end((err, res) => {
          res.body.should.have.property('name', name);
          done();
        });
    });
  });
  describe('실패 시', () => {
    it('정수가 아닌 id 일 경우 400 을 응답한다.', done => {
      request(app)
        .put('/users/one')
        .expect(400)
        .end(done)
    });
    it('name이 없을 경우 400을 응답한다.', done => {
      request(app)
        .put('/users/3')
        .send({})
        .expect(400)
        .end(done)
    });
    it('없는 user 일 경우 404 를 응답한다.', done => {
      request(app)
        .put('/users/999')
        .send({ name: 'foo' })
        .expect(404)
        .end(done)
    });
    it('이름이 중복일 경우 409를 응답한다.', done => {
      request(app)
        .put('/users/3')
        .send({ name: 'bak' })
        .expect(409)
        .end(done)
    });
  });
});