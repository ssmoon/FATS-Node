'use strict';

const monent = require('moment');
const _ = require('lodash');

const bankAcceptBillConverter = require('./converters/bankAcceptBillConverter');
const bankDraftConverter = require('./converters/bankDraftConverter');
const collectAcceptConverter = require('./converters/collectAcceptConverter');
const debitTransferCheckConverter = require('./converters/debitTransferCheckConverter');
const entrustBankPaymentConverter = require('./converters/entrustBankPaymentConverter');
const entrustCorpPaymentConverter = require('./converters/entrustCorpPaymentConverter');
const individualDepositConverter = require('./converters/individualDepositConverter');
const individualWithdrawConverter = require('./converters/individualWithdrawConverter');
const interestVoucherConverter = require('./converters/interestVoucherConverter');
const moneyRemittanceConverter = require('./converters/moneyRemittanceConverter');
const unitSavingConverter = require('./converters/unitSavingConverter');
const loanConverter = require('./converters/loanConverter');
const discountingConverter = require('./converters/discountingConverter');

module.exports = function (exphbs) {
  return  exphbs.create({
    extname:'hbs',
    defaultLayout:'_layout.hbs',
    // Specify helpers which are only registered on this instance.
    helpers: {
        ifCond1: function(v1, v2, options) {
            if(v1 === v2) {
                return options.fn(this);
            }
            return options.inverse(this);
        },
        ifCond: function (v1, operator, v2, options) {
            switch (operator) {
                case '==':
                    return (v1 == v2) ? options.fn(this) : options.inverse(this);
                case '===':
                    return (v1 === v2) ? options.fn(this) : options.inverse(this);
                case '<':
                    return (v1 < v2) ? options.fn(this) : options.inverse(this);
                case '<=':
                    return (v1 <= v2) ? options.fn(this) : options.inverse(this);
                case '>':
                    return (v1 > v2) ? options.fn(this) : options.inverse(this);
                case '>=':
                    return (v1 >= v2) ? options.fn(this) : options.inverse(this);
                case '&&':
                    return (v1 && v2) ? options.fn(this) : options.inverse(this);
                case '||':
                    return (v1 || v2) ? options.fn(this) : options.inverse(this);
                default:
                    return options.inverse(this);
            }
      },
      formatDate1: function (date) {
        let day = monent(date);
        return day.format('YYYY-MM-DD');
      },
      formatDate2: function (date) {
        let day = monent(date);
        return day.format('MM-DD');
      },
      formatDate3: function (date) {
        let day = monent(date);
        return day.format('YYYY年MM月DD日');
      },
      getDay: function (date) {
        let day = monent(date);
        return day.date();
      },
      getMonth: function (date) {
        let day = monent(date);
        return day.month() + 1;
      },
      getYear: function (date) {
        let day = monent(date);
        return day.year();
      },
      formatMoney: function (money) {
        return money.toFixed(2);
      },
      getBalanceOrient: function (orient) {
        if ((orient === 1) || (orient === '借') || (orient === '借方'))
            return '借';
        else return '贷'; 
      },
      log: function (msg) {
          console.log('-------hbs engine log--------' + msg);
      },
      inverse: function(val) {
          return !val;
      },
      inc: function(val, incCount) {
          return val + incCount;
      },
      switch: function(value, options) {
          this._switch_value_ = value;
            var html = options.fn(this); // Process the body of the switch block
            delete this._switch_value_;
            return html;
      },
      case: function(value, options) {
        if (value == this._switch_value_) {
            return options.fn(this);
        }
      },
      bankDraftConverter: function(items, stepIdx) {
          return bankDraftConverter(items, stepIdx)
      },
      bankAcceptBillConverter: function(items, stepIdx) {
          return bankAcceptBillConverter(items, stepIdx)
      },
      collectAcceptConverter: function(items, stepIdx) {
          return collectAcceptConverter(items, stepIdx)
      },
      debitTransferCheckConverter: function(items, stepIdx) {
          return debitTransferCheckConverter(items, stepIdx)
      },
      entrustBankPaymentConverter: function(items, stepIdx) {
          return entrustBankPaymentConverter(items, stepIdx)
      },
      entrustCorpPaymentConverter: function(items, stepIdx) {
          return entrustCorpPaymentConverter(items, stepIdx)
      },
      individualDepositConverter: function(items, routineTag) {
          return individualDepositConverter(items, routineTag)
      },
      individualWithdrawConverter: function(items, routineTag) {
          return individualWithdrawConverter(items, routineTag)
      },
      interestVoucherConverter: function(items, routineTag) {
          return interestVoucherConverter(items, routineTag)
      },
      moneyRemittanceConverter: function(items, stepIdx) {
          return moneyRemittanceConverter(items, stepIdx)
      },
      unitSavingConverter: function(items, routineTag, subStep) {
          return unitSavingConverter(items, routineTag, subStep)
      },
      discountingConverter: function(items, stepIdx) {
          return discountingConverter(items, stepIdx)
      },
      loanConverter: function(items, routineTag, subStep, srcType) {
          return loanConverter(items, routineTag, subStep, srcType)
      }
    }
  });
}
