
var express = require('express');
var mysql = require('mysql');
var app = express();
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "f",
  database : 'progetto_va',
  dateStrings : true
});
con.connect();

var timestampRows = -1;

app.use(express.static('public'));

app.get('/', function (req, res) {
  res.sendFile(__dirname+'/views/index.html');
});

app.get('/user_test', function (req, res) {
  res.sendFile(__dirname+'/views/user_test.html');
});

app.get('/user_movements', function (req, res) {

  var when = req.query.when;
  var user = req.query.user;
  var table = '';

  switch (when) {
    case 'fri':
      table = 'park-movement-Fri';
      break;
    case 'sat':
      table = 'park-movement-Sat';
      break;
    case 'sun':
      table = 'park-movement-Sun';
      break;
  }

  var query = 'SELECT * FROM `' + table + '` WHERE client_id=\'' + user + '\';';
  var result = {};
  con.query(query, function (err, rows, fields) {
    result.num_rows = rows.length;
    result.rows = rows;
    res.send(JSON.stringify(result));
  });
});

app.get('/groups_movements', function (req, res) {
  var start = req.query.start;
  var limit = req.query.limit;
  var query = 'SELECT * FROM `park-movement-groups-fri` UNION SELECT * FROM `park-movement-groups-sat` UNION SELECT * FROM `park-movement-groups-sun` ORDER BY TIME(timestamp);';
  var result = {};
  con.query(query, function (err, rows, fields) {
    result.num_rows = rows.length;
    result.rows = rows;
    res.send(JSON.stringify(result));
  });
});

app.listen(3000);
