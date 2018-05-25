var mysql = require('mysql');
var config = require('../db/db_info').local;

module.exports = function () {
    return {
        createPool: function () {
            return mysql.createPool({
                host: config.host,
                port: config.port,
                user: config.user,
                password: config.password,
                database: config.database,
            })
        }
    }
};
