'use strict';

const monent = require('moment');
const V_BusinessProxy = require('./viewModels/V_BusinessProxy');
const _ = require('lodash');

function map(source, destination) {
    var sourceObj, desObj;
    var desKeys = _.keys(destination), functions;
    _.extend(destination, _.pick(source, desKeys));
    sourceObj = source;
    desObj = destination;

    functions = {
        forMember: function(sourceKey, desKey) {
            var keys = sourceKey.split('.'), sourceValue = sourceObj, index = 0;

            // incase sourceKey is a nested object like objectA.Value
            if (keys.length) {
                while (index < keys.length) {
                    sourceValue = sourceValue[keys[index]];
                    index++;
                }
                desObj[desKey] = sourceValue;
            }
            else {
                desObj[desKey] = sourceObj[sourceKey];
            }

            return functions;
        }
    };
    return functions;
}

module.exports = function (exphbs) {
  return  exphbs.create({
    extname:'hbs', 
    defaultLayout:'_layout.hbs',
    // Specify helpers which are only registered on this instance.
    helpers: {
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
      formatMoney: function (money) {
        return money.toFixed(2);
      },
      log: function (msg) {
          console.log('----hbs engine-----' + msg);
      },
      inverse: function(val) {
          return !val;
      },
      bankDraftConverter: function(bankDraft, stepIdx) {
          switch (stepIdx) {
              case 2: {             
                  let target = new V_BusinessProxy();     
                  map(bankDraft[0], target)
                        .forMember('RemitterBank', 'BankName')
                        .forMember('IncomeBillDate', 'ProxyDate');
                  return target;
              }
          }
      }
    }
  });  
}
