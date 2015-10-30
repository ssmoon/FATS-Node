const monent = require('moment');

module.exports = function(exphbs) {
  exphbs.create({
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
        formatMoney: function(money) {
          return money.toFixed(2);
        }
    }
});
}