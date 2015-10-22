const express = require('express');
const router = express.Router();
const dbContext = require('../app/dbContext.js');
const co = require('co');
const templateCache = require('../app/cache/TemplateCache');

/* GET home page. */
router.get('/', function(req, res, next) {
  var fn = co.wrap(function *() {
    return yield dbContext.fatUser.findAll();    
  });
  fn(true).then(function (users) { 
    res.render('index', { users: users });
  });
});

router.get('/cache', function(req, res, next) {
  res.send(templateCache.getTemplateRoutine(2));
});

router.get('/complex', function(req, res, next) {
  var data = {
    name: 'Gorilla23333',
    address: {
      streetName: 'Broadway',
      streetNumber: '721',
      floor: 5,
      addressType: {
        typeName: 'residential'
      }
    }
  };
  res.render('complex', data);
});


module.exports = router;
