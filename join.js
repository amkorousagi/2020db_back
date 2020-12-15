class Join{

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
          sql = `select count(*) as id from v_account`;
          binds = [];
          result = await connection.execute(sql, binds, options);
          const account_id_next = result.rows[0]["ID"] + 1;
          console.log(account_id_next);
          sql =`insert into v_account(account_id, account_pw, account_name, phone, sex,birth_date,address,job,permission)
          values (:account_id, '${ dict.account_pw}', '${dict.account_name}', ${dict.phone}, '${dict.sex}', '${dict.birth_date}', '${dict.address}', '${dict.job}', '${dict.permission}')`;
          binds = [account_id_next];
          result = await connection.execute(sql, binds, options);

          res.json([account_id_next, result.rows]);

        } catch(err) {
          console.log(err.toString())
          res.status(404).json(err.toString())
        }
    }

}

module.exports  = Join;
