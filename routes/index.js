'use strict';

const express = require('express');
const router = express.Router();
const dbContext = require('../app/db-context');
const userMng = require('../app/logic/user');
const importUtil = require('../app/import');

router.get('/', function(req, res, next) {
    userMng.login(req.session, 'vexy', '111111', function(err) {
      res.render('index', {
            showTitle: true,

            // Override `foo` helper only for this rendering.
            helpers: {
                foo: function () { return 'foo.'; }
            }
        });
    });
});

router.get('/import/:type', function(req, res, next) {
    switch (req.params.type) {
        case 'is': {
            importUtil.importIndividualSaving(() => {
                res.render('import');
            })
            break;
        }
        case 'ps': {
            importUtil.importPaySettle(() => {
                res.render('import');
            })
            break;
        }
        case 'us': {
            importUtil.importUnitSaving(() => {
                res.render('import');
            })
            break;
        }
    }
    
});


module.exports = router;
