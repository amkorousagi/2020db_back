class Update_video{

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
          sql =`SELECT permission FROM v_account WHERE account_id = :id`;
          binds = [dict.account_id];
          result = await connection.execute(sql, binds, options);

          if(result.rows[0]["PERMISSION"] == 'admin'){
            console.log("admin");
          }else{
            throw new Error("not allowed action");
          }
          dict.type = dict.video_type

          if(dict.type == "movie"){
            sql =`SELECT movie_id FROM refer_movie WHERE video_id = :id`;
            binds = [dict.video_id];
            result = await connection.execute(sql, binds, options);

            const movie_id = result.rows[0]["MOVIE_ID"];
            const video_id= dict.video_id;
//http://localhost:5000/insert_video?type=movie&video_name=myvideo&published_date=99/12/28&uploaded_date=99/12/28&runtime=30&description=hi

            const video_type = dict.type;
            const video_name =   dict.video_name;
            const published_date = dict.published_date;//(YY/MM/DD)
            const uploaded_date = dict.uploaded_date;
            const runtime = dict.runtime;
            const description = dict.description;

            sql = `
              update movie
              set description =' ${description}'
              where movie_id = :movie_id
            `;
            binds = [movie_id];
            result = await connection.execute(sql, binds, options);
            console.log(result);

            sql = `
              update video
              set video_name = '${video_name}',
              video_type = :video_type,
              published_date = :published_date,
              uploaded_date = :uploaded_date,
              runtime = :runtime
              where video_id = :video_id
            `;
            binds = [video_type, published_date, uploaded_date, runtime, video_id];
            result = await connection.execute(sql, binds, options);
            console.log(result);
          }else if(dict.type == "episode"){
            sql =`SELECT episode_id FROM refer_episode WHERE video_id = :id`;
            binds = [dict.video_id];
            result = await connection.execute(sql, binds, options);

            const episode_id = result.rows[0]["EPISODE_ID"];
            const video_id = dict.video_id;
//http://localhost:5000/insert_video?type=movie&video_name=myvideo&published_date=99/12/28&uploaded_date=99/12/28&runtime=30&description=hi

            const video_type = dict.type;
            const video_name =   dict.video_name;
            const published_date = dict.published_date;//(YY/MM/DD)
            const uploaded_date = dict.uploaded_date;
            const runtime = dict.runtime;
            const description = dict.description;
            const season = dict.season;
            const round = dict.round;

            sql = `
              update episode
              set description = '${description}',
              season = :season,
              round = :round
              where episode_id = :episode_id
            `;
            binds = [season, round, episode_id];
            result = await connection.execute(sql, binds, options);
            console.log(result);

            sql = `
              update video
              set video_name ='${video_name}',
              video_type = :video_type,
              published_date = :published_date,
              uploaded_date = :uploaded_date,
              runtime = :runtime
              where video_id = :video_id
            `;
            binds = [video_type, published_date, uploaded_date, runtime, video_id];
            result = await connection.execute(sql, binds, options);
            console.log(result);
          }else if(dict.type == "knu_original"){
            sql =`SELECT knu_original_id FROM refer_knu_original WHERE video_id = :id`;
            binds = [dict.video_id];
            result = await connection.execute(sql, binds, options);
            const knu_original_id = result.rows[0]["KNU_ORIGINAL_ID"];
            const video_id= dict.video_id;
//http://localhost:5000/insert_video?type=movie&video_name=myvideo&published_date=99/12/28&uploaded_date=99/12/28&runtime=30&description=hi

            const video_type = dict.type;
            const video_name =   dict.video_name;
            const published_date = dict.published_date;//(YY/MM/DD)
            const uploaded_date = dict.uploaded_date;
            const runtime = dict.runtime;
            const description = dict.description;

            sql = `
              update knu_original
              set description = '${description}'
              where knu_original_id = :knu_original_id
            `;
            binds = [knu_original_id];
            result = await connection.execute(sql, binds, options);
            console.log(result);

            sql = `
              update video
              set video_name = '${video_name}',
              video_type = :video_type,
              published_date = :published_date,
              uploaded_date = :uploaded_date,
              runtime = :runtime
              where video_id = :video_id
            `;
            binds = [video_type, published_date, uploaded_date, runtime, video_id];
            result = await connection.execute(sql, binds, options);
            console.log(result);
          }else{
            throw new Error("such type not exist, " + dict.type);
          }
          res.json(result);

        } catch(err) {
          console.log(err.toString())
          res.status(404).json(err.toString())
        }
    }

}

module.exports  = Update_video;
