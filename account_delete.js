class Account_delete{

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
          sql =`delete from v_account where account_id=:account_id and account_pw=:account_pw`;
          binds = [dict.account_id,dict.account_pw];
          result = await connection.execute(sql, binds, options);
          sql = `insert into v_account(account_id) values (:account_id)`;
          binds = [dict.account_id]
          result = await connection.execute(sql, binds, options);

          res.json(result.rows);

        } catch(err) {
          console.log(err.toString())
          res.status(404).json(err.toString())
        }
    }

}

module.exports  = Account_delete;
