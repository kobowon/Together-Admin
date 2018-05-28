var express = require('express');
var router = express.Router();
var mysql_dbc = require('../../db/db_con')();
var connectionPool = mysql_dbc.createPool();


router.post('/', function (request, response) {
    var queryStatement = '' +
        'insert into request_join (name, phone, title, address , startAt , endAt , contents , latitude , longitude) ' +
        'values (? , ? , ? , ? , ? , ? , ? , ? , ?)';
    var requestBody = request.body;
    var params = [requestBody.name, requestBody.phone , requestBody.title , requestBody.address , requestBody.startAt , requestBody.endAt , requestBody.contents , requestBody.latitude , requestBody.longitude];

    connectionPool.getConnection(function (err, connection) {
        // Use the connection

        connection.query(queryStatement, params, function (err, result) {
            // And done with the connection.
            connection.release();
            if (err) throw err;
            response.end();
        });
    });


});

router.get('/', function (request, response) {
    var queryStatement = 'select * from request_join';
    connectionPool.getConnection(function (err, connection) {
        // Use the connection
        connection.query(queryStatement,  function (err, result) {
            // And done with the connection.
            connection.release();
            if (err) throw err;
            else {
                response.send(JSON.stringify(result));
            }
        });
    });
});

/*트렌젝션 예시 
* connection.beginTransaction(function(err) {
  var post  = { m_tel: '010-1234-5678', m_id: 'GilDong2', m_pass: 'password1', m_name: '이순신',
                m_date: '2000-01-01', m_gender: '남', m_email: 'GilDong@Hong.com' };

  if (err) { throw err; }
  connection.query('INSERT INTO member SET ?', post, function(err, result) {
    console.log(result);
    if (err) {
      connection.rollback(function() {
        console.log("1.error");
        throw err;
      });
    }

    //실행된 결과가 0일경우
    connection.query('update member set m_gender = ? where m_name = ?', ['여','강감찬'], function(err, result) {
      console.log(result);
      if (!result.affectedRows) {
        connection.rollback(function() {
          console.log("2.error");
        });
      }
      connection.commit(function(err) {
        if (err) {
          connection.rollback(function() {
            throw err;
          });
        }
        console.log('success!');
      });
    });
  });
});
* */

module.exports = router;
