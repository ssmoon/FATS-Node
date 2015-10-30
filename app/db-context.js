'use strict';

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
  Container: sequelize,
  FatUser: sequelize.import('./models/FATUser'),
  FATUserGroup: sequelize.import('./models/FATUserGroup'),
  activationCode: sequelize.import('./models/ActivationCode'),
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
  IndividualSaving: sequelize.import('./models/IndividualSaving'),
  MoneyRemittance: sequelize.import('./models/MoneyRemittance'),
  
  GeneralLedger: sequelize.import('./models/GeneralLedger'),  
  OuterSubject: sequelize.import('./models/OuterSubject'),
  SubjectItem: sequelize.import('./models/SubjectItem'),
  CashJournal: sequelize.import('./models/CashJournal'),
  CustomerLedger: sequelize.import('./models/CustomerLedger'),
  DetailedLedger: sequelize.import('./models/DetailedLedger')  
};