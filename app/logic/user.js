'use strict';

const dbContext = require('../db-context');

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
      }).then(function(user) {
        if (user == null) {
          callback('用户名或者密码错误');
        }
        session.uid = user.Row_ID;
        session.uname = user.UserName;
        session.purview = (user.IsAdmin ? '1' : '0') +  (user.IsTeaching ? '1' : '0') +  (user.IsStudent ? '1' : '0');
        callback(null);
      })
    }
}

module.exports = userMng;