var mysql = require('mysql');

//*************Currently not in use*********************
var connection = mysql.createConnection({
  connectionLimit: 10,
    host: 'localhost',
            user: 'root',
            password : 'root',
            port : 3306, //port mysql
            database:'myfantasy'
});

console.log('coming here');

connection.on('error', function(err) {
  console.log(err);
  //console.log(connection);
  connection.destroy();
  //console.log(connection);
});

module.exports = {
  simpletrans: function(query, fn) {
    connection.query(query, fn);
  },
  trans: function(queries, useResult, repValue, fn) {
    if(!useResult && !repValue) {
      useResult = repValue = null;
    }

    connection.beginTransaction(function(err) {
      var step = function(x) {
        if(x < queries.length) {
          connection.query(queries[x], function(err, result) {
            if(err) {
              console.log(err);
              connection.rollback(function() {
              });
              return fn(err, null);
            } else {
              if(useResult && repValue && useResult.length === repValue.length) {
                if(useResult[x]) {
                  for(var index = x + 1; index < queries.length; index++) {
                    if(queries[index].values && repValue[x]) {
                      var value = queries[index].values;
                      var tempindex = value.indexOf(repValue[x]);
                      if(tempindex > -1) {
                        value[tempindex] = result.insertId;
                        queries[index].values = value;
                      }
                    }
                  }
                  step(x + 1);
                } else {
                  step(x + 1);
                }
              } else {
                step(x + 1);
              }
            }
          });
        } else {
          connection.commit(function(err) {
            if (err) { 
              connection.rollback(function() {
              });
              return fn(err,null);
            } else {
              console.log('success! TRANSACTION COMPLETED SUCCESSFULLY');
              return fn(err,'success');
            }
          });
        }
      }
      step(0);
    });
  },
  transCallbackWay : function(queries){
     
     connection.beginTransaction(function(err){
       if (err) { throw err; }

       connection.query(queries[0],function(err, result){
         if (err) { 
           connection.rollback(function() {
             throw err;
           });
         }
         var log = result.insertId;
         
         var position = queries[1].values.indexOf(queries[1].replacer);
         console.log(position);
         console.log(log);
         queries[1].values.splice(position, 1, log);
         console.log(queries[1].values);


         connection.query(queries[1].sql, queries[1].values, function(err, result) {
            if (err) { 
              connection.rollback(function() {
                throw err;
              });
            }  
         var position2 = queries[2].values.indexOf(queries[2].replacer);
         console.log(position2);
         console.log(log);
         queries[2].values.splice(position2, 1, log);

          connection.query(queries[2].sql, queries[2].values, function(err, result) {
            if (err) { 
              connection.rollback(function() {
                throw err;
              });
            }  


            connection.commit(function(err) {
              console.log('coming here bro');
              if (err) { 
                connection.rollback(function() {
                  throw err;
                });
              }
              console.log('Transaction Complete.');
              connection.end();
            });
          });
        });
      });
    });
  },

  transDynamicCallbackWay: function(queries, fn){

 
    var inc = 0;

//--------------------------------Start Of Transaction Scrript ----------------------------------------

    connection.beginTransaction(function(err){
         if (err) { throw err; }
         connection.query(queries[0],recursiveCallback)
      });
//--------------------------------End Of Transaction Scrript ------------------------------------------

    

    var recursiveCallback = function(err, result) {
      if (err) {
        return connection.rollback(function() {
          throw err;
        });
        return fn(err,null);
      }  

      if(inc==0){
        global.log = result.insertId;
      }

      if(inc<queries.length-1) {

        inc=inc+1;
        var position = queries[inc].values.indexOf(queries[inc].replacer);
        queries[inc].values.splice(position, 1, global.log);
        //----------------------------- recursive calling of connection.query ---------------------------
        connection.query(queries[inc].sql, queries[inc].values, recursiveCallback);
      } else {

         connection.commit(function(err) {
            if (err) {
               return connection.rollback(function() {
                  throw err;
                });
               return fn(err,null);
              }
            console.log('Transaction Complete.');
            return fn(err,'success');
            connection.end();
          });
        }   
      }
    }
  }

