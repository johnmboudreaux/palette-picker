const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../server');

const environment = process.env.NODE_ENV || 'test';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

chai.use(chaiHttp);


describe('Client Routes', () => {
  it('should return homepage with text', () => {
    return chai.request(server)
      .get('/')
      .then(response => {
        response.should.have.status(200);
        response.should.be.html;
        response.res.text.includes('Palette Picker');
      })
      .catch(error => {
        throw error;
      });
  });

  it('should return a 404 if the route does not exsit', () => {
    chai.request(server)
      .get('/sad')
      .then(response => {
        response.should.have.status(404);
      });
  });
});

describe('API Routes', () => {
  before((done) => {
    database.migrate.latest()
      .then(() => done())
      .catch(error => {
        throw error;
      });
  });

  beforeEach((done) => {
    database.seed.run()
      .then(() => done())
      .catch(error => {
        throw error;
      });
  });

  describe('GET /api/v1/projects', () => {
    it("should return all projects", (done) => {
      chai.request(server)
        .get('/api/v1/projects')
        .then(response => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('array');
          response.body.length.should.equal(1);
          response.body[0].should.have.property('id');
          response.body[0].id.should.equal(1);
          response.body[0].should.have.property('title');
          response.body[0].title.should.equal('Star Wars');
          done();
        })
        .catch(error => {
          throw error;
        });
    });
  });

  describe('GET /api/v1/projects/:id', () => {
    it('should return a specific project', (done) => {
      chai.request(server)
        .get('/api/v1/projects/1')
        .then((response) => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('array');
          response.body.length.should.equal(1);
          response.body[0].should.have.property('id');
          response.body[0].id.should.equal(1);
          response.body[0].should.have.property('title');
          response.body[0].title.should.equal('Star Wars');
          response.body[0].should.have.property('created_at');
          response.body[0].should.have.property('updated_at');
          done();
        })
        .catch((error) => {
          throw error;
        });
    });
  });

  describe('GET /api/v1/projects/:id/palettes', () => {
    it('should return all palettes for a specific project', (done) => {
      chai.request(server)
        .get('/api/v1/projects/1/palettes')
        .then((response) => {
          response.should.have.status(201);
          response.should.be.json;
          response.body.should.be.a('array');
          response.body.length.should.equal(2);
          response.body[1].should.have.property('id');
          response.body[1].id.should.equal(2);
          response.body[1].should.have.property('name');
          response.body[1].name.should.equal('palette2');
          response.body[1].should.have.property('color1');
          response.body[1].color1.should.equal('#ae0000');
          response.body[1].should.have.property('color2');
          response.body[1].color2.should.equal('#007ce6');
          response.body[1].should.have.property('color3');
          response.body[1].color3.should.equal('#2de3a2');
          response.body[1].should.have.property('color4');
          response.body[1].color4.should.equal('#b7a17c');
          response.body[1].should.have.property('color5');
          response.body[1].color5.should.equal('#c0b49d');
          response.body[1].should.have.property('projectId');
          response.body[1].projectId.should.equal(1);
          response.body[1].should.have.property('created_at');
          response.body[1].should.have.property('updated_at');
          done();
        })
        .catch((error) => {
          throw error;
        });
    });
  });

  describe('GET /api/v1/palettes/:id', () => {
    it('should return a specific palette', (done) => {
      chai.request(server)
        .get('/api/v1/palettes/1')
        .then((response) => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('array');
          response.body.length.should.equal(1);
          response.body[0].should.have.property('id');
          response.body[0].id.should.equal(1);
          response.body[0].should.have.property('name');
          response.body[0].name.should.equal('palette1');
          response.body[0].should.have.property('color1');
          response.body[0].color1.should.equal('#2ff923');
          response.body[0].should.have.property('color2');
          response.body[0].color2.should.equal('#7bfe86');
          response.body[0].should.have.property('color3');
          response.body[0].color3.should.equal('#551a8b');
          response.body[0].should.have.property('color4');
          response.body[0].color4.should.equal('#2719c7');
          response.body[0].should.have.property('color5');
          response.body[0].color5.should.equal('#ff9933');
          response.body[0].should.have.property('projectId');
          response.body[0].projectId.should.equal(1);
          response.body[0].should.have.property('created_at');
          response.body[0].should.have.property('updated_at');
          done();
        })
        .catch((error) => {
          throw error;
        });
    });
  });

});
