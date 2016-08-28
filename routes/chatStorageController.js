'use strict';

var chatStorageModel = require('../model/chatStorage');

var chatInfo = {


  validateExistenceOfEmail : function(req, res, next){


    // if (!req.query.email){
    //   var err = new Error('no email_id sent');
    //   err.status=400;
    //   return next(err);
    // }

    // console.log(req.session.test);
    
    // var email = req.query.email;
    var data ={
      email : email
    }
    chatStorageModel.savePersonalChatUser(data, function(err, result) {

    if (err) {
      return next(err);
    }
    req.session.test=result;
    console.log('test is created in session');
    console.log(req.sessionID,'session value at exit email',req.session);
    res.json(result);

  });
  },

  fetchPersonalChat : function(req, res, next){


    if (!req.query.user_id){
      var err = new Error('no user_id sent');
      err.status=400;
      return next(err);
    }
    if (!req.query.friend_id){
      var err = new Error('no friend_id sent');
      err.status=400;
      return next(err);
    }
    var user_id = req.query.user_id;
    var friend_id = req.query.friend_id;
    var data ={
      user_id : user_id,
      friend_id : friend_id
    }

    
    chatStorageModel.fetchPersonalChat(data, function(err, result) {

    if (err) {
      return next(err);
    }
    
    res.json(result);

  });
  }

}

module.exports = chatInfo;