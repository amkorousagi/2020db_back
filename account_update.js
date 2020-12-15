class Account_update{

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

          sql =`update v_account
          set account_pw='${dict.account_pw}', account_name='${dict.account_name}', phone=${dict.phone}, sex='${dict.sex}', birth_date='${dict.birth_date}', address='${dict.address}', job='${dict.job}', permission='${dict.permission}'
          where account_id=${dict.account_id}`;
          binds = [];
          result = await connection.execute(sql, binds, options);

          res.json([dict.account_id, result.rows]);

        } catch(err) {
          console.log(err.toString())
          res.status(404).json(err.toString())
        }
    }

}

module.exports  = Account_update;
