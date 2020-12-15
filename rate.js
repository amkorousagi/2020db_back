
class Rate_commit{

  execute = async (dict, oracledb, dbConfig, res) =>{
      try {
        let sql, binds, options, result, connection;

        connection = await oracledb.getConnection(dbConfig);
        options = {
          outFormat: oracledb.OUT_FORMAT_OBJECT,   // query result format
          // extendedMetaData: true,               // get extra metadata
          // prefetchRows:     100,                // internal buffer allocation size for tuning
          // fetchArraySize:   100                 // internal buffer allocation size for tuning
        };

        sql = `select count(*) as id from v_write`;
        binds = [];
        result = await connection.execute(sql, binds, options);
        console.log(result.rows[0]);

        var rating_id = result.rows[0]["ID"] + 1; //object type??? how?? rating count + 1

        console.log(dict.video_name);
        sql = `select video_id from video where video_name = '${dict.video_name}'`;
        binds = [];
        result = await connection.execute(sql, binds, options);
        console.log(result.rows[0]);

        var video_id = result.rows[0]["video_id"]; //how?? video id


        sql = `insert into rating(description, score, rating_id) values ('${dict.desc}', :score, :rating_id)`;
        binds = [dict.score, rating_id];
        result = await connection.execute(sql, binds, options);
        console.log(result);

        sql = `insert into v_write(rating_id, account_id) values (:rating_id, :account_id)`;
        binds = [rating_id, dict.account_id];
        result = await connection.execute(sql, binds, options);
        console.log(result);

        sql = `insert into rate(video_id, rating_id) values (:video_id, :rating_id)`;
        binds = [video_id, rating_id];
        result = await connection.execute(sql, binds, options);
        console.log(result);

        res.json(result);
      } catch(err) {
        console.log(err.toString())
        res.status(404).json(err.toString())
      }
  }

}

module.exports = Rate_commit;
