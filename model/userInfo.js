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

 },



    // {
    //   sql: 'INSERT INTO `myfantasy`.`GroupUserDetails`(`grp_id`,`user_id`) VALUES (?,?);',
    //   values: ['grp_id', options.password],
    //   replacer : 'grp_id'
    // }


  createGroup: function(options, cb)
   {

    var userArray= options.userArray;

    for(i=0;i<userArray.length;i++){

    var arrObject ={};
    arrObject.sql='INSERT INTO `myfantasy`.`GroupUserDetails`(`grp_id`,`user_id`) VALUES (?,?);';
    arrObject.values=['grp_id',userArray[i]];
    arrObject.replacer='grp_id';
    
    arr.push(arrObject);
    arrObject={};
    }

    var arr = [ {
      sql: 'INSERT INTO `myfantasy`.`GroupBasicDetails`(`grp_name`,`grp_creator`,`grp_type`,`grp_admin`) VALUES (?,?,?,?)',
      values: [options.grp_name, options.user_id, options.grp_type, options.user_id]
    }
    ];
    mysql.transDynamicCallbackWay(arr, function(err, result) {
      cb(err, result);
    });
   }


};
module.exports = userInfo;


   


