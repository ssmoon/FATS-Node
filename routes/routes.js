'use strict';

module.exports = function(app) {
  app.use('/', require('./index'));
  app.use('/User', require('./users'));
  app.use('/Teaching/Navigator', require('./teaching/navigator'));
  app.use('/Teaching/Specialnode', require('./teaching/specialnode'));
  app.use('/Teaching/Registerbook', require('./teaching/registerbook'));
  app.use('/Teaching/Commonnode', require('./teaching/commonnode'));
}