const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const baseUrl = 'localhost:3001/';
chai.use(chaiHttp);

const app = require('../start');
const request = require('supertest');
const authenticatedUser = request.agent(app);

describe('User REST API Unit Test', function() {
  let user;
  const firstUser = {
    'username': 'cameron',
    'password': '12345',
  };
  user = firstUser.username;

  const newDay = {
    'day': '20',
    'month': '2021-5',
    'bullets': [],
  };

//   it('Test 1: create a valid user', function(done) {
//     authenticatedUser
//         .post('/create/user')
//         .set('Content-Type', 'application/json')
//         .send(firstUser)
//         .end(function(err, res) {
//           expect(res).to.have.status(200);
//           expect(res.body.id).to.equal(firstUser.username);
//           user = firstUser.username;
//           done();
//         });
//   });

  // log in/ create the session
//   let userId;

  it('Test 2: create a session for the user', function(done) {
    authenticatedUser
        .post('/create/session')
        .set('Content-Type', 'application/json')
        .send(firstUser)
        .end(function(err, res) {
          expect(res.statusCode).to.equal(302);
          expect(res.text).to.equal('Found. Redirecting to session/success');
          done();
        });
  });

  // new daily creation 
  it('Test 3: create a daily', function(done) {
    authenticatedUser
        .post('/create/daily')
        .set('Content-Type', 'application/json')
        .send(newDay)
        .end(function(err, res) {
          expect(res.statusCode).to.equal(200);
          expect(res.ok).to.equal(true);
          done();
        });
  });


let delJSON = {
    '_id': ""
};
  // get daily
  it('Test 4: get the day', function(done) {
    authenticatedUser
        .get('/read/daily/' + newDay.month + '/' + newDay.day)
        .set('Content-Type', 'application/json')
        .end(function(err, res) {
          delJSON._id = res.body._id;
          expect(res.body.user).to.equal(user);
          expect(res.body.docType).to.equal('daily');
          done();
        });
  });

  
  // delete daily
  it('Test 5: delete daily', function(done) {
    authenticatedUser
        .delete('/delete/daily')
        .set('Content-Type', 'application/json')
        .send(delJSON)
        .end(function(err, res) {
          expect(res.text).to.equal('success');
          done();
        });
  });

  // attempt to delete same daily should fail and reponse should be error
  it('Test 6: delete same daily again', function(done) {
    authenticatedUser
        .delete('/delete/daily')
        .set('Content-Type', 'application/json')
        .send(delJSON)
        .end(function(err, res) {
          expect(res.text).to.equal('error');
          done();
        });
  });


//   const updateDaily = {
    
//     "_id": "72fe31a8-a118-4628-b42c-9e3124aa46e3",
//     "updateField": {
//         "day": "10",
//         "month": "2021-12",
//         "bullets": []
//     }
    
//   };
  // update daily
//   it('Test 7: update daily', function(done) {
//     authenticatedUser
//         .post('/update/user')
//         .set('Content-Type', 'application/json')
//         .send(updateDaily)
//         .end(function(err, res) {
//           expect(res.text).to.equal('success');
//           done();
//         });
//   });
  
  

});