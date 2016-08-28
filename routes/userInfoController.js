'use strict';

var userInfoModel = require('../model/userInfo');

var userInfo = {


  getSingleUserDetails : function(req, res, next){


    if (!req.query.username){
      var err = new Error('no username sent');
      err.status=400;
      return next(err);
    }
    
    var username = req.query.username;
    var data ={
      username : username
    }

    
    userInfoModel.getSingleUserDetails(data, function(err, result) {

    if (err) {
      return next(err);
    }
    
   
    var userSubscribedGroupsArray =[]
    var userSubscribedGroupsObject ={}

    for(var i=0;i<result.length;i++){
      userSubscribedGroupsObject.grp_id=result[i].grp_id;
      userSubscribedGroupsObject.grp_name=result[i].grp_name;
      userSubscribedGroupsArray.push(userSubscribedGroupsObject);
      console.log(userSubscribedGroupsObject);
      userSubscribedGroupsObject={}
    }
    var requiredResult=result[0];
    delete requiredResult.grp_id;
    delete requiredResult.grp_name;
    
    requiredResult.groups=userSubscribedGroupsArray;
    res.json(requiredResult);

  });
  },

  getAllFriendsDetails : function(req, res, next){


    if (!req.query.username){
      var err = new Error('no username sent');
      err.status=400;
      return next(err);
    }
    
    var username = req.query.username;
    var data ={
      username : username
    }

    
    userInfoModel.getAllFriendsDetails(data, function(err, result) {

    if (err) {
      return next(err);
    }
    
    res.json(result);

  });
  }

}

module.exports = userInfo;