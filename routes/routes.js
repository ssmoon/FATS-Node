'use strict';

module.exports = function(app) {
  app.use('/', require('./index'));
  app.use('/user', require('./users'));
  app.use('/teaching/navigator', require('./teaching/navigator'));
  app.use('/teaching/specialnode', require('./teaching/specialnode'));
  app.use('/teaching/registerbook', require('./teaching/registerbook'));
  app.use('/teaching/commonnode', require('./teaching/commonnode'));
}