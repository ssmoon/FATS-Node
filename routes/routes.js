'use strict';

module.exports = function(app) {
  app.use('/', require('./index'));
  app.use('/User', require('./users'));
  app.use('/Teaching/Navigator', require('./teaching/navigator'));
  app.use('/Teaching/SpecialNode', require('./teaching/specialnode'));
  app.use('/Teaching/RegisterBook', require('./teaching/registerbook'));
  app.use('/Teaching/CommonNode', require('./teaching/commonnode'));
}