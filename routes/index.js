'use strict';

const express = require('express');
const router = express.Router();
const dbContext = require('../app/db-context');
const userMng = require('../app/logic/user');

router.get('/', function(req, res, next) {
    userMng.login(req.session, 'vexy', '111111', function(err) {
      res.render('index');
    });
});


module.exports = router;
