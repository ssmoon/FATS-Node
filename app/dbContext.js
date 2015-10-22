const Sequelize = require('sequelize');

const sequelize = new Sequelize('FATS', 'root', 'root', {
  host: '192.168.1.181',
  dialect: 'mysql',
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  }
});

module.exports = {
  container: sequelize,
  fatUser: sequelize.import('./models/FATUser'),
  templateRoutine: sequelize.import('./models/TemplateRoutine'),
  templateNode: sequelize.import('./models/TemplateNode')
};