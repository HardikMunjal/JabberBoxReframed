var mysql = require('../config/mysql');

var userInfo = {

 getSingleUserDetails: function(options, cb) {
 
      var query = {
            sql: 'SELECT u1.user_id,GroupBasicDetails.grp_id,GroupBasicDetails.grp_name,u1.username as username,u1.email_id, u1.mobile_no,u1.profile_pic FROM GroupUserDetails INNER JOIN UserBasicInfo u1 ON GroupUserDetails.user_id=u1.user_id INNER JOIN GroupBasicDetails ON GroupUserDetails.grp_id=GroupBasicDetails.grp_id WHERE u1.username=?',
            values:[options.username]
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



getAllFriendsDetails: function(options, cb) {
 
      var query = {
            sql: 'SELECT u.user_id,u.username,u.email_id,u.mobile_no FROM myfantasy.UserBasicInfo u where u.username !=?;',
            values:[options.username]
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
module.exports = userInfo;


   


