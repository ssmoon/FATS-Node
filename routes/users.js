'use strict';

var express = require('express');
var router = express.Router();
const userMng = require('../app/logic/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('login');
});

router.get('/login', function(req, res, next) {
  res.render('login');
});

router.get('/register', function(req, res, next) {
  res.render('register');
});

router.get('/logout', function(req, res, next) {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

router.post('/DoLogin', function(req, res, next) {
  userMng.login(req.session, req.body.userCode, req.body.userPwd, function(err) {
    if (err) {
      res.status(500).send(err.message);
    }    
    else res.json('ok');
  });
});

router.post('/DoRegister', function(req, res, next) {
  userMng.register(req.session, req.body.userCode, req.body.userName, req.body.userPwd, req.body.actCode, function(err) {
    if (err)
      res.status(500).send(err.message);
    else res.json('ok');
  });
});

module.exports = router;
