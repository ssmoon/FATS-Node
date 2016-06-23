'use strict';

const _ = require('lodash');

module.exports = {
    wrapClientGridData: function(dataList) {
        let wrapper = {};
        wrapper.sEcho = 1;
        wrapper.iTotalRecords = dataList.length;
        wrapper.aaData = dataList;
        wrapper.iTotalDisplayRecords = dataList.length;
        return wrapper;
    }
}