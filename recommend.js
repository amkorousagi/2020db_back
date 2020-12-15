class Recommend{

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

        sql = `select video_name, mean_rating, runtime from(select video_name, mean_rating, runtime from video where mean_rating is not null order by mean_rating desc) where rownum <= 10`;
        binds = [];
        result = await connection.execute(sql, binds, options);
        console.log(result.rows);

        res.json(result.rows);
      } catch(err) {
        console.log(err.toString())
        res.status(404).json(err.toString())
      }
  }

}

module.exports = Recommend;
