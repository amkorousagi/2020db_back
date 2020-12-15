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
            throw new ERROR("not allowed action");
          }


          if(dict.type == "movie"){
            const movie_id= dict.movie_id;
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
            const episode_id = dict.episode_id;
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
            const knu_original_id = dict.knu_original_id;
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
            throw new ERROR("such type not exist, " + dict.type);
          }
          res.status(400).json(result);

        } catch(err) {
          console.log(err.toString())
          res.status(404).json(err.toString())
        }
    }

}

module.exports  = Update_video;
