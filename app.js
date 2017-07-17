
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

app.get('/mc_one', function(req, res) {
  res.sendFile(__dirname+'/views/mc_one.html');
});

app.get('/mc_two', function(req, res) {
  res.sendFile(__dirname+'/views/mc_two.html');
});

app.get('/user_test', function (req, res) {
  res.sendFile(__dirname+'/views/user_test.html');
});

app.get('/user_movements', function (req, res) {

  var when = req.query.when;
  var user = req.query.user;

  if (when == 'all') {
    query = 'SELECT * FROM `park-movement-Fri` WHERE client_id=\'' + user + '\' UNION SELECT * FROM `park-movement-Sat` WHERE client_id=\'' + user + '\' UNION SELECT * FROM `park-movement-Sun` WHERE client_id=\'' + user + '\'';
  }
  query += ';';
  var result = {};
  con.query(query, function (err, rows, fields) {
    result.num_rows = rows.length;
    result.rows = rows;
    res.send(JSON.stringify(result));
  });
});

app.get('/groups_movements', function (req, res) {
  //var start = req.query.start;
  //var limit = req.query.limit;
  var query = 'SELECT * FROM `park-movement-groups-fri` UNION SELECT * FROM `park-movement-groups-sat` UNION SELECT * FROM `park-movement-groups-sun` ORDER BY TIME(timestamp);';
  var result = {};
  con.query(query, function (err, rows, fields) {
    result.num_rows = rows.length;
    result.rows = rows;
    res.send(JSON.stringify(result));
  });
});
//'1508923','825466','970490','809736','2047880','124408','33707','543168','2037299','1405426','484248','1116329','143415','2010383','813540','1797310','1045021','1812811','382365','1858381'
//'1351786','1374645','524698','1292409','2082743','178059','1313620','1277912','1639323','1843430','410107','1680940','1045021','1985225','2023929','956264','1427875','1749109','662986','1758474'
//'620184','19249','170456','560023','111118','1952914','692899','195725','1168991','968489','1882328','1848459','1615853','910832','1191147','972532','376904','1356570','482603','866636'




app.get('/communications', function(req, res) {
  var queryFri = "SELECT * FROM `comm-data-Fri` WHERE `from` IN ('1508923','825466','970490','809736','2047880','124408','33707','543168','2037299','1405426','484248','1116329','143415','2010383','813540','1797310','1045021','1812811','382365','1858381')";
  var querySat = "SELECT * FROM `comm-data-Sat` WHERE `from` IN ('1351786','1374645','524698','1292409','2082743','178059','1313620','1277912','1639323','1843430','410107','1680940','1045021','1985225','2023929','956264','1427875','1749109','662986','1758474')";
  var querySun = "SELECT * FROM `comm-data-Sun` WHERE `from` IN ('620184','19249','170456','560023','111118','1952914','692899','195725','1168991','968489','1882328','1848459','1615853','910832','1191147','972532','376904','1356570','482603','866636')";

  var query = queryFri + ' UNION ' + querySat + ' UNION ' + querySun + ';';
  var result = {};
  con.query(query, function (err, rows, fields) {
    result.num_rows = rows.length;
    result.rows = rows;
    res.send(JSON.stringify(result));
  });
});

app.listen(3000);
