'use strict';

const Sequelize = require('sequelize');
const nconf = require('nconf');

nconf.argv().file({ file: 'config/config.json' });
const sequelize = new Sequelize(nconf.get('mysql:db'), nconf.get('mysql:uid'), nconf.get('mysql:pwd'), {
  host: nconf.get('mysql:host'),
  dialect: 'mysql',
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  },
  define: {   
    charset: 'utf8',
    collate: 'utf8_general_ci'
  }
});

//sequelize.sync();

module.exports = {
  Container: sequelize,
  FatUser: sequelize.import('./models/FATUser'),
  FATUserGroup: sequelize.import('./models/FATUserGroup'),
  ActivationCode: sequelize.import('./models/ActivationCode'),
  TemplateRoutine: sequelize.import('./models/TemplateRoutine'),
  TemplateNode: sequelize.import('./models/TemplateNode'),
  StudentActivity: sequelize.import('./models/StudentActivity'),
  
  RoutineGroup: sequelize.import('./models/RoutineGroup'),    
  TeachingNode: sequelize.import('./models/TeachingNode'),
  TeachingRoutine: sequelize.import('./models/TeachingRoutine'),
  
  BankAcceptBill: sequelize.import('./models/BankAcceptBill'),
  BankDraft: sequelize.import('./models/BankDraft'),
  CollectAccept: sequelize.import('./models/CollectAccept'),  
  EntrustBankPayment: sequelize.import('./models/EntrustBankPayment'),
  EntrustCorpPayment: sequelize.import('./models/EntrustCorpPayment'),
  TransferCheck: sequelize.import('./models/TransferCheck'),  
  MoneyRemittance: sequelize.import('./models/MoneyRemittance'),
  
  IndividualSaving: sequelize.import('./models/IndividualSaving'),
  UnitSaving: sequelize.import('./models/UnitSaving'),
  
  Loan: sequelize.import('./models/Loan'),
  Discounting: sequelize.import('./models/Discounting'), 
  
  
  GeneralLedger: sequelize.import('./models/GeneralLedger'),  
  OuterSubject: sequelize.import('./models/OuterSubject'),
  SubjectItem: sequelize.import('./models/SubjectItem'),
  CashJournal: sequelize.import('./models/CashJournal'),
  CustomerLedger: sequelize.import('./models/CustomerLedger'),
  DetailedLedger: sequelize.import('./models/DetailedLedger')  
};