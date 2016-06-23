'use strict';

const dbContext = require('../db-context');
const Promise = require('bluebird');

let userMng = {
    getCurrentUserID: function(session) {
      return session.uid;
    },
    
    getCurrentUserName: function(session) {
      return session.uname;
    },
    
    getUserRole: function(session) {
      
    },
    
    checkIsTeacher: function(session) {
      return session.purview.indexOf(1) === '1';
    },
  
    login: function(session, userCode, userPwd, callback) {
      dbContext.FatUser.findAll({
        where: { UserCode: userCode, Password: userPwd }
      }).then(function(rows) {
        if (rows.length == 0) {
          callback('用户名或者密码错误');
        }
        let user = rows[0];
        session.uid = user.Row_ID;
        session.uname = user.UserName;
        session.purview = (user.IsAdmin ? '1' : '0') +  (user.IsTeacher ? '1' : '0') +  (user.IsStudent ? '1' : '0');
        callback(null);
      })
    },

    register: function(session, userCode, userName, userPwd, actCode, callback) {
      let actCodeObj = null;
      let userObj = null;
      dbContext.Container.transaction(function (t) {
        return dbContext.ActivationCode.findAll({
          where: { ActivateCode: actCode, CurrStatus: 0 },
          transaction: t
        }).then(function(row) {
          if (row.length == 0) {
            throw new Error('该激活码无效或已被使用');
          }
          else {
             actCodeObj = row[0];
             return dbContext.FatUser.findAll({
                where: { UserCode: userCode },
                transaction: t
             })
          }
        }).then(function(row) {
          if (row.length > 0) {
            throw new Error('该用户名已存在');
          }
          else {                            
              return dbContext.FatUser.create({
                IsAdmin: 0,
                IsStudent: actCode.substr(1, 1) == 0 ? 1 : 0,
                IsTeacher: actCode.substr(1, 1) == 1 ? 1 : 0,
                UserName: userName,
                UserCode: userCode,
                CurrStatus: 1,
                CreatedDate: new Date(),
                Password: userPwd,
                School: ''            
              }, {transaction: t})
          }
        }).then(function(row) {
          userObj = row;
          return actCodeObj.update({
            CurrStatus: 11
          }, {transaction: t})
        });
      }).then(function (result) {
        session.uid = userObj.Row_ID;
        session.uname = userName;
        session.purview = (userObj.IsAdmin ? '1' : '0') +  (userObj.IsTeacher ? '1' : '0') +  (userObj.IsStudent ? '1' : '0');
        callback(null);
      }).catch(function (err) {
        callback(err);
      });      
    }
}

module.exports = userMng;