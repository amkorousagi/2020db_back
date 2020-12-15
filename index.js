var express = require("express");
const oracledb = require('oracledb');
const dbConfig = require('./db_config.json');
var bodyParser = require('body-parser');
var Asynclock = require('async-lock');

var test = require("./test");
var rating = require("./rating");
var average_rating = require("./average_rating");
var insert_video = require("./insert_video");
var update_video = require("./update_video");
var all_movie = require("./all_movie");
var all_episode = require("./all_episode");
var all_knuoriginal = require("./all_knuoriginal");
var login = require("./login");
var join = require("./join");
var account_delete = require("./account_delete");
var account_update = require("./account_update");
var view_all_movie = require("./all_movie");
var view_all_episode = require("./all_episode");
var view_all_knu_original = require("./all_knuoriginal");
var search_result = require("./search_result");
var best = require("./recommend");
var rate = require("./rate");
var cors = require("cors");
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));
app.use(cors());

const rating_instance = new rating();
const average_rating_instance = new average_rating();
const insert_video_instance = new insert_video();
const update_video_instance = new update_video();
const all_movie_instance = new all_movie();
const all_episode_instance = new all_episode();
const all_knuoriginal_instance = new all_knuoriginal();
const login_instance = new login();
const join_instance = new join();
const account_delete_instance = new account_delete();
const account_update_instance = new account_update();
const view_all_movie_instance = new view_all_movie();
const view_all_episode_instance = new view_all_episode();
const view_all_knu_original_instance = new view_all_knu_original();
const search_result_instance = new search_result();
const best_instance = new best();
const rate_instance = new rate();
oracledb.autoCommit = true;
/*
    //
    // Insert three rows
    //

    sql = `INSERT INTO no_example VALUES (:1, :2)`;

    binds = [
      [101, "Alpha" ],
      [102, "Beta" ],
      [103, "Gamma" ]
    ];

    // For a complete list of options see the documentation.
    options = {
      autoCommit: true,
      // batchErrors: true,  // continue processing even if there are data errors
      bindDefs: [
        { type: oracledb.NUMBER },
        { type: oracledb.STRING, maxSize: 20 }
      ]
    };

    result = await connection.executeMany(sql, binds, options);

    console.log("Number of rows inserted:", result.rowsAffected);
*/
async function intervalFunc() {
  try {
    let sql, binds, options, result, connection, result2;

    connection = await oracledb.getConnection(dbConfig);

    sql =`select rate.video_id, avg(score) as avg_score from rate, rating where rate.rating_id = rating.rating_id  group by video_id`;

    binds = [];

    options = {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    };

    result = await connection.execute(sql, binds, options);
    for(i=0; i<result.rows.length; i++){
      sql =
      `update video
      set mean_rating = ${result.rows[i].AVG_SCORE}
      where video_id = ${result.rows[i].VIDEO_ID}
      `;
      result2 = await connection.execute(sql, binds, options);
    }

  } catch(err) {
    console.log(err.toString())
  }
}

setInterval(intervalFunc, 60000);

app.get("/search_id", async (req,res)=>{
  let sql, binds, options, result, connection;

  connection = await oracledb.getConnection(dbConfig);

  sql = `select * from video where video_name = '${req.query.video_name}'`;//`SELECT (1+1) AS result from employee`;
  binds = [];

  // For a complete list of options see the documentation.
  options = {
    //outFormat: oracledb.OUT_FORMAT_OBJECT,   // query result format
    // extendedMetaData: true,               // get extra metadata
    // prefetchRows:     100,                // internal buffer allocation size for tuning
    // fetchArraySize:   100                 // internal buffer allocation size for tuning
  };

  result = await connection.execute(sql, binds, options);

  console.log("Metadata: ");
  console.dir(result.metaData, { depth: null });
  console.log("Query results: ");
  console.dir(result.rows, { depth: null });
   //test_instance.execute(pool, res);

   res.json(result.rows[0]);
});


app.get("/", async (req,res)=>{
  let sql, binds, options, result, connection;

  connection = await oracledb.getConnection(dbConfig);

  sql = `insert into actor(actor_name, description) values (:1, :2)`//`SELECT (1+1) AS result from employee`;

  binds = ["psc","jocker"];

  // For a complete list of options see the documentation.
  options = {
    //outFormat: oracledb.OUT_FORMAT_OBJECT,   // query result format
    // extendedMetaData: true,               // get extra metadata
    // prefetchRows:     100,                // internal buffer allocation size for tuning
    // fetchArraySize:   100                 // internal buffer allocation size for tuning
  };

  result = await connection.execute(sql, binds, options);

  console.log("Metadata: ");
  console.dir(result.metaData, { depth: null });
  console.log("Query results: ");
  console.dir(result.rows, { depth: null });
   //test_instance.execute(pool, res);

   res.json(result);
});

app.get("/test", (req, res)=>{
  res.json(["hi","hello"]);
});

app.get("/rating", (req, res)=>{
  rating_instance.execute(req.query.account_id, oracledb, dbConfig, res);
});

app.get("/average_rating", (req, res)=>{
  average_rating_instance.execute(req.query.video_id, oracledb, dbConfig, res);
});

var lock_insert_video = new Asynclock();
var key_insert_video = "key";
function operation_insert_video(arg_list){
  lock_insert_video.acquire(key_insert_video, function(){
    setTimeout(function(){
      insert_video_instance.execute(arg_list.req.query, oracledb, dbConfig, arg_list.res);
    },3000)
  }, function(err, ret){
  }, {});
}

app.get("/insert_video", (req, res) =>{
  operation_insert_video({req:req, res:res});
  //insert_video_instance.execute(req.query, oracledb, dbConfig, res);
})

var lock_update_video = new Asynclock();
var key_update_video = "key";
function operation_update_video(arg_list){
  lock_insert_video.acquire(key_update_video, function(){
    setTimeout(function(){
      update_video_instance.execute(arg_list.req.query, oracledb, dbConfig, arg_list.res);
    },3000)
  }, function(err, ret){
  }, {});
}
app.get("/update_video", (req, res) => {
  operation_update_video({req:req, res:res});
})

app.get("/all_movie", (req, res) => {
  all_movie_instance.execute(req.query, oracledb, dbConfig, res);
})

app.get("/all_episode", (req, res) => {
  all_episode_instance.execute(req.query, oracledb, dbConfig, res);
})

app.get("/all_knuoriginal", (req, res) => {
  all_knuoriginal_instance.execute(req.query, oracledb, dbConfig, res);
})

app.get("/login", (req, res) => {
  login_instance.execute(req.query, oracledb, dbConfig, res);
})

var lock_join = new Asynclock();
var key_join = "key";
function operation_join(arg_list){
  lock_join.acquire(key_join, function(){
    setTimeout(function(){
      join_instance.execute(arg_list.req.query, oracledb, dbConfig, arg_list.res);
    },3000)
  }, function(err, ret){
  }, {});
}
app.get("/join", (req, res) => {
  operation_join({req:req,res:res});
})

var lock_account_delete = new Asynclock();
var key_account_delete = "key";
function operation_account_delete(arg_list){
  lock_account_delete.acquire(key_account_delete, function(){
    setTimeout(function(){
      account_delete_instance.execute(arg_list.req.query, oracledb, dbConfig, arg_list.res);
    },3000)
  }, function(err, ret){
  }, {});
}
app.get("/account_delete", (req, res) => {
  operation_account_delete({req:req,res:res});
})

var lock_account_update = new Asynclock();
var key_account_update = "key";
function operation_account_update(arg_list){
  lock_account_update.acquire(key_account_update, function(){
    setTimeout(function(){
      account_update_instance.execute(arg_list.req.query, oracledb, dbConfig, arg_list.res);
    },3000)
  }, function(err, ret){
  }, {});
}
app.get("/account_update", (req, res) => {
  operation_account_update({req:req,res:res});
})

app.get("/view_all_movie", (req, res) => {
  view_all_movie_instance.execute(req.query, oracledb, dbConfig, res);
})

app.get("/view_all_episode", (req, res) => {
  view_all_episode_instance.execute(req.query, oracledb, dbConfig, res);
})

app.get("/view_all_knu_original", (req, res) => {
  view_all_knu_original_instance.execute(req.query, oracledb, dbConfig, res);
})

app.get("/search_result", (req, res) => {
  search_result_instance.execute(req.query, oracledb, dbConfig, res);
})

app.get("/best", (req, res) => {
  best_instance.execute(req.query, oracledb, dbConfig, res);
})

var lock_rate = new Asynclock();
var key_rate = "key";
function operation_rate(arg_list){
  lock_rate.acquire(key_rate, function(){
    setTimeout(function(){
      rate_instance.execute(arg_list.req.query, oracledb, dbConfig, arg_list.res);
    },3000)
  }, function(err, ret){
  }, {});
}
app.get("/rate", (req, res) => {
  operation_rate({req:req,res:res});
})

app.listen(5000, "0.0.0.0", function(){
    console.log("server is running.. in 5000");
});

//media server
