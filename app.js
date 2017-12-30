var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var mysql=require('mysql');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose=require('mongoose');
var index = require('./routes/index');
var name;
var sqlSelect;
var sqlDelete;
var sqlInsert;
var sqlUpdate;
// DB connection
var config=require('./config');
var con =mysql.createConnection({
  host:"localhost",
  user:"root",
  password:"",
  database:"riktam"

});
con.connect(function(err){
  if (err) throw err;
  console.log("connected");
});

var app = express();
var urlencodedParser = bodyParser.urlencoded({extended: false});
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'jade');
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/start',function(req,res){
	res.render('start.html');
});

app.get('/getlist',function(req,res){
  con.query("SELECT * FROM table1",function(err,result){
	   if(err) throw err;
     console.log(result);
	   res.send(JSON.stringify(result));
   });
});

app.post('/registerstudent',function(req,res){
  name = {name: req.body.name};
  console.log(req.body.name);
  sqlSelect = 'SELECT name FROM table1 WHERE ?';
  con.query(sqlSelect,name,function(err,result){
    if(err) throw err;
    if(result.length < 1 ) {
      let data = {
        name: req.body.name,
        section: req.body.section,
        email: req.body.email,
        phone: req.body.phone
      };
    sqlInsert = 'INSERT INTO table1 SET ?';
    con.query(sqlInsert,data,function(err,result1){
        if(err) throw err;
        res.send('Registration successful !');
    });
    }
    else{
        res.send('User already Exists !');
    }
  });
});

app.post('/editstudent',function(req,res){
  console.log(req.body.title);
  name = {name: req.body.title};
  sqlSelect = 'SELECT * FROM table1 WHERE ?';
  //let val=req.body.val;
  con.query(sqlSelect,name,function(err,result){
    if(err) throw err;
    console.log(JSON.stringify(result));
    res.send(JSON.stringify(result));
  });
});

app.post('/updatestudent',urlencodedParser, function(req,res){
  console.log(req.body.name);
 	let data = [
    {
      section: req.body.section,
      email: req.body.email,
      phone: req.body.phone
    },
    {name: req.body.name}
  ];
  sqlUpdate = "UPDATE table1 SET ? WHERE ?";
  con.query(sqlUpdate,data,function(err,result){
  	if(err)throw err;
    res.send("updated successfully !")
  });
});

app.post('/deletestudent',function(req,res){
  name = {name: req.body.title};
  sqlDelete = 'DELETE FROM table1 WHERE ?';
  con.query(sqlDelete,name,function(err,result){
  	if(err) throw err;
    res.send("Record deleted !")
  });
});
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
