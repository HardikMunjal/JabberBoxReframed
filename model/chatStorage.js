var mysql = require('../config/mysql');

var chatStorageModel = {

 savePersonalChatUser: function(options, cb) {
 
      var query = {
            sql: 'INSERT INTO `myfantasy`.`PersonalChatRecord`(`from_user`,`to_user`,`message`) VALUES (?,?,?);',
            values:[options.from_user,options.to_user,options.message]
            }
            console.log(query.sql);
            console.log(query.values);
     mysql.simpletrans(query, function(e, r) {
        if (e) {
            console.log(e);
            cb(e);
        } else {
            console.log(r[0])
            cb(null,r);
        }
    });

 },

  fetchPersonalChat: function(options, cb) {
 
      var query = {
            sql: 'SELECT PersonalChatRecord.chat_id,PersonalChatRecord.from_user,u1.username as from_username,PersonalChatRecord.to_user,u2.username as to_username, PersonalChatRecord.message FROM PersonalChatRecord INNER JOIN UserBasicInfo u1 ON PersonalChatRecord.from_user=u1.user_id INNER JOIN UserBasicInfo u2 ON PersonalChatRecord.to_user=u2.user_id where (PersonalChatRecord.from_user=? and PersonalChatRecord.to_user =?) or (PersonalChatRecord.from_user=? and PersonalChatRecord.to_user =?) ORDER BY PersonalChatRecord.chat_id',
            values:[options.user_id,options.friend_id,options.friend_id,options.user_id]
            }
            console.log(query.sql);
            console.log(query.values);
     mysql.simpletrans(query, function(e, r) {
        if (e) {
            console.log(e);
            cb(e);
        } else {
            console.log(r[0])
            cb(null,r);
        }
    });

 }
};
module.exports = chatStorageModel;


   


