var express = require("express");
const oracledb = require('oracledb');
const dbConfig = require('./db_config.json');
var bodyParser = require('body-parser');

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

app.get("/insert_video", (req, res) =>{
  insert_video_instance.execute(req.query, oracledb, dbConfig, res);
})

app.get("/update_video", (req, res) => {
  update_video_instance.execute(req.query, oracledb, dbConfig, res);
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

app.get("/join", (req, res) => {
  join_instance.execute(req.query, oracledb, dbConfig, res);
})

app.get("/account_delete", (req, res) => {
  account_delete_instance.execute(req.query, oracledb, dbConfig, res);
})

app.get("/account_update", (req, res) => {
  account_update_instance.execute(req.query, oracledb, dbConfig, res);
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

app.get("/rate", (req, res) => {
  rate_instance.execute(req.query, oracledb, dbConfig, res);
})

app.listen(5000, "0.0.0.0", function(){
    console.log("server is running.. in 5000");
});

//media server
